class Character extends Component {
    static getCharacterShadow(character) {
        const nrOfRepetes = 7;
        const shadow = Array(nrOfRepetes).fill('').map((_, index) => {
            return `<div 
                class="character-shadow-${index}"
                style="bottom: ${index * CHARACTER_SIZE}rem; color: rgb(0, 255, 0); opacity: ${(index + 1) * 1/9}"
                
            >
                ${character}
            </div>`
        }).join('');
        return shadow
    }
    static getHtmlTemplate(character, id) {
        return `
            <div class="character-wrapper" id="${id}">
                ${Character.getCharacterShadow(character)}
                <div class="character-leading-letter">
                    ${character}
                </div>
            </div>
        `
    }
    static getBoostedArgs(args) {
        const boost = {
            parentId: GAME_CONTAINER,
            wrapperClass: 'character-wrapper',
            htmlTemplate: Character.getHtmlTemplate(args.character, args.id)
        }
        return {...args, ...boost};
    }

    constructor(args) {
        const id = getUuid();
        const boostedArgs = Character.getBoostedArgs({...args, id})
        super(boostedArgs);
        this.id = id;
        this.character = args.character;
        this.addListeners();
        this.randomlyPlace();
        if (!this.context.registerBirth$) throw new Error('Missing register birth in context')
        this.context.registerBirth$.next({character: this.character, id: this.id})
        this.oldGameState = ContextProvider.gameState$.value;
    }

    randomlyPlace() {
        const maxWidth = this.parentWidth - 10;
        const place = random(maxWidth);
        this.parent.append(this.element);
        this.element.style.left = place + 'px';
    }

    addListeners() {
        this.moveSubscribtion = this.context.pausedMoveTicks.pausedSubject.subscribe(() => {
            const shouldBeRemoved = this.checkIfOutsideScreen();
            if (shouldBeRemoved) {
                this.context.characterRemoveCause$.next({cause: MISS, id: this.id, character: this.character})
                this.deleteThisElement();
                return
            }
            this.moveDown();
        })
        this.deleteSubscribtion = this.context.removeCharacterWithIdSubject$.subscribe((id) => {
            if (id === this.id) { this.deleteThisElement(); }
            if (id === RESET ) { this.deleteThisElement(); }
        })
        ContextProvider.gameState$.subscribe((newValue) => {
            if (this.oldGameState === GAME_ENDED && newValue === START_NEW_GAME) this.deleteThisElement();
            this.oldGameState = newValue;
        })
    }

    get top() {
        const {top} = this.element.getBoundingClientRect();
        return top
    }

    deleteThisElement(){
        this.moveSubscribtion.unsubscribe();
        this.element.remove();
        this.deleteSubscribtion.unsubscribe();
    }

    checkIfOutsideScreen() {
        const position = this.top;
        const maxY = this.maxTop;
        return position > maxY;
    }

    moveDown() {
        this.element.style.top = (parseInt(this.element.style.top) || 0) + DOWN_MOVE_DELTA + 'px'
    }

    get parentWidth() {
        const {width} = this.parent.getBoundingClientRect();
        return width
    }

    get maxTop() {
        const { height, y } = this.parent.getBoundingClientRect();
        return height + y
    }
}
