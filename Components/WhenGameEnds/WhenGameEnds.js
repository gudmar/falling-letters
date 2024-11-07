class WhenGameEndsDialog {
    constructor({
        context,
        gameState,
    }) {
        console.log(context)
        this.isGameEndDisplayed = false;
        gameState.subscribe((state) => {
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
