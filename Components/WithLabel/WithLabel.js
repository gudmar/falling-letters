class WithLabel extends Component {
    static mandatoryParams = ['component', 'label']
    static getHtmlTemplate(args) {
        const result = `
            <div class="with-label-wrapper">
                <div class="with-label-label">
                    ${args.label}
                </div>
            </div>
        `
        return result
    }
    static getBoostedArgs(args) {
        const result = {
            ...args,
            htmlTemplate: WithLabel.getHtmlTemplate(args)
        };
        return result;
    }

    constructor(args) {
        const boostedArgs = WithLabel.getBoostedArgs(args);
        super(boostedArgs);
        this.component = new args.component(args);
        this.label = args.label;
        console.log(this.element)
        // this.wrapper = this.element.querySelector('.with-label-wrapper');
        this.element.append(this.component.element)
    }
}
