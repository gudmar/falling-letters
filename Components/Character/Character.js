class Character extends Component {
    static getCharacterShadow(character) {
        const nrOfRepetes = 7;
        const shadow = Array(7).fill('').map((_, index) => {
            return `<div 
                class="character-shadow-${index}
                style="bottom: ${index * CHARACTER_SIZE}rem; color: rgb(255, ${255 - index * (255 / nrOfRepetes)}, 0); opacity: ${index * 1/7}"
            >
                ${character}
            </div>`
        }).join('');
        console.log(shadow)
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
        this.addListeners();
        this.elementWrapper = this.element.getElementById(this.id);
        this.randomlyPlace();
    }

    randomlyPlace() {
        const maxWidth = this.parentWidth - 10;
        const place = random(maxWidth);
        this.parent.append(this.element);
        this.elementWrapper.style.left = place + 'px';
    }

    addListeners() {
        this.moveSubscribtion = this.context.pausedMoveTicks.pausedSubject.subscribe(() => {
            const shouldBeRemoved = this.checkIfOutsideScreen();
            if (shouldBeRemoved) {
                this.deleteThisElement();
                return
            }
            this.moveDown();
        })
    }

    get top() {
        const {top} = this.elementWrapper.getBoundingClientRect();
        return top
    }

    deleteThisElement(){
        this.moveSubscribtion.unsubscribe();
        this.elementWrapper.remove();
    }

    checkIfOutsideScreen() {
        const position = this.top;
        const maxY = this.maxTop;
        return position > maxY;
    }

    moveDown() {
        this.elementWrapper.style.top = (parseInt(this.elementWrapper.style.top) || 0) + DOWN_MOVE_DELTA + 'px'
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
