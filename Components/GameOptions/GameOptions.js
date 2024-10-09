// const getGameOptionsFromLS = () => JSON.parse(localStorage.getItem('gameOptions'));
// const setGameOptionsToLS = (optionsToSave) => localStorage.setItem('gameOptions', JSON.stringify(optionsToSave))

// const toggleGameOptionToLocalStorage = (optionToSave) => {
//     const currentOptions = getGameOptionsFromLS() || {};
//     const newOptions = {...currentOptions, [optionToSave]: !currentOptions[optionToSave]}
//     setGameOptionsToLS(newOptions);
// }

// const checkGameOptionInLS = (gameOption) => {
//     const gameOptions = getGameOptionsFromLS();
//     return gameOptions[gameOption]
// }

// const formNewCharacterGenerator = (context, characterGetterFunctions) => {
//     context.characterGenerator$ = characterGetterFunctions;
// }

// const handleGameOptionChange = (gameOption) => {
//     toggleGameOptionToLocalStorage(gameOption);
//     const selectedCharacterGetters = Object.entries(getGameOptionsFromLS()).filter(([key, value]) => {
//         return value
//     }).map(([key]) => optionToCharacterGeneratorMap[key]);
//     formNewCharacterGenerator(selectedCharacterGetters);
// }

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
        const interior$ = this.getInterior();
        interior$.subscribe((element) => {
                this.element.append(element);
            })
    }

}