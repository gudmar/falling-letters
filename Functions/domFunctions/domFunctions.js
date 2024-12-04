const addClassesToElement = (htmlElement, classNames) => {
    if (Array.isArray(classNames)) {
        classNames.forEach((className) => {
            if (typeof className !== 'string') throw new Error ('Class name should be a string')
            htmlElement.classList.add(className);
        })
    } else if (typeof classNames === 'string') {
        htmlElement.classList.add(classNames);
    } else {
        throw new Error('classNames should be a string or array of strings')
    }
}

const addDivToId = (id) => {
    const root = document.getElementById(id);
    const div = document.createElement('div');
    root.append(div);
    return div;
}

const appendChildrenToElement = ({element, children}) => {
    if (!children) return element;
    if (Array.isArray(children)) {
        children.forEach(() => {
            const childElement = child();
            element.append(childElement);    
        })    
    } else {
        const childElement = children();
        element.append(childElement);
    }
    return element;
}

const wrap = ({
    wrapperId,
    parentId,
    parent,
    children,
    wrappingTag,
    wrapperClasses}) => {
    const definedWrappingTag = wrappingTag || 'div'
    const wrapper = document.createElement(definedWrappingTag);
    if (wrapperClasses) addClassesToElement(wrapper, wrapperClasses)
    if (parent || parentId) addToParentOrToId({parent, parentId, element: wrapper})
    addIdIfDefined(wrapper, wrapperId);
    if (!children) return wrapper;
    if (Array.isArray(children)) {
        children.forEach((child) => {
            if (typeof child === 'function') {
                const childElement = child();
                wrapper.append(childElement);        
            } else {
                wrapper.append(child)
            }
        })    
    } else {
        const childElement = children();
        wrapper.append(childElement);
    }
    return wrapper;
}

const elementFromHtml = (htmlAsString) => {
    const template = document.createElement('template');
    template.innerHTML = htmlAsString;
    const element = template.content.cloneNode(true);
    const firstChild = element.firstElementChild;
    return firstChild;
}

const addElementWithClasses = ({
    parentId,
    parent,
    cssClassNames,
    elementTag='div',
    elementId
}) => {
    const element = document.createElement(elementTag);
    if (parent || parentId) addToParentOrToId({parent, parentId, element})
    addIdIfDefined(element, elementId);
    if (cssClassNames) addClassesToElement(element, cssClassNames);
    return element;
}

const title = (args) => addElementWithClasses({...args, elementTag: 'header', cssClassNames: args.cssClassNames ? [...[args.cssClassNames].flat(), 'h1'] : ['title']})
const header = (args) => addElementWithClasses({...args, elementTag: 'header', cssClassNames: args.cssClassNames ? [...[args.cssClassNames].flat(), 'h3'] : ['header']})
const subtitle = (args) => addElementWithClasses({...args, elementTag: 'header', cssClassNames: args.cssClassNames ? [...[args.cssClassNames].flat(), 'h2'] : ['subtitle']})
const div = (args) => addElementWithClasses({...args, elementTag: 'header', cssClassNames: args.cssClassNames ? [...[args.cssClassNames].flat(), 'div'] : ['section']})
const label = (args) => addElementWithClasses({...args, elementTag: 'header', cssClassNames: args.cssClassNames ? [...[args.cssClassNames].flat(), 'span'] : ['label']}) 

const elementToDocumentFragment = (element) => {
    const fragment = document.createDocumentFragment();
    fragment.append(element);
    return fragment
}

const getPlaceChildren = () => (element, children) => {
    const fragment = elementToDocumentFragment(element);
    const entries = Object.entries(children);
    entries.forEach(([className, child]) => {
        const container = fragment.querySelector(`.${className}`);
        container.append(child);
    });
    return fragment.firstElementChild;
}

const getBestScoreTableComponent = (context) => {
    
    const fillRowsWithEmpty = (rows) => {
        var filledRows = [];
        for(let rowIndex = 0; rowIndex < BEST_PLAYERS_LIST_LENGTH_LIMIT; rowIndex++) {
            if (rows[rowIndex]) filledRows.push([rowIndex + 1, ...rows[rowIndex]]);
            else filledRows.push([rowIndex + 1, '     _     ','  _   ', ' _ ', ' _ ', ' _ ', ' _ '])
        }
        return filledRows;
    }
    const bestScore = getFromLocalStorageOrDefault(BEST_SCORE_LIST, []);
    const rows = bestScore.map(
        ({
            playerName,
            time,
            score,
            misses,
            mistakes,
            moveSpeed,
            reactionTime,
            appearSpeed
        }) => ([
            playerName, 
            score, 
            misses, 
            mistakes, 
            moveSpeed, 
            appearSpeed, 
            reactionTime, 
            secondsToFullTimeString(time)
        ])
    );
    const headings = ['Nr', 'Player', 'Score', 'Misses', 'Errors', 'Move', 'Appear', 'Reaction time', 'Game time'];
    const table = new Table({
        context,
        rows: fillRowsWithEmpty(rows),
        headings,
        title: 'Highest score'
    })
    return table;
}
