const isDefined = (value) => {
    if (value === undefined || value === null) return false;
    return true
}

const disableHighlight = () => {
    rxjs.fromEvent(document, 'selectstart').subscribe((e) => {
        e.preventDefault();
        e.stopPropagation();
    })
}
