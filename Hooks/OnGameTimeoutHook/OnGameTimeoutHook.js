class OnGameTimeoutHook {
    constructor(context) {
        this.context = context;
        this.setTimoutInLsUpdater();
        this.setShouldEndGameOnTimeoutUpdater();
        this.setEndGameOnTimeoutListener();
    }
    setEndGameOnTimeoutListener() {
        this.context.currentTimeoutValueSubject$.subscribe(
            (newValue) => {
                if (newValue < 0) ContextProvider.gameState$.next(GAME_ENDED);
            }
        )
    }

    setTimoutInLsUpdater(){
        this.context.endGameTimeoutValueSubject$.subscribe(
            (newValue) => {
                this.updateTimeoutInLs(newValue);
                this.context.currentTimeoutValueSubject$.next(newValue);
            }
        );
    }

    setShouldEndGameOnTimeoutUpdater() {
        this.context.shouldEndGameOnTimeoutSubject$.subscribe(
            (newValue) => {
                console.log(newValue)
                this.updateShouldEndGameOnTimeoutInLs(newValue);
            }
        )
    }


    updateTimeoutInLs(newTimeoutValue) {
        updateGameParamInLs(END_GAME_TIMEOUT, newTimeoutValue);
    }

    updateShouldEndGameOnTimeoutInLs(newValue) {
        updateGameParamInLs(SHOULD_END_GAME_ON_TIMEOUT, newValue);
    }
}
