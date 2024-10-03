const throwIfTooManyArgs = ({
    componentId,
    parentId,
    parent,
    children,
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
    children,
    htmlTemplate,
    placeChildren,
}) => {
    const element = elementFromHtml(htmlTemplate);
    if (children) {
        placeChildren(element, children)
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
}) => {
    const wrapper = wrap({wrapperId, parentId, parent, children, wrappingTag, wrapperClasses});
    if (!placeChildren) { 
        children.forEach((child) => {
            if (typeof child === 'function') {
                const element = new child;
                wrapper.append(child)
            } else {
                wrapper.append(child)
            }
    })} else {
        placeChildren({ wrapper, children, context });
    }
    
    return wrapper;
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

class Component {
    constructor(args){
        throwIfTooManyArgs(args);
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
