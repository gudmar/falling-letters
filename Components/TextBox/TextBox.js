class TextBox extends Component {
    static boostArgs(args) {
        return {
            ...args,
            htmlTemplate: TextBox.getHtmlTemplate(args),
        }
    }
    static getHtmlTemplate(args) {
        return `
            <div class = "TextBox-wrapper">
               <label class="TextBox-label" for="${args.id}">${args.label}</label>
               <input id="${args.id}" spellcheck="false" type = "text" class="TextBox-input"/>
            </div>
        `
    }

    constructor(args) {
        const id = getUuid();
        const boostedArgs = TextBox.boostArgs({...args, id});
        super(boostedArgs);
        this.input = this.element.querySelector('input');
        this._value = args.value || '';
        this.input.value = this._value;
        this.callback = args.callback || (() => {});
        this.addListeners();
    }

    set value(newValue) {
        this._value = newValue;
        this.input.value = this._value;
    }

    get value() {
        return this.input.value;
    }

    addListeners() {
        rxjs.fromEvent(this.input, 'input')
        .pipe(rxjs.debounceTime(300))
        .subscribe(((e) => {
            this._value = e.target.value;
            this.callback(e.target.value);
        }).bind(this))
    }
}

