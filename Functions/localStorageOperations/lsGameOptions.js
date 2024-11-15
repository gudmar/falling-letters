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

const getFromLocalStorageOrDefault = (key, defaultValue) => {
    const fromLs = checkGameOptionInLS(key);
    if (!fromLs) return defaultValue;
    return fromLs;
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

const updateBestScoreList = (context) => {
    const currentList = getGameParamOrDefault(BEST_SCORE_LIST, []);
    const currentScore = context.scoreSubject$.value;
    const currentPlayerName = context.playerName$.value;
    const mistakes = context.nrErrorsSubject$.value;
    const misses = context.nrMissesSubject$.value;
    const moveSpeed = context.moveTicksRate.value;
    const appearSpeed = context.newLetterRate.value;
    const currentScoreInBestScoreIndex = currentList.length === 0 ? 0 : currentList.findIndex((({score}, index) => {
        return currentScore > score;
    }));
    if (currentScoreInBestScoreIndex === -1) {
        console.log('current score not found in best score')
        return;
    }
    currentList.splice(
        currentScoreInBestScoreIndex,
        0,
        {playerName: currentPlayerName, score: currentScore, mistakes, misses, moveSpeed, appearSpeed}
    );
    const limitedScoreWithNewResult = currentList.slice(0, BEST_PLAYERS_LIST_LENGTH_LIMIT);
    updateGameParamInLs(BEST_SCORE_LIST, limitedScoreWithNewResult);
}
