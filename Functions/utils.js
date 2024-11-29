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

const extractSecondsFromMiliSec = (time) => {
    const minutes = Math.floor(time/MILISECONDS_IN_SECUNDE);
    return minutes;
}

const extractMinutesFromMiliSec = (time) => {
    const minutes = Math.floor(time/MILISECONDS_IN_MINUTE);
    return minutes;
}

const extractMiliseconds = (time) => {
    const mSeconds = time % MILISECONDS_IN_SECUNDE;
    return mSeconds;
}

const secondsToFullTimeString = (time) => {
    const positiveTime = Math.max(0, time);
    const minutes = extractMinutes(positiveTime);
    const seconds = `${extractSeconds(positiveTime)}`;
    if (isNaN(minutes) || isNaN(seconds)) return '--:--'
    const text = `${minutes}:${seconds.padStart(2, '0')}`
    return text;
}

const mSecondsToFullTimeString = (time) => {
    const positiveTime = Math.max(0, time);
    const minutes = extractMinutesFromMiliSec(positiveTime);
    const seconds = `${extractSecondsFromMiliSec(positiveTime)}`;
    const miliseconds = `${extractMiliseconds(positiveTime)}`
    if (isNaN(minutes) || isNaN(seconds) || isNaN(miliseconds)) return '--:--:--'
    const text = `${minutes}:${seconds.padStart(2, '0')}:${miliseconds.padStart(3, '0')}`
    return text;

}
