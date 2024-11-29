
const restartGame = (context) => {
    ContextProvider.gameState$.next(START_NEW_GAME);
    context.modalOpenClose$.next(CLOSE_MODAL);
    context.currentTimeoutValueSubject$.next(context.endGameTimeoutValueSubject$.value)
    context.scoreSubject$.next(0);
    context.nrErrorsSubject$.next(0);
    context.nrMissesSubject$.next(0);
    context.sumTimeAllCharactersLived$.next(0);
    context.countAllCharactersSoFar$.next(0);
}
