class SubjectWithGameEndedDecorator {
    constructor({
        initialValue,
        gameStateSubject,
        originalSubject,
    }) {
        this._value = initialValue;
        this.gameState$ = gameStateSubject;
        this.originalSubject = originalSubject;
        this.subjectIfGameEnded = gameStateSubject.pipe(
            rxjs.switchMap((currentGameState) => {
                if (currentGameState === START_NEW_GAME) return originalSubject;
                return rxjs.empty();
            })
        )
    }

    get decorated(){ return this.subjectIfGameEnded }
    subscribe(callback) {
        const subscribtion = this.subjectIfGameEnded.subscribe(callback);
        return subscribtion
    }
    unsubscribe(subscribtion) {
        this.subjectIfGameEnded.unsubscribe(subscribtion);
    }
    get isGameEnded() { 
        return this.gameState$.value !== START_NEW_GAME;
    }
    next(value){
        if (this.isGameEnded) return;
        this._value = value;
        this.originalSubject.next(value);
    }
    increment(interval) {
        if (typeof this._value !== 'number') {
            throw new Error('Value is not a number')
        };
        if (typeof interval !== 'number') {
            throw new Error('Interval is not a number')
        }
        const nextValue = this._value + interval;
        this.next(nextValue);
    }
    decrement(interval) {
        this.increment(-interval);
    }
    get value() {
        if (this.subjectIfGameEnded.value) return this.subjectIfGameEnded.value;
        return this._value
    }
}
