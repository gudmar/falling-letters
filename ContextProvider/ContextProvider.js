const initialMoveRate = 50 //0;
const initialNewLetterRate = 3000//4;
const maxMoveRate = 9;
const minMoveRate = 0;
const maxNewLetter = 9;
const minNewLetter = 0;
const someEvenNumber = 0;
const someOddNumber = 1;


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
    gameStateSubject
}) => {
    const ticks = new Rate({
        initialValue: initialRateValue,
        minValue: minRateValue,
        maxValue: maxRateValue,
    });
    const ticksWithGameEnd = new SubjectWithGameEndedDecorator({
        gameStateSubject,
        originalSubject: ticks.tick$,
    })
    const pausedSubjectWithGameEnd = new PausedSubject(ticksWithGameEnd.decorated)
    return pausedSubjectWithGameEnd;
}

class ContextProvider {
    // Here create all subjects
    
    static _context = {}
    static get context () { return ContextProvider._context }
    static gameState$ = new rxjs.BehaviorSubject(START_NEW_GAME); // START_NEW_GAME | GAME_ENDED

    moveRateSubject$ = new rxjs.BehaviorSubject(initialMoveRate);
    newLetterRateSubject$ = new rxjs.BehaviorSubject(initialNewLetterRate);
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
    moveSpeed$ = new ExtendedSubject(getFromLocalStorageOrDefault('moveSpeed', INIT_MOVE_SPEED));
    appearSpeed$ = new ExtendedSubject(getFromLocalStorageOrDefault('appearSpeed', INIT_APPEAR_SPEED));
    maxMissed$ = new ExtendedSubject(getFromLocalStorageOrDefault(NR_MISSES_THRESHOLD, MAX_MISSED_DEFAULT));
    maxMistaken$ = new ExtendedSubject(getFromLocalStorageOrDefault(NR_ERRORS_THRESHOLD, MAX_MISTAKEN_DEFAULT));
    resetOnMiss$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault('resetOnMiss', false));
    endGameOnThresholdsBroken$ = new rxjs.BehaviorSubject(getFromLocalStorageOrDefault(END_GAME_ON_THRESHOLD_BROKEN, true));
    nrErrorsSubject$ = new ExtendedSubject(0);
    nrMissesSubject$ = new ExtendedSubject(0);
    

    thresholdReachedSubject$ = new rxjs.Subject()

    keypressInformator$ = new PausedSubject(this.keypressSubject$.decorated);

    pausedNewLetterWithGameEnd = getRateWithGameEndAndPause({
        initialRateValue: initialNewLetterRate,
        minRateValue: minNewLetter,
        maxRateValue: maxNewLetter,
        gameStateSubject: ContextProvider.gameState$
    })

    pausedMoveTicks = getRateWithGameEndAndPause({
        initialRateValue: initialMoveRate,
        minRateValue: minMoveRate,
        maxRateValue: maxMoveRate,
        gameStateSubject: ContextProvider.gameState$
    })

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
        const characterArrayGeneratorFunctions = getArrayGeneratorFunctions();
        this._charactersGenerator$.next(getCharacterGenerator())
    }

}
