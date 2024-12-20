class EndGame extends Component {
    static getHtmlTemplate(args) {
        return `
        <div class="EndGame-wrapper">
            <div class="EndGame-label">
                <h2 class="EndGame-mark">Game Over</h2>
                <p>Your score: <span class="EndGame-mark">${args.context.scoreSubject$.value}</span>.</p>
                <p>You missed: <span class="EndGame-mark">${args.context.nrMissesSubject$.value}</span></p>
                <p>You made <span class="EndGame-mark">${args.context.nrErrorsSubject$.value}</span> errors</p>
                <p>Your average reaction time was: <span class="EndGame-mark">${args.context.averagePlayerReactionRate$.value}</span> s</p>
            </div>
            <div class="EndGame-best-score-container"></div>
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
        this.bestScoreContainer = this.element.querySelector('.EndGame-best-score-container')
        this.addBestSocre();
        this.addNewGameButton();
    }

    addBestSocre() {
        const bestScore = getBestScoreTableComponent(this.context);
        this.bestScoreContainer.append(bestScore.element)
    }

    addNewGameButton() {
        const newGameButton = new Button({
            context: this.context,
            label: 'New game',
            elementClasses: ['button-wrapper', 'EndGame-right'],
            action: (() => {
                restartGame(this.context)
            }).bind(this)
        });
        this.buttonContainer.append(newGameButton.element); 
    }
}
