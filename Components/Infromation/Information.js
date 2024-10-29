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

class Information extends Component {
    static throwIfKeysMissing(args) {
        const mandatoryKeys = ['message']
        const keys = Object.keys(args);
        if (mandatoryKeys.some((key) => !keys.includes(key))) {
            throw new Error('Information: key missing')
        }
    }
    static getHtmlTemplate(args) {
        const result = elementFromHtml(
            `
                <div class="information-wrapper">
                    ${args.message}
                </div>
            `
        );
        return result;
    }
    constructor(args) {
        Information.throwIfKeysMissing(args);
        super(args);
        this.timeout = args.timeout;
        this.content = Information.getHtmlTemplate(args);
        context.modalComponent$.next(this.content);
        this.context.modalOpenClose$.next(OPEN_MODAL);
        this.addListeners()
    }

    addListeners() {
        if (!this.timeout) return;
        onTimeout(this.timeout, () => this.context.modalOpenClose$.next(CLOSE_MODAL));
    }
}
