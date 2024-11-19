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
        this.subject = args.subject;
        this.input = this.element.querySelector('.input-time-input')
        this.input.value = secToString(this.subject.value)
        this.context = args.context;
        this.isPickerVisible = false;
        this.setPicker(args);
        this.addListeners();
    }

    openPicker() {
        if (!this.isPickerVisible) {
            this.isPickerVisible = true;
            document.append(this.picker);
        }
    }

    closePicker() {
        if (this.isPickerVisible) {
            this.isPickerVisible = false;
            this.picker.remove();
        }
    }

    addListeners() {
        this.input.value = secToString(this.subject.value)
        rxjs.fromEvent(this.input, 'input')
            .subscribe((event) => {
                console.log('InputTime: ', event.target.value)
            })
    }

    setPicker(args) {
        const pickersInterior = new TimePicker(args);
        this.picker = new Picker({
            ...args,
            component: pickersInterior,
        });
    }

}
