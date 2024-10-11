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
        this.context._charactersGenerator$.subscribe((args) => {
            const {next, randomEmitter} = args();
            this.nextCharacter = next;
            this.characterEmitter = randomEmitter;
            console.log(args(), next, randomEmitter)
        })
        // console.log('COntext', this.context, this.context.pausedNewLetter.pausedSubject)
        // const generator = this.characterEmitter
        this.characterEmitter.subscribe(char => console.log(char))
        this.context.pausedNewLetter.pausedSubject.subscribe(
            (() => this.nextCharacter()).bind(this)
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
