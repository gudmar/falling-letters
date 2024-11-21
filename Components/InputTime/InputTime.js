const secToString = (timeInSec) => {
    const minutes = Math.floor(timeInSec / 60);
    const sec = timeInSec % 60;
    return `${minutes}:${sec}`
}

class InputTime extends Component {
    // left to do:
    // 1) Hook Picker=>TimePicker to InputTime
    // 2) Hook setting seconds and minutes in TimePicker
    // 3) Define a subject for time limit
    // 3.5) Set string on time limit change
    // 4) Define timer component, that will have its time set on this subject,
    static getTemplate(args) {
        return `
            <form class="input-time-wrapper">
                <label class="input-time-label" for="${args.id}">${args.label}</label>
                <div class="input-time-input">${secToString(args.subject.value)}</div>
                <div class="input-time-icon"></div>
            </form>
        `
    }
    // <input class="input-time-input" type="time" id="${args.id}"/>
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
        this.isPickerVisible$ = new rxjs.BehaviorSubject(false)
        this.subject = args.subject;
        this.input = this.element.querySelector('.input-time-input')
        this.input.value = secToString(this.subject.value)
        this.context = args.context;
        this.setPicker(args);
        this.addListeners();
        this.body = document.querySelector('body')
    }

    openPicker() {
        if (!this.isPickerVisible$.value) {
            this.isPickerVisible$.next(true);
            this.body.append(this.picker.element);
        }
    }

    closePicker() {
        if (this.isPickerVisible.value) {
            this.isPickerVisible$.next(false);
            this.picker.element.remove();
        }
    }

    addListeners() {
        this.input.value = secToString(this.subject.value)
        rxjs.fromEvent(this.input, 'click')
            .subscribe((event) => {
                this.openPicker()
                console.log('InputTime: ', event.target.value)
            })
    }

    setPicker(args) {
        const pickersInterior = new TimePicker(args);
        this.picker = new Picker({
            ...args,
            component: pickersInterior,
            close: this.closePicker.bind(this),
            parent: this.element,
        });
    }

}
