
const nrOfPauseTogglesToIsPaused = (nrOfPauseToggles) => {
    console.log('In nrOfPuaseToggles', nrOfPauseToggles)
    console.log(JSON.stringify(nrOfPauseToggles))
    return nrOfPauseToggles % 2 === 1
}

const getPauseHandler = (notPausedObservable) => (isPaused) => {
    // console.log('Is paused', isPaused, notPausedObservable)
    if (isPaused) return rxjs.empty();
    return notPausedObservable
}

class PausedSubject {
    static nrOfPauseToggles$ = new rxjs.BehaviorSubject(0);
    static _isPaused = false;
    static set isPaused(v) {PausedSubject._isPaused = v; console.log('setting pause to', v)}
    static get isPaused() {return PausedSubject._isPaused}
    static onPouse$ = new rxjs.Subject();
    static onResume$ = new rxjs.Subject();
    constructor(decoratedSubject) {
        this.pausedSubject = PausedSubject.nrOfPauseToggles$.pipe(
            rxjs.map(nrOfPauseTogglesToIsPaused),
            rxjs.tap((isPaused) => PausedSubject.isPaused = isPaused),
            rxjs.switchMap(getPauseHandler(decoratedSubject))
        )
        // this.pausedSubject.subscribe((v) => {console.log(v)})
    }
    static togglePause() {
        const prevValue = PausedSubject.nrOfPauseToggles$.value
        console.log('Prev', prevValue)
        PausedSubject.nrOfPauseToggles$.next(prevValue + 1)
        if (PausedSubject.isPaused) onPouse$.next();
        else (PausedSubject.onResume$.next())
    }
    static setPause() {
        PausedSubject.nrOfPauseToggles$.next(someOddNumber)
        PausedSubject.onPouse$.next();
    }
    static resetPause() {
        PausedSubject.nrOfPauseToggles$.next(someEvenNumber)
        PausedSubject.onResume$.next();
    }

    // pausedSubject$
}
