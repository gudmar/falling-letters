class Picker extends Component {
    static getCords(element) {
        const {left, right} = element.getBoundingClientRect();
        return {left, right};
    }
    static getHtmlTemplate(args) {
        const {left, right} = Picker.getCords(args.parent);
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
            schema: {
                close: {
                    type: FUNCTION,
                    requirement: MANDATORY
                },
                parent: {
                    type: OBJECT,
                    requirement: MANDATORY
                }
            }
        }
    }
    constructor(args){
        const boostedArgs = Picker.getBoostedArgs(args);
        super(boostedArgs);
        console.log(this.element)
        this.parentElement = args.parent;
        this.component = args.component;
        this.close = args.close;
        this.wrapper = this.element.querySelector(`.Picker-wrapper`);
        this.clickAway = this.element//.querySelector('.Picker-click-away')
        this.addInterior();
        this.addListeners();
    }

    addListeners() {
        rxjs.fromEvent(this.clickAway, 'click')
            .subscribe(() => {
                console.log('In clise in Picker')
                const {left, right} = Picker.getCords(this.parentElement);
                this.wrapper.style.left = left;
                this.wrapper.style.right = right;
                this.close();
            })
    }

    addInterior() {
        this.wrapper.append(this.component.element);
    }
}
