class AllCharactersLiveTime {

    constructor(args) {
        this.context = args.context;
        this.displayedSubject = new rxjs.BehaviorSubject(mSecondsToFullTimeString(0));
        const liveTime = new WithLabel({
            component: Display,
            label: 'Reaction time',
            subject: this.displayedSubject,
            context: args.context,
        });
        this.element = liveTime.element; 
        this.startMeasurement();
    }

    startMeasurement() {
        this.context.preciseClock$.subscribe(function(newTimeInMs){
            const currentNrOfCharacters = CharacterMonitorHook.getNrOfCharactersCurrentlyInGame(this.context);
            const deltaForThisTimestamp = currentNrOfCharacters * PRECISE_CLOCK_TICK_INTERVAL;
            const allCharactersLivedLastValue = this.context.sumTimeAllCharactersLived$.value;
            const allCharactersLivedNextValue = deltaForThisTimestamp + allCharactersLivedLastValue;
            this.context.sumTimeAllCharactersLived$.next(allCharactersLivedNextValue);
        }.bind(this))
        this.context.sumTimeAllCharactersLived$.subscribe(function(newTimeInMs){
            const nrOfCharactersSoFar = this.context.countAllCharactersSoFar$.value;
            const rate = Math.round(newTimeInMs / nrOfCharactersSoFar);
            const rateAsString = mSecondsToFullTimeString(rate);
            this.displayedSubject.next(rateAsString)
        }.bind(this))
    }
}
