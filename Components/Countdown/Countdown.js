class Countdown extends Component {
    static getHtmlTemplate(args) {
        const timeAsText = secondsToFullTimeString(args.startValueSubject.value)
        return `
            <div class="countdown-wrapper">
                <div class="countdown-display">
                    <span class="countdown-value">
                        ${timeAsText}
                    </span>
                </div>
            </div>
        `
    }
    static getBoostedArgs(args) {
        return {
            ...args,
            htmlTemplate: Countdown.getHtmlTemplate(args),
            schema: {
                startValueSubject: {
                    requirement: MANDATORY,
                    type: OBJECT,
                },
                subject: {
                    requirement: MANDATORY,
                    type: OBJECT,
                },
                lockSubject: {
                    requirement: OPTIONAL,
                    type: OBJECT,
                }
            }
        }
    }

    constructor(args) {
        const boostedArgs= Countdown.getBoostedArgs(args);
        super(boostedArgs);
        this.valueContainer = this.element.querySelector('.countdown-value');
        this.subject = args.subject;
        this.lockSubject = args.lockSubject ?? new rxjs.BehaviourSubject(false);
        this.startValueSubject = args.startValueSubject;
        this.addListeners();
    }

    get counterValue() {
        return this.subject.value;
    }

    addListeners() {
        this.interval = rxjs.interval(1000);

        this.startValueSubject.subscribe(
            (newValue) => this.subject.next(newValue),
        );

        this.lockSubject.pipe(
            rxjs.switchMap(
                (isLocked) => {
                    console.log('Is locekd', isLocked)
                    if (isLocked) {
                        return rxjs.empty();
                    }
                    return this.interval
                }
            )
        ).subscribe(
            () => this.subject.next(this.counterValue - 1)
        )

        this.subject.subscribe(
            (newValue) => {
                this.valueContainer.innerText = secondsToFullTimeString(newValue);
            }
        )
    }
}
