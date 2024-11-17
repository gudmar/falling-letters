class InputTime extends Component {
    static getTemplate(args) {
        return `
            <form class="input-time-form">
                <label class="input-time-label" for="${args.id}">${args.label}</label>
                <input class="input-time-input" type="time" id="${args.id}"/>
            </form>
        `
    }
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
        super(boostedArgs);
        this.subject = args.subject;
        // this.input = this.element.querySelector(`#${boostedArgs.id}`);
        this.input = this.element.querySelector(`[id="${boostedArgs.id}"]`);
        console.log(this.input)
        this.context = args.context;
        this.addListeners();
    }

    addListeners() {
        rxjs.fromEvent(this.input, 'input')
            .subscribe((event) => {
                console.log('InputTime: ', event.target.value)
            })
    }

}
