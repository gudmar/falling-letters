const addIdIfDefined = (element, id) => {
    if (id) {
        element.id = id
    }
}

const addToParentIfDefined = (parent, element) => {
    if (parent) parent.append(element)
}

const addToIdIfDefined = (parentId, element) => {
    if (parentId) {
        const parent = document.getElementById(parentId);
        if (!parent) throw new Error(`Cannot add element to ${parentId} as element cannot be found`)
        addToParentIfDefined( parent, element)
    }
}

const addToParentOrToId = ({parentId, parent, element}) => {
    if (parent && parentId) throw new Error(`Define only parent or parentId: ${parentId}`)
    if (parent) {
        addToParentIfDefined(parent, element);
        return;
    }
    const parentFromId = document.getElementById(parentId)
    if (!parentFromId) throw new Error(`Element ${parentFromId} cannot be found`)
    addToParentIfDefined(parentFromId, element);
}
