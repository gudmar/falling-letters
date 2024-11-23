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

const extractMinutes = (time) => {
    const minutes = Math.floor(time/SECONDS_IN_MINUTE);
    return minutes;
}

const extractSeconds = (time) => {
    const seconds = time % SECONDS_IN_MINUTE;
    return seconds;
}

const secondsToFullTimeString = (time) => {
    const minutes = extractMinutes(time);
    const seconds = `${extractSeconds(time)}`;
    const text = `${minutes}:${seconds.padStart(2, '0')}`
    return text;
}
