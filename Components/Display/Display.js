class Display extends Component {
    static getHtmlTemplate(args) {
        return `
            <div class="Display-wrapper">
                <div class="Display-text-container">
                    ${args.subject.value}
                </div>
            </div>
        `
    }
    static getBoostedArgs(args) {
        const result = {
            ...args,
            htmlTemplate: EndGame.getHtmlTemplate(args),
            schema: {
                subject: {
                    requirement: MANDATORY,
                    type: OBJECT
                }
            }
        }
        return result;
    }

    constructor(args) {
        const boostedArgs= Display.getBoostedArgs(args);
        super(boostedArgs);
        this.subject = args.subject;
        this.textContainer = this.element.querySelector('.Display-text-container')
    }

    addListeners() {
        this.refreshText = this.subject.subscribe((newValue) => {
            this.textContainer.innerText = newValue;
        })
    }

    delete() {
        this.refreshText.unsubscribe();
        this.element.remove();
    }
}