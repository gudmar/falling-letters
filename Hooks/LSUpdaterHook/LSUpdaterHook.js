class LocalStorageUpdaterHook {
    constructor(observedSubjects) {
        this.observedSubjects = observedSubjects;
        this.subscribe();
        console.log('Local storage update', this.observedSubjects)
    }
    subscribe() {
        rxjs.from(this.observedSubjects).subscribe(({key, subject}) => {
            console.log('Subscribing update', key, subject)
            subject.subscribe((value) => {
                updateGameParamInLs(key, value);
                console.log(`Updating ${key}: ${value}`)
            })
        })
    }
}
