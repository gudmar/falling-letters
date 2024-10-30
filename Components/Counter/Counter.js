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
        const currentLowerThreshold = this.lowerThreshold?.value || this.lowerThreshold;
        const currentUpperThreshold = this.upperThreshold?.value || this.upperThreshold;
        if (this.value < currentLowerThreshold) return false;
        if (this.value > currentUpperThreshold) return false;
        return true;
    }

    checkIfInUpperBoundry(value) {
        if (!isDefined(this.upperThreshold)) return true;
        const currentUpperThreshold = this.upperThreshold.value || this.upperThreshold;
        const result = value < currentUpperThreshold;
        return result;
    }

    checkIfInLowerBoundry(value) {
        if (!isDefined(this.lowerThreshold)) return true;
        const currentLowerThreshold = this.lowerThreshold.value || this.lowerThreshold;
        const result = value > currentLowerThreshold;
        return result;
    }

    doOnChange() {
        const newValue = this.subject.value;
        this.valueContainer.innerText = newValue;
        this.value = newValue;
        if (this.checkIfInLowerBoundry(newValue)) {
            this.context.thresholdReachedSubject$.next(
                {
                    source: this.label,
                    boundry: LOWER_TH,
                    value: this.subject.value,
                }
            )
            this.valueContainer.classList.add('counter-not-valid')
        };
        if (this.checkIfInUpperBoundry(newValue)) {
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
    }

    addListeners() {
        this.subject.subscribe((() => { this.doOnChange() }).bind(this));
        if (this.upperThreshold?.value) {
            this.upperThreshold.subscribe(this.doOnChange.bind(this))
        }
        if (this.lowerThreshold?.value) {
            this.lowerThreshold.subscribe(this.doOnChange.bind(this))
        }
    }
}