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
    if (typeof action === 'number') { return action }
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
        getMapRateValueToInterval = (() => (value) => value),
    }) {
        this._currentRateValue = initialValue;
        const mapRateValueToInterval = getMapRateValueToInterval(maxValue)
        this.rateSubject$ = new rxjs.BehaviorSubject(initialValue);
        this.actionOnRate$ = new rxjs.BehaviorSubject(0);
        const that = this;
        this.tick$ = this.rateSubject$.pipe(
            rxjs.switchMap(
                (rate) => {
                    this._currentRateValue = rate;
                    const rateValue = mapRateValueToInterval(rate);
                    return rxjs.interval(rateValue)
                }
            ),
        )
        // const updateRateSubject = ((newValue) => this.rateSubject$.next(newValue)).bind(this)
        const updateRateSubject = ((newValue) => that.rateSubject$.next(newValue))
        this.actionOnRate$.pipe(
            rxjs.scan((rate, action) => getNextRateValue({rate, action, minValue, maxValue}), initialValue)
        ).subscribe(updateRateSubject);
    }

    increaseRate() { this.actionOnRate$.next(INC) }
    decreaseRate() { this.actionOnRate$.next(DEC) }
    setRate(value) { this.actionOnRate$.next(value); }
    get currentRateValue() { return this._currentRateValue }
    // tick$
}
