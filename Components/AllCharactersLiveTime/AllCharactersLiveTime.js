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
            this.displayedSubject.next(mSecondsToFullTimeString(newTimeInMs * 10));
        }.bind(this))
    }
}
