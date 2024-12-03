class LocalStorageUpdaterHook {
    constructor(observedSubjects) {
        this.observedSubjects = observedSubjects;
        this.subscribe();
    }
    subscribe() {
        rxjs.from(this.observedSubjects).subscribe(({key, subject}) => {
            subject.subscribe((value) => {
                updateGameParamInLs(key, value);
            })
        })
    }
}
