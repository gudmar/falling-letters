const getKeyFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) ?? {};
const setKeyToLocalStorage = (key, options) => localStorage.setItem(key, JSON.stringify(options))

const getGameOptionsFromLS = () => getKeyFromLocalStorage('gameOptions');
const getGameParamsFromLS = () =>  getKeyFromLocalStorage('gameOptions');

const setGameOptionsToLS = (options) => setKeyToLocalStorage('gameOptions', options)
const setGameParamsToLS = (params) => setKeyToLocalStorage('gameParams', params)

const updateGameParamInLs = (key, value) => {
    const oldParams = getGameParamsFromLS();
    const newParams = {
        ...oldParams,
        [key]: value
    };
    setGameOptionsToLS(newParams);
}

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
const getGameParamValue = (paramName) => getGameParamsFromLS()[paramName];
const getGameParamOrDefault = (paramName, defaultValue) => getGameParamValue(paramName) ?? defaultValue;
