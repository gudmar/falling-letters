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
        super(init)
        // this.subject = new rxjs.BehaviorSubject(init)
    }
    // get value () {
    //     return this.subject.value;
    // }

    increment(value) {
        const nextValue = this.value + value;
        this.next(nextValue);
    }
    decrement(value) {
        const nextValue = this.value - value;
        this.next(nextValue);
    }
}

class ContextProvider {
    // Here create all subjects
    
    static _context = {}
    static get context () { return ContextProvider._context }
    
    moveRateSubject$ = new rxjs.BehaviorSubject(initialMoveRate);
    newLetterRateSubject$ = new rxjs.BehaviorSubject(initialNewLetterRate);
    keypressSubject$ = new rxjs.BehaviorSubject();
    removeCharacterWithIdSubject$ = new rxjs.Subject();
    scoreSubject$ = new ExtendedSubject(INIT_SCORE);
    nrErrorsSubject$ = new ExtendedSubject(0);
    nrMissesSubject$ = new ExtendedSubject(0);

    thresholdReachedSubject$ = new rxjs.Subject()

    keypressInformator$ = new PausedSubject(this.keypressSubject$);

    moveTicks$ = new Rate({
        initialValue: initialMoveRate,
        minValue: minMoveRate,
        maxValue: maxMoveRate,
    })

    newLetterTicks$ = new Rate({
        initialValue: initialNewLetterRate,
        minValue: minNewLetter,
        maxValue: maxNewLetter,
    })

    pausedNewLetter = new PausedSubject(this.newLetterTicks$.tick$);

    pausedMoveTicks = new PausedSubject(this.moveTicks$.tick$);

    modalComponent$ = new rxjs.BehaviorSubject({element: document.createElement('div')})
    modalOpenClose$ = new rxjs.BehaviorSubject(CLOSE_MODAL_BY_AGENT);


    // _charactersGenerator$ = new rxjs.BehaviorSubject(nullElementEmitter)
    // _charactersGenerator$ = new rxjs.BehaviorSubject(getCharacterGenerator())
    _charactersGenerator$ = new rxjs.BehaviorSubject(getCharacterGenerator())


    characterEmitter$ = new rxjs.BehaviorSubject();

    // set charactersGenerator$(characterArrayGeneratorFunctions) {
        // const arrays = characterArrayGeneratorFunctions.map((f) => f());
        // const generator = getRandomArrayElementEmitter(arrays);
        // this._charactersGenerator$.next(generator);
    // }
    get charactersGenerator$() { return this._charactersGenerator$ }

    setInitialCharacterGenerator() {
        if (!checkIfGameOptionSelected()) return;
        const characterArrayGeneratorFunctions = getArrayGeneratorFunctions();
        // this.charactersGenerator$ = characterArrayGeneratorFunctions;
        this._charactersGenerator$.next(getCharacterGenerator())
    }

    // emitNextGameCharacter() {
    //     const character = this.charactersGenerator$.randomEmitter.next();
    //     this.characterEmitter$.next(character);
    // }
    
    // moveTick$ = this.moveRateSubject$.pipe(rxjs.switchMap((rate) => rxjs.interval(rate)));
    // newLetterTick$ = this.newLetterRateSubject$.pipe(rxjs.switchMap((rate) => rxjs.interval(rate)));

    // nrOfPauseToggles$ = new rxjs.BehaviorSubject(false);

    // pousedMoveTick$ = this.pouse$.pipe(
    //     rxjs.map(nrOfPauseTogglesToIsPaused),
    //     rxjs.switchMap(getPauseHandler(this.moveTick$))
    // )

    // pousedNewLetterTick = this.pouse$.pipe(
    //     rxjs.map(nrOfPauseTogglesToIsPaused),
    //     rxjs.switchMap(getPauseHandler(this.newLetterTick$))
    // )
}
