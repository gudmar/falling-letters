const initialMoveRate = 0;
const initialNewLetterRate = 4;
const maxMoveRate = 9;
const minMoveRate = 0;
const maxNewLetter = 9;
const minNewLetter = 0;
const someEvenNumber = 0;
const someOddNumber = 1;

class ContextProvider {
    // Here create all subjects
    
    static _context = {}
    static get context () { return ContextProvider._context }
    moveRateSubject$ = new rxjs.BehaviorSubject(initialMoveRate);
    newLetterRateSubject$ = new rxjs.BehaviorSubject(initialNewLetterRate);

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

    pausedNewLetter = new PausedSubject(this.newLetterTicks$);

    pausedMoveTicks = new PausedSubject(this.moveTicks$);

    modalComponent$ = new rxjs.BehaviorSubject({element: document.createElement('div')})
    modalOpenClose$ = new rxjs.BehaviorSubject(CLOSE_MODAL);

    defaultCharacterGenerator$ = getRandomArrayElementEmitter(['?'])

    _charactersGenerator$ = new rxjs.BehaviorSubject(null)

    characterEmitter$ = new rxjs.BehaviorSubject();

    set charactersGenerator$(characterArrayGeneratorFunctions) {
        const arrays = characterArrayGeneratorFunctions.map((f) => f());
        const generator = getRandomArrayElementEmitter(arrays);
        this._charactersGenerator$.next(generator);
    }

    setInitialCharacterGenerator() {
        if (!checkIfGameOptionSelected()) return;
        const characterArrayGeneratorFunctions = getArrayGeneratorFunctions();
        this.charactersGenerator$ = characterArrayGeneratorFunctions;
    }

    emitNextGameCharacter() {
        const character = this._charactersGenerator$.randomEmitter.next();
        this.characterEmitter$.next(character);
    }
    
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
