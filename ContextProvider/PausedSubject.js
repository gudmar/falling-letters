
const nrOfPauseTogglesToIsPaused = (nrOfPauseToggles) => {
    return nrOfPauseToggles % 2 === 1
}

const getPauseHandler = (notPausedObservable) => (isPaused) => {
    if (isPaused) return rxjs.empty();
    return notPausedObservable
}

class PausedSubject {
    static nrOfPauseToggles$ = new rxjs.BehaviorSubject(0);
    static _isPaused = INITIAL_IS_PAUSED;
    static set isPaused(v) {
        PausedSubject._isPaused = v;
    }
    static get isPaused() {return PausedSubject._isPaused}
    static onPause$ = new rxjs.Subject();
    static onResume$ = new rxjs.Subject();
    static onPauseToggle$ = new rxjs.BehaviorSubject(INITIAL_IS_PAUSED);
    constructor(decoratedSubject) {
        this.pausedSubject = PausedSubject.nrOfPauseToggles$.pipe(
            rxjs.map(nrOfPauseTogglesToIsPaused),
            rxjs.tap((isPaused) => {
                const isNoChange = isPaused === PausedSubject.onPauseToggle$.value;
                if (isNoChange) return;
                PausedSubject.isPaused = isPaused;
                PausedSubject.onPauseToggle$.next(isPaused)
            }),
            rxjs.switchMap(getPauseHandler(decoratedSubject))
        )
    }
    static togglePause() {
        const prevValue = PausedSubject.nrOfPauseToggles$.value
        PausedSubject.nrOfPauseToggles$.next(prevValue + 1)
        if (PausedSubject.isPaused) PausedSubject.onPause$.next();
        else (PausedSubject.onResume$.next())
    }
    static setPause() {
        PausedSubject.nrOfPauseToggles$.next(someOddNumber)
        PausedSubject.onPause$.next();
    }
    static resetPause() {
        PausedSubject.nrOfPauseToggles$.next(someEvenNumber)
        PausedSubject.onResume$.next();
    }
}
