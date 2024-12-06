class BestScore extends Component {
    static getHtmlTemplate(args) {
        return `
        <div class="BestScore-wrapper">
        </div>
        `
    }
    static boostArgs(args) {
        const result = {
            ...args,
            htmlTemplate: BestScore.getHtmlTemplate(args)
        }
        return result;
    }

    constructor(args) {
        const boostedArgs = BestScore.boostArgs(args);
        super(boostedArgs);
        this.context = boostedArgs.context;
        this.container = this.element;
        this.addBestSocre();
    }

    addBestSocre() {
        const bestScore = getBestScoreTableComponent(this.context);
        this.container.append(bestScore.element)
    }
}
