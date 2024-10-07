class GameOptions extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-options-wrapper',
        componentId: getUuid(),
    }
    constructor(args) {
        super({...args, ...GameOptions.defaultArgs});
        this.setInterior();
    }
    getInterior () {
        const data = rxjs.from(optionToCharacterGeneratorMap);
        const options = data.pipe(rxjs.map((({option, arrayGetter}) => {
            const component = new CheckBox({
                label: option,
                context: this._context,
                action: () => {},
            })
            return component.element
        }).bind(this)))
        return options
    }
    setInterior() {
        const interior$ = this.getInterior();
        interior$.subscribe((element) => {
                this.element.append(element);
            })
    }

}