class Counter extends Component {
    static getBoostedArgs(args) {
        const {label, startValue} = args;
        return {
            ...args,
            htmlTemplate : Counter.getHtmlTemplate(startValue, label),
            // wrappingTag: 'div'
        }
    }
    static getHtmlTemplate(counterValue, counterLabel) {
        return `
            <div class="counter-wrapper">
                <span class="counter-value">${counterValue}</span>
            </div>
        `
    }
    static throwIfParamsMissing(args) {
        const keys = Object.keys(args);
        const mandatoryKeys = ['startValue', 'subject'];
        const isEveryKeyPresent = mandatoryKeys.every((key) => keys.includes(key));
        if (!isEveryKeyPresent) throw new Error('Mandatory key missing from Counter component');
    }
    constructor(args) {
        Counter.throwIfParamsMissing(args);
        const boostedArgs = Counter.getBoostedArgs(args)
        super(boostedArgs)
        this.valueContainer = this.element.querySelector('.counter-value');
        this.subject = args.subject;
        this.label = args.label;
        this.value = boostedArgs.startValue;
        if (isDefined(boostedArgs.upperThreshold)) {
            this.upperThreshold = boostedArgs.upperThreshold
        }
        if (isDefined(boostedArgs.lowerThreshold)) {
            this.lowerThreshold = boostedArgs.lowerThreshold
        }
        this.addListeners()
    }

    checkIfValueValid() {
        if (!isDefined(this.lowerThreshold) && !isDefined(this.upperThreshold)) return true;
        if (this.value < this.lowerThreshold) return false;
        if (this.value > this.upperThreshold) return false;
        return true;
    }
    addListeners() {
        this.subject.subscribe(((newValue) => {
            this.valueContainer.innerText = newValue;
            this.value = newValue;
            if (isDefined(this.lowerThreshold) && newValue < this.lowerThreshold) {
                this.context.thresholdReachedSubject$.next(
                    {
                        source: this.label,
                        boundry: LOWER_TH,
                        value: this.subject.value,
                    }
                )
                this.valueContainer.classList.add('counter-not-valid')
            };
            if (isDefined(this.upperThreshold) && newValue > this.upperThreshold) {
                this.context.thresholdReachedSubject$.next(
                    {
                        source: this.label,
                        boundry: UPPER_TH,
                        value: this.subject.value
                    }
                )
                this.valueContainer.classList.add('counter-not-valid')
            }
            if (this.checkIfValueValid()) {
                this.valueContainer.classList.remove('counter-not-valid')
            }
        }).bind(this));
    }
}