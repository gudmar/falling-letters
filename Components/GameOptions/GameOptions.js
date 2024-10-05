class GameOptions extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClass: 'game-options-wrapper',
        componentId: getUuid(),
    }
    constructor(args) {
        super({...args, ...GameOptions.defaultArgs});
        this.setInterior();
    }
    getInterior () {
        const data = optionToCharacterGeneratorMap;
        const options = data.map((({option, arrayGetter}) => {
            const component = new CheckBox({
                label: option,
                context: this._context,
                action: () => {},
            })
            return component.element
        }).bind(this))
        return options
    }
    setInterior() {
        const interior = this.getInterior();
        interior.forEach(((element) => {
            this.element.append(element);
        }).bind(this))
    }

}