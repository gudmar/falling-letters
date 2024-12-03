const secToString = (timeInSec) => {
    const minutes = Math.floor(timeInSec / 60);
    const sec = timeInSec % 60;
    return `${minutes}:${sec}`
}

class InputTime extends Component {
    static getTemplate(args) {
        return `
            <form class="input-time-wrapper">
                <label class="input-time-label" for="${args.id}">${args.label}</label>
                <div class="input-time-input">${secToString(args.subject.value)}</div>
                <div class="input-time-icon"></div>
            </form>
        `
    }
    static getBoostedArgs(args) {
        const id = getUuid();
        const scheme = {
            max: {
                type: NUMBER,
                requirement: MANDATORY,
            },
            min: {
                type: NUMBER,
                requirement: MANDATORY,
            },
            secondsStep: {
                type: NUMBER,
                requirement: MANDATORY,
            },
            subject: {
                type: OBJECT,
                requirement: MANDATORY,
            },
        }
        return {
            ...args,
            scheme,
            htmlTemplate: InputTime.getTemplate({...args, id}),
            id,
        }
    }
    static throwIfParamsMissing(args) {
        const keys = Object.keys(args);
        const mandatoryKeys = ['label', 'subject'];
        const isEveryKeyPresent = mandatoryKeys.every((key) => keys.includes(key));
        if (!isEveryKeyPresent) throw new Error('Mandatory key missing from InputTime component');
    }

    constructor(args){
        InputTime.throwIfParamsMissing(args);
        const boostedArgs = InputTime.getBoostedArgs(args);
        super(boostedArgs);
        this.args = boostedArgs;
        this.isPickerVisible$ = new rxjs.BehaviorSubject(false)
        this.subject = args.subject;
        this.input = this.element.querySelector('.input-time-input')
        this.input.innerText = secToString(this.subject.value)
        this.context = args.context;
        this.callback = args.callback || (() => {})
        this.addListeners();
        this.body = document.querySelector('body')
    }

    openPicker() {
        if (!this.isPickerVisible$.value) {
            this.isPickerVisible$.next(true);
            this.createPicker();
            this.body.append(this.picker.element);
        }
    }

    closePicker() {
        if (this.isPickerVisible$.value) {
            this.isPickerVisible$.next(false);
            this.picker.element.remove();
        }
    }

    addListeners() {
        this.subject.subscribe((newTime) => {
            const minutes = extractMinutes(newTime);
            const seconds = `${extractSeconds(newTime)}`;
            const asString = `${minutes}:${seconds.padStart(2, '0')}`;
            this.input.innerText = asString;
            this.callback(newTime);
        } )
        rxjs.fromEvent(this.input, 'click')
            .subscribe((event) => {
                this.openPicker()
            })
        
    }

    createPicker() {
        const pickersInterior = new TimePicker(this.args);
        this.picker = new Picker({
            ...this.args,
            component: pickersInterior,
            close: this.closePicker.bind(this),
            parent: this.element,
        });
    }

}
