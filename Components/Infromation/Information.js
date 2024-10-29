class Information extends Component {
    static throwIfKeysMissing(args) {
        const mandatoryKeys = ['message']
        const keys = Object.keys(args);
        if (mandatoryKeys.some((key) => !keys.includes(key))) {
            throw new Error('Information: key missing')
        }
    }
    static getHtmlTemplate(args) {
        const result = elementFromHtml(
            `
                <div class="information-wrapper">
                    ${args.message}
                </div>
            `
        );
        return result;
    }
    constructor(args) {
        Information.throwIfKeysMissing(args);
        super(args);
        this.timeout = args.timeout;
        this.content = Information.getHtmlTemplate(args);
        context.modalComponent$.next(this.content);
        this.context.modalOpenClose$.next(OPEN_MODAL);
        this.addListeners()
    }

    addListeners() {
        if (!this.timeout) return;
        onTimeout(this.timeout, () => this.context.modalOpenClose$.next(CLOSE_MODAL));
    }
}
