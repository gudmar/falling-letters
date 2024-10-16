const getGameOptionsFromLS = () => JSON.parse(localStorage.getItem('gameOptions')) ?? {};
const setGameOptionsToLS = (optionsToSave) => localStorage.setItem('gameOptions', JSON.stringify(optionsToSave))

const toggleGameOptionToLocalStorage = (optionToSave) => {
    const currentOptions = getGameOptionsFromLS() || {};
    const newOptions = {...currentOptions, [optionToSave]: !currentOptions[optionToSave]}
    setGameOptionsToLS(newOptions);
}

const checkGameOptionInLS = (gameOption) => {
    const gameOptions = getGameOptionsFromLS();
    return gameOptions[gameOption]
}

const formNewCharacterGenerator = (context, characterGetterFunctions) => {
    context.characterGenerator$ = characterGetterFunctions;
}

const getArrayGeneratorFunctions = () => {
    const selectedOptions = Object.entries(getGameOptionsFromLS()).filter(([key, value]) => {
        return value
    }).map(([key]) => key);
    const handlers = optionToCharacterGeneratorMap.filter(({option}) => selectedOptions.includes(option))
        .map(({handler}) => handler)
    return handlers;
}

const handleGameOptionChange = (gameOption) => {
    toggleGameOptionToLocalStorage(gameOption);
    const selectedCharacterGetters = getArrayGeneratorFunctions();
    formNewCharacterGenerator(selectedCharacterGetters);
}

const checkIfGameOptionSelected = () => Object.entries(getGameOptionsFromLS()).some(([_, value]) => value);
