
const nrOfPauseTogglesToIsPaused = (nrOfPauseToggles) => nrOfPauseToggles % 2 === 1

const getPauseHandler = (notPausedObservable) => (isPaused) => {
    console.log('Is paused', isPaused, notPausedObservable)
    if (isPaused) return rxjs.empty();
    return notPausedObservable
}

class PausedSubject {
    static nrOfPauseToggles$ = new rxjs.BehaviorSubject(0);
    static isPaused = false;
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
        PausedSubject.nrOfPauseToggles$.next(PausedSubject.nrOfPauseToggles$ + 1)
        if (PausedSubject.isPaused) onPouse$.next();
        else (onResume$.next())
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
