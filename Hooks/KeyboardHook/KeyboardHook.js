class KeyboardHook {
    constructor(context) {
        this.context = context;
        this.addListeners()
    }
    addListeners() {
        rxjs.fromEvent(document, 'keydown').subscribe((event) => {
            console.log('Key', event.key)
            this.context.keypressSubject$.next(event.key);
        })
        this.context.keypressInformator$.pausedSubject.subscribe((keyName) => {
            console.log(keyName);
            this.context.characterRemoveCause$.next({cause: HIT, id: null, character: keyName})
        })
    }
}