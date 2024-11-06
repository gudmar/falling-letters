class EndGame extends Component {
    static getHtmlTemplate(args) {
        return `
        <div class="EndGame-wrapper">
            <div class="EndGame-label">
                <h2 class="EndGame-mark">Game Over</h2>
                <p>Your score: <span class="EndGame-mark">${args.context.scoreSubject$.value}</span>.</p>
                <p>You missed: <span class="EndGame-mark">${args.context.nrMissesSubject$.value}</span></p>
                <p>You made <span class="EndGame-mark">${args.context.nrErrorsSubject$.value}</span> errors</p>
            </div>
            <div class="EndGame-button-container"></div>
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
        this.context = boostedArgs.context;
        this.buttonContainer = this.element.querySelector('.EndGame-button-container')
        this.addNewGameButton();
    }

    addNewGameButton() {
        const newGameButton = new Button({
            context: this.context,
            label: 'New game',
            elementClasses: ['button-wrapper', 'EndGame-right'],
            action: (() => {
                // ContextProvider.gameState$.next(START_NEW_GAME);
                restartGame(this.context)
            }).bind(this)
        });
        // this.element.append(newGameButton.element);
        this.buttonContainer.append(newGameButton.element);
    }
}
