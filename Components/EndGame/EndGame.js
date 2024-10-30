class EndGame extends Component {
    static getHtmlTemplate(args) {
        return `
        <div class="EndGame-wrapper">
            <div class="EndGame-label">
                Game ended with score: ${args.context.scoreSubject$.value}.
                You missed: ${args.context.nrMissesSubject$.value},
                You made ${args.context.nrErrorsSubject$.value} errors.
            </div>
        </div>
        `
    }
    static boostArgs(args) {
        const result = {
            ...args,
            htmlTemplate: EndGame.getHtmlTemplate(args)
        }
        return result;
    }

    constructor(args) {
        const boostedArgs = EndGame.boostArgs(args);
        super(boostedArgs);
    }

    addNewGameButton() {
        const newGameButton = new Button({
            context: this.context,
            label: 'New game',
            elementClasses: 'button-wrapper',
            action: (() => this.context.startNewGame.increment(1)).bind(this),
        });
        this.element.append(newGameButton.element);
    }
}
