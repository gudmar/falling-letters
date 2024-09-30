const initialMoveRate = 0;
const initialNewLetterRate = 4;
const maxMoveRate = 9;
const minMoveRate = 0;
const maxNewLetter = 9;
const minNewLetter = 0;
const someEvenNumber = 0;
const someOddNumber = 1;

const nrOfPauseTogglesToIsPaused = (nrOfPauseToggles) => nrOfPauseToggles % 2 === 1
const getPauseHandler = (notPausedObservable) => (isPaused) => {
    if (isPaused) return rxjs.empty;
    return notPausedObservable
}

const getIncreasedRateValue = ({oldRateValue, maxValue }) => {
    if (oldRateValue >= maxValue) return oldRateValue
    return oldRateValue + 1
};
const getDecreasedRateValue = ({oldRateValue, minValue, maxValue}) => {
    if (oldRateValue <= minValue) return oldRateValue
    return oldRateValue - 1;
}

const rateActionToNewValueMap = {
    [INC]: getIncreasedRateValue,
    [DEC]: getDecreasedRateValue
}
const getNextRateValue = ({rate, action, minValue, maxValue}) => {
    if (typeof action === 'number') { return rate }
    const handler = rateActionToNewValueMap[action];
    if (!handler) throw new Error(`[handling new rate value]: action ${action} not recognized`);
    const nextValue = handler({oldRateValue: rate, minValue, maxValue});
    return nextValue;
}

class Rate {
    constructor({
        initialValue,
        minValue,
        maxValue,
    }) {
        rateSubject$ = new BehaviorSubject(initialValue);
        actionOnRate$ = new rxjs.BehaviorSubject(0);
        tick$ = this.rateSubject$.pipe(
            rxjs.switchMap((rate) => rxjs.interval(rate))
        )
        this.actionOnRate$.pipe(
            rxjs.scan((rate, action) => getNextRateValue({rate, action, minValue, maxValue}), initialValue)
        ).subscribe(((newValue) => this.rateSubject$.next(newValue).bind(this)))
    }

    increaseRate() { this.actionOnRate$.next(INC) }
    decreaseRate() { this.actionOnRate$.next(DEC) }
    setRate(value) { this.actionOnRate$.next(value) }

    // tick$
}

class PausedSubject {
    static nrOfPauseToggles$ = new BehaviorSubject(0);
    constructor(decoratedSubject) {
        pausedSubject = PausedSubject.nrOfPauseToggles$.pipe(
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
