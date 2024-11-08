class OnGameEndedHook {
    constructor(context) {
        this.context = context;
        this.isGameEndDisplayed = false;
    }

    addListeners() {
        this.saveBestScoreSubscribtion = this.context.gameState$.pipe(
            // rxjs.filter((newGameState) => newGameState === GAME_ENDED),
            // rxjs.tap(() => { updateBestScoreList(this.context)})
        )
        .subscribe((state) => {
            if (state !== GAME_ENDED) {
                if (this.isGameEndDisplayed) {
                    this.isGameEndDisplayed = false;
                    context.modalOpenClose$.next(CLOSE_MODAL_BY_AGENT)
                }
                return;
            };
            if (state === GAME_ENDED) {
                if (!this.isGameEndDisplayed) {
                    this.isGameEndDisplayed = true;
                    context.modalOpenClose$.next(OPEN_MODAL_DONT_CLOSE_ON_CLICK);
                    context.modalComponent$.next(new EndGame(
                        {
                            context
                        }
                    ).element)
                }
            }
        })
    }
}

