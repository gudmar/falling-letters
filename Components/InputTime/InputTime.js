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
        return {
            ...args,
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
        console.log(args)
        console.log(secToString(args.subject.value))
        super(boostedArgs);
        this.subject = args.subject;
        // this.input = this.element.querySelector(`#${boostedArgs.id}`);
        // this.input = this.element.querySelector(`[id="${boostedArgs.id}"]`);
        this.input = this.element.querySelector('.input-time-input')
        console.log(secToString(this.subject.value))
        this.input.value = secToString(this.subject.value)
        console.log(this.element)
        console.log(this.input)
        this.context = args.context;
        this.addListeners();
    }

    addListeners() {
        this.input.value = secToString(this.subject.value)
        rxjs.fromEvent(this.input, 'input')
            .subscribe((event) => {
                console.log('InputTime: ', event.target.value)
            })
    }

}
