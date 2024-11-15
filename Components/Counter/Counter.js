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
        this.onLowerThresholdCross = args.onLowerThresholdCross || (()=>{})
        this.onUpperThresholdCross = args.onUpperThresholdCross || (()=>{})
        this.setThresholdCrossFlags();
    }

    checkIfAboveUpperBoundry() {
        if (!isDefined(this.upperThreshold)) return false;
        const result = this.value >= this.currentUpperThreshold;
        return result;
    }
    checkIfBelowLowerBoundry() {
        if (!isDefined(this.lowerThreshold)) return false;
        const result = this.value <= this.currentLowerThreshold;
        return result;
    }

    setThresholdCrossFlags() {
        this._isAboveUpperThreshold = this.checkIfAboveUpperBoundry();
        this._isBelowLowerThreshold = this.checkIfBelowLowerBoundry();
    }

    get isBelowLowerThreshold() { return this._isBelowLowerThreshold };
    get isAboveUpperThreshold() { return this._isAboveUpperThreshold };

    get currentLowerThreshold() { return this.lowerThreshold?.value || this.lowerThreshold }
    get currentUpperThreshold() { return this.upperThreshold?.value || this.upperThreshold }

    checkIfValueValid() {
        if (!isDefined(this.lowerThreshold) && !isDefined(this.upperThreshold)) return true;
        if (this.value < this.currentLowerThreshold) return false;
        if (this.value > this.currentUpperThreshold) return false;
        return true;
    }

    checkIfInUpperBoundry(value) {
        if (!isDefined(this.upperThreshold)) return true;
        const result = value < this.currentUpperThreshold;
        return result;
    }

    checkIfInLowerBoundry(value) {
        if (!isDefined(this.lowerThreshold)) return true;
        const result = value > this.currentLowerThreshold;
        return result;
    }

    doOnChange() {
        const newValue = this.subject.value;
        this.valueContainer.innerText = newValue;
        this.value = newValue;
        const isAboveUpperThreshold = this.checkIfAboveUpperBoundry();
        const isBelowLowerThreshold = this.checkIfBelowLowerBoundry();

        if (isAboveUpperThreshold && this.onUpperThresholdCross) { this.onUpperThresholdCross(newValue) }
        if (isBelowLowerThreshold && this.onLowerThresholdCross) { this.onLowerThresholdCross(newValue) }

        if (this.checkIfInLowerBoundry(newValue)) {
            this.context.thresholdReachedSubject$.next(
                {
                    source: this.label,
                    boundry: LOWER_TH,
                    value: this.subject.value,
                }
            )
            this.valueContainer.classList.add('counter-not-valid');
            this.setThresholdCrossFlags()
        };
        if (this.checkIfInUpperBoundry(newValue)) {
            this.context.thresholdReachedSubject$.next(
                {
                    source: this.label,
                    boundry: UPPER_TH,
                    value: this.subject.value
                }
            )
            this.valueContainer.classList.add('counter-not-valid');
            this.setThresholdCrossFlags()
        }
        if (this.checkIfValueValid()) {
            this.valueContainer.classList.remove('counter-not-valid');
            this.setThresholdCrossFlags()
        }
    }

    addListeners() {
        // this.subject.pipe(rxjs.filter((value) => value >= this.currentUpperThreshold))
        //     .subscribe((value) => this.onUpperThresholdCross(value))

        // this.subject.pipe(rxjs.filter((value) => value <= this.currentLowerThreshold))
        //     .subscribe((value) => this.onLowerThresholdCross(value))

        this.subject.subscribe((() => { this.doOnChange() }).bind(this));
        if (this.upperThreshold?.value) {
            this.upperThreshold.subscribe(this.doOnChange.bind(this))
        }
        if (this.lowerThreshold?.value) {
            this.lowerThreshold.subscribe(this.doOnChange.bind(this))
        }
    }
}