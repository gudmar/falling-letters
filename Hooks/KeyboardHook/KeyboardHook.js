const exceptionKeys = [
    'ArrowRight',
    'ArrowLeft',
    'ArrowUp',
    'ArrowDown',
    'F1','F2','F3','F4','F5','F6', 'F7','F8','F9','F10','F11','F12',
    'Insert',
    'Tab',
    'CapsLock',
    'Alt',
    'Control',
    'Shift',
    'Enter',
    'Delete',
    'ScrollLock',
    'Pause',
    'NumLock',
    'Insert',
    'Home',
    'PageUp',
    'PageDown',
    'End',
    'Meta',
    'Escape',
    'Bekspace',
    ' ',
    undefined,
]

const checkIfKeyException = (keyName) => exceptionKeys.includes(keyName);

class KeyboardHook {
    constructor(context) {
        this.context = context;
        this.addListeners()
    }
    addListeners() {
        rxjs.fromEvent(document, 'keydown').subscribe((event) => {
            console.log(event.key)
            this.context.keypressSubject$.next(event.key); // inform pausedSubject
        })

        this.context.keypressInformator$.pausedSubject.subscribe((keyName) => {
            console.log(keyName);
            const isException = checkIfKeyException(keyName);
            console.log('Is exception', isException)
            if (!isException) this.context.characterRemoveCause$.next({cause: HIT, id: null, character: keyName})
        })
    }
}