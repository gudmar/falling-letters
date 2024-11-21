const throwIfTooManyArgs = ({
    componentId,
    parentId,
    parent,
    children,
    slotChildren,
    elementTag,
    elementClasses,
    elementId,
    wrappingTag,
    wrapperClasses,
    htmlTemplate,
    placeChildren,
    context
}) => {
    if (context === undefined) throw new Error('Context cannot be undefined. If your are sure no context will be provided to the component, set it to null')
    if(parent && parentId) throw new Error('parent and parentId cannot be defined simultaneously');
    if (htmlTemplate && (elementTag || elementClasses || elementId)) throw new Error('htmlTemplate cannot be defined with elementTag or elementClasses or elementId')
    if (htmlTemplate && (wrapperClasses || wrappingTag)) throw new Error('htmlTemplate, wrapperClasses and wrappingTag cannot be defined at the same time');
    if (htmlTemplate && children && !placeChildren) throw new Error('htmlTemplate with children has to have a placeChildren function, that knows where to place child items')
    if (wrapperClasses && !wrappingTag) throw new Error('wrapperTag should be defined together with wrapperClasses')
    if (!wrappingTag && children) throw new Error('Children have to have a wrapping tag defined')
}

const getElementFromTemplate = ({
    slotChildren,
    htmlTemplate,
    placeChildren,
}) => {
    const element = elementFromHtml(htmlTemplate);
    if (slotChildren) {
        return placeChildren(element, slotChildren)
    }
    return element;
}
const getElementFromElementTag = ({
    elementTag, elementClasses, elementId,
    wrapperTag, wrapperClasses, parent, parentId
}) => {
    const element = addElementWithClasses({
        parentId, parent, cssClassNames: elementClasses, elementTag, elementId
    });
    if (wrapperTag) {
        const wrapper = wrap({
            wrappperId, parentId, parent, wrappingTag, wrapperClasses
        })
        return wrapper
    }
    return element;
}

const getElementFromChildren = ({
    wrappingTag, wrapperClasses, children, parentId, parent, placeChildren, wrapperId,
    htmlTemplate,
}) => {
    
    if (!placeChildren) { 
        const wrapper = wrap({wrapperId, parentId, parent, children, wrappingTag, wrapperClasses});
        children.forEach((child) => {
            if (typeof child === 'function') {
                const element = new child;
                wrapper.append(child)
            } else {
                wrapper.append(child)
            }
        
        })
        return wrapper;
    } else {
        if (!htmlTemplate) {
            throw new Error('Cannot slot children without a template')
        }
        // placeChildren({ wrapper, children, context });
        const element = elementFromHtml(htmlTemplate)
        const elementWithPlacedChildren = placeChildren(element, children);
        return elementWithPlacedChildren
    }
    
    throw new Error('getElementFromTemplate: some case not implemented')
}

const getComponentElementFromArgs = (args) => {
    const {
        children,
        elementTag,
        htmlTemplate,
    } = args
    if (htmlTemplate) return getElementFromTemplate(args);
    if (elementTag) return getElementFromElementTag(args);
    if (children) return getElementFromChildren(args);
}

const getValidateType = (args) => (key, type) => {
    const value = args[key];
    const typeToValidationFunctionMap = {
        [ARRAY]: (value) => Array.isArray(value),
        [OBJECT]: (value) => {
            if (Array.isArray(value)) return false;
            const valueType = typeof value;
            if (['number', 'string', 'bigInt', 'symbol', 'undefined', 'null'].includes(valueType)) return false;
            return true;                
        },
        [NUMBER]: (value) => typeof value === 'number',
        [STRING]: (value) => typeof value === 'string',
        [FUNCTION]: (value) => typeof value === 'function'
    }
    const validator = typeToValidationFunctionMap[type];
    if (!isDefined(validator)) throw new Error(`${type} is not supported in validateScheme`)
    return validator(value);
}

const getValidateParam = (args) => (key, {type, requirement}) => {
    const validateType = getValidateType(args);
    if (requirement === MANDATORY) {
        const value = args[key];
        if (!isDefined(value)) throw new Error(`Mandatory property ${key} is not defined`);
    } else if (requirement === OPTIONAL) {
        const value = args[key];
        if (!isDefined(value)) return;
    } else {
        throw new Error(`Requirement ${requirement} is not supported in scheme validator`)
    }
    const isTypeValid = validateType(key, type);
    if (!isTypeValid) throw new Error(`${key} should be of the type ${type}`)            
}

const throwIfNotFollowingScheme = (args) => {
    const { scheme } = args;
    if ( !isDefined(scheme) ) return;
    const entries = Object.entries(scheme);
    const validateParam = getValidateParam(args);
    entries.forEach(([key, descriptor]) => validateParam(key, descriptor));
}

class Component {
    static throwIfNotMandatoryFields(mandatoryKeysList, args, errorMesage) {
        const result = mandatoryKeysList.every((key) => args[key] !== undefined)
        if (!result) throw new Error(errorMesage)
    }

    constructor(args){
        throwIfTooManyArgs(args);
        throwIfNotFollowingScheme(args);
        const {
            componentId, // tell apart component, subscribe, NOT a html id
            parentId,
            parent,
            children, // may be a class component or an html element. Class component has to get context
            wrappingTag,
            wrapperClasses,
            htmlTemplate,
            placeChildren,
            elementTag,
            elementId,
            context
        } = args;
        const element = getComponentElementFromArgs(args);
        this._id = componentId;
        this._element = element;
        this._context = context;
        this._elementId = elementId;
        this._parentId = parentId;
        this._parent = parent
        try {
            if (parentId) {
                const tempParent = document.getElementById(parentId);
                if (tempParent) this._parent = tempParent;
            }
        } catch(e) {}
    }
    get element() { return this._element }
    get elementId() { return this._elementId }
    get context() { return this._context }
    set context(v) {this._context = v}
    get parent() {
        if (!this._parentId) throw new Error(`Component: no parent found`)
        return this._parent
    }
    set toContext({key, value}) {
        // if (!this._id) throw new Error('Component has to have a unique id to set something to context')
        this._context[key] = value
    }

    set fromContext(key) {
        delete this._context[key]
    }
}
