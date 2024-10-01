const nrOfPauseTogglesToIsPaused = (nrOfPauseToggles) => nrOfPauseToggles % 2 === 1
const getPauseHandler = (notPausedObservable) => (isPaused) => {
    if (isPaused) return rxjs.empty;
    return notPausedObservable
}

class PausedSubject {
    static nrOfPauseToggles$ = new rxjs.BehaviorSubject(0);
    constructor(decoratedSubject) {
        this.pausedSubject = PausedSubject.nrOfPauseToggles$.pipe(
            rxjs.map(nrOfPauseTogglesToIsPaused),
            rxjs.switchMap(getPauseHandler(decoratedSubject))
        )
    }
    togglePause() {
        PausedSubject.nrOfPauseToggles$.next(PausedSubject.nrOfPauseToggles$ + 1)
    }
    setPause() {
        PausedSubject.nrOfPauseToggles$.next(someOddNumber)
    }
    resetPause() {
        PausedSubject.nrOfPauseToggles$.next(someEvenNumber)
    }

    // pausedSubject$
}
