class GameCharacterOptions extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-character-options-wrapper',
        componentId: getUuid(),
    }
    constructor(args) {
        super({...args, ...GameCharacterOptions.defaultArgs});
        this.setInterior();
    }
    getCharactersSetHtmlTemplate () {
        const data = rxjs.from(optionToCharacterGeneratorMap);
        const options = data.pipe(
            rxjs.map((dataBit) => {
                const isSetInLS = checkGameOptionInLS(dataBit.option);
                return {...dataBit, checked: isSetInLS}
            }),
            rxjs.map((({option, arrayGetter, checked}) => {
                const component = new CheckBox({
                    label: option,
                    context: this._context,
                    action: toggleGameOptionToLocalStorage,
                    checked
            })
            return component.element
        }).bind(this)))
        return options
    }
    setInterior() {
        const characterHtmlTemplate$ = this.getCharactersSetHtmlTemplate();
        characterHtmlTemplate$.subscribe((element) => {
                this.element.append(element);
            })
    }

}