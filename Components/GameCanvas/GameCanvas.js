class GameCanvas extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-container',
        elementId: GAME_CONTAINER,
    }

    constructor(args){
        super({...args, ...GameCanvas.defaultArgs});
        // this.characterEmitter = nullElementEmitter();
        console.log(this.context)
        this.addListeners();
    }

    addListeners() {
        const that = this;
        this.context._charactersGenerator$.subscribe((args) => {
            const {nextElement, randomEmitter, elements} = args;
            that.nextCharacter = nextElement;
            that.characterEmitter = randomEmitter;
            console.log(args, nextElement, randomEmitter, elements)
            subscribeToCharacterGenerator({nextElement, randomEmitter}, 'GameCanvas:  ')
            nextElement();
        })
        // console.log('COntext', this.context, this.context.pausedNewLetter.pausedSubject)
        // const generator = this.characterEmitter
        this.characterEmitter.subscribe(char => console.log(char))

        const nextCharacter = this.nextCharacter;
        this.context.pausedNewLetter.pausedSubject.subscribe(
            (() => {
                nextCharacter()
            })
        )
        this.nextCharacter
        // this.context._charactersGenerator$.subscribe(
        //     (emitter) => { this.characterEmitter = emitter }
        // )
        // this.context.pausedNewLetter.pausedSubject.subscribe(
        //     () => {
        //         generator.next();
        //     }
        // )
    }
}
