const initialMoveRate = 5; //50 //0;
const initialNewLetterRate = 3//3000//4;
const maxMoveRate = 10;
const minMoveRate = 1;
const maxNewLetter = 10;
const minNewLetter = 1;
const someEvenNumber = 0;
const someOddNumber = 1;

const getMapMoveRateValueToInterval = (max) => (rateFactor) => {
    const mirroredRateValue = max - rateFactor + 1;
    return mirroredRateValue * 10
}

const getMapAppearRateValueToInterval = (max) => (rateFactor) => {
    const mirroredRateValue = max - rateFactor + 1;
    return mirroredRateValue * 1000
}


class ExtendedSubject extends rxjs.BehaviorSubject {
    constructor(init) {
        super(init);
    }

    increment(value) {
        const nextValue = this.value + value;
        this.next(nextValue);
    }
    decrement(value) {
        const nextValue = this.value - value;
        this.next(nextValue);
    }
}


const getRateWithGameEndAndPause = ({
    initialRateValue,
    minRateValue,
    maxRateValue,
    gameStateSubject,
    getMapRateValueToInterval,
}) => {
    const ticks = new Rate({
        initialValue: initialRateValue,
        minValue: minRateValue,
        maxValue: maxRateValue,
        getMapRateValueToInterval
    });
    const ticksWithGameEnd = new SubjectWithGameEndedDecorator({
        gameStateSubject,
        originalSubject: ticks.tick$,
    })
    const pausedSubjectWithGameEnd = new PausedSubject(ticksWithGameEnd.decorated)
    return {
        pausedSubjectWithGameEnd,
        setRate: ticks.setRate.bind(ticks),
        value: ticks.currentRateValue,
    };
}

const getPausableImpulseGeneratorWithGameEnd = ({
    timeInterval,
    gameState$,
}) => {
    const clock$ = rxjs.interval(timeInterval);
    const shouldRun$ = rxjs.merge(PausedSubject.onPauseToggle$, gameState$)
        .pipe(
            rxjs.switchMap(
                (v) => {
                    if (PausedSubject.isPaused || gameState$.value === GAME_ENDED) {
                        return rxjs.empty();
                    }
                    return clock$;
                }
            )
        )
    return shouldRun$
}

class ContextProvider {
    static _context = {}
    static get context () { return ContextProvider._context }
    static gameState$ = new rxjs.BehaviorSubject(START_NEW_GAME); // START_NEW_GAME | GAME_ENDED

    keypressSubject$ = new SubjectWithGameEndedDecorator({
        gameStateSubject: ContextProvider.gameState$,
        originalSubject: new rxjs.Subject(),
    })
    removeCharacterWithIdSubject$ = new rxjs.Subject();
    scoreSubject$ = new SubjectWithGameEndedDecorator({
        initialValue: INIT_SCORE,
        gameStateSubject: ContextProvider.gameState$,
        originalSubject: new rxjs.BehaviorSubject(INIT_SCORE),
    })
    playerName$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault(PLAYER_NAME, DEFAULT_PLAYER_NAME));
    moveSpeed$ = new ExtendedSubject(getFromLocalStorageOrDefault('moveSpeed', INIT_MOVE_SPEED));
    appearSpeed$ = new ExtendedSubject(getFromLocalStorageOrDefault('appearSpeed', INIT_APPEAR_SPEED));
    maxMissed$ = new ExtendedSubject(getFromLocalStorageOrDefault(NR_MISSES_THRESHOLD, MAX_MISSED_DEFAULT));
    maxMistaken$ = new ExtendedSubject(getFromLocalStorageOrDefault(NR_ERRORS_THRESHOLD, MAX_MISTAKEN_DEFAULT));
    resetOnMiss$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault('resetOnMiss', false));
    endGameOnThresholdsBroken$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault(END_GAME_ON_THRESHOLD_BROKEN, true));
    nrErrorsSubject$ = new ExtendedSubject(0);
    nrMissesSubject$ = new ExtendedSubject(0);
    shouldEndGameOnTimeoutSubject$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault(SHOULD_END_GAME_ON_TIMEOUT, true));
    endGameTimeoutValueSubject$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault(END_GAME_TIMEOUT, END_GAME_DEFAULT_TIMEOUT));
    currentTimeoutValueSubject$ = new rxjs.BehaviorSubject(this.endGameTimeoutValueSubject$.value);
    timeoutClockImpulseGenerator$ = getPausableImpulseGeneratorWithGameEnd({
        timeInterval: 1000, gameState$: ContextProvider.gameState$
    })
    thresholdReachedSubject$ = new rxjs.Subject()

    keypressInformator$ = new PausedSubject(this.keypressSubject$.decorated);

    newLetterRate = getRateWithGameEndAndPause({
        initialRateValue: initialNewLetterRate,
        minRateValue: minNewLetter,
        maxRateValue: maxNewLetter,
        gameStateSubject: ContextProvider.gameState$,
        getMapRateValueToInterval: getMapAppearRateValueToInterval
    })

    pausedNewLetterWithGameEnd = this.newLetterRate.pausedSubjectWithGameEnd;
    setNewLetterRate = this.newLetterRate.setRate.bind(this.pausedNewLetterWithGameEnd);

    moveTicksRate =  getRateWithGameEndAndPause({
        initialRateValue: initialMoveRate,
        minRateValue: minMoveRate,
        maxRateValue: maxMoveRate,
        gameStateSubject: ContextProvider.gameState$,
        getMapRateValueToInterval: getMapMoveRateValueToInterval
    })

    pausedMoveTicks = this.moveTicksRate.pausedSubjectWithGameEnd;
    setMoveTicks = this.moveTicksRate.setRate

    modalComponent$ = new rxjs.BehaviorSubject({element: document.createElement('div')})
    modalOpenClose$ = new rxjs.BehaviorSubject(CLOSE_MODAL_BY_AGENT);

    _charactersGenerator$ = new SubjectWithGameEndedDecorator({
        initialValue: getCharacterGenerator(),
        gameStateSubject: ContextProvider.gameState$,
        originalSubject: new rxjs.BehaviorSubject(getCharacterGenerator())
    })

    characterEmitter$ = new rxjs.BehaviorSubject();

    get charactersGenerator$() { return this._charactersGenerator$ }

    setInitialCharacterGenerator() {
        if (!checkIfGameOptionSelected()) return;
        this._charactersGenerator$.next(getCharacterGenerator())
    }

    constructor(){
        // this.timeoutClockImpulseGenerator$.subscribe((v) => console.log(v))
    }

}
