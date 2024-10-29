class Timeout {
    constructor(timeout) {
        this.timer = rxjs.interval(timeout);
        this.subscribtion = null;
    }
    unsubscribe() {
        if (this.subscribtion) {
            this.subscribtion.unsubscribe();
        }
    }
    set onTimeout(callback) {
        this.unsubscribe();
        this.subscribtion = this.timer.subscribe(() => {
            callback();
            this.subscribtion.unsubscribe();
        })
    }

    delete () {
        this.unsubscribe;
    }
}

const onTimeout = (timeout, action) => {
    const timer = new Timeout(timeout);
    timer.onTimeout = action;
}
