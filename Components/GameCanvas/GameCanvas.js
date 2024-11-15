class GameCanvas extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-container',
        elementId: GAME_CONTAINER,
    }

    constructor(args){
        super({...args, ...GameCanvas.defaultArgs});
        this.addListeners();
    }

    addListeners() {
        const that = this;
        this.context._charactersGenerator$.subscribe((args) => {
            const {nextElement, randomEmitter, elements} = args;
            that.nextCharacter = nextElement;
            that.characterEmitter = randomEmitter;
            nextElement();
        })
        this.characterEmitter.subscribe((char) => {
            new Character({character: char, context})
        })

        const nextCharacter = this.nextCharacter;
        this.context.pausedNewLetterWithGameEnd.pausedSubject.subscribe(
            (() => {
                nextCharacter()
            })
        )
        this.nextCharacter
    }
}
