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
