class GameTimeHook {
    constructor({impulseGenerator, timeSubject, gameStateSubject}) {
        this.impulseGenerator = impulseGenerator;
        this.timeSubject = timeSubject;
        this.gameStateSubject = gameStateSubject;
        this.setStartTimer();
        this.setResetTimer();
    }
    setStartTimer() {
        this.timer = this.impulseGenerator.subscribe((newValue) => {
            const lastTime = this.timeSubject.value;
            const newTime = lastTime + 1;
            this.timeSubject.next(newTime);
        })
    }
    setResetTimer() {
        this.gameStateSubject.subscribe((newValue) => {
            if (newValue === START_NEW_GAME) this.timeSubject.next(0);
        })
    }
    stopTimer() {
        if (!this.timer) return;
        this.timer.unsubscribe();
    }
}
