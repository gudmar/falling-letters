class Picker extends Component {
    static getCords(args) {
        const {left, right} = args.Component.Element.getBoundingClientRect();
        return {left, right};
    }
    static getHtmlTemplate(args) {
        const {left, right} = Picker.getCords(args);
        return `
            <div class="Picker-click-away">
                <div class="Picker-wrapper" style="left: ${left}px; right: ${right}px">

                </div>
            </div>
        `
    }
    static getBoostedArgs(args) {
        return {
            ...args,
            htmlTemplate: Picker.getHtmlTemplate(args),
        }
    }
    constructor(args){
        const boostedArgs = Picker.getBoostedArgs(args);
        super(boostedArgs);
        this.component = args.component;
        this.wrapper = this.element.querySelector(`.Picker-wrapper`);
        this.addInterior();
    }

    addInterior() {
        this.wrapper.append(this.component.element);
    }
}
