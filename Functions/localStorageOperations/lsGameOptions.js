const getGameOptionsFromLS = () => JSON.parse(localStorage.getItem('gameOptions'));
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
    const selectedCharacterGetters = Object.entries(getGameOptionsFromLS()).filter(([key, value]) => {
        return value
    }).map(([key]) => optionToCharacterGeneratorMap[key]);
    return selectedCharacterGetters;
}

const handleGameOptionChange = (gameOption) => {
    toggleGameOptionToLocalStorage(gameOption);
    const selectedCharacterGetters = getArrayGeneratorFunctions();
    formNewCharacterGenerator(selectedCharacterGetters);
}

const checkIfGameOptionSelected = () => Object.entries(getGameOptionsFromLS()).some(([_, value]) => value);
