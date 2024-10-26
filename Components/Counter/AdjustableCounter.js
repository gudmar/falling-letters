class AdjustableCounter extends Component {
    static getHtmlTemplate = (id) => {
        return `
        <div class="adjustable-counter-wrapper" id={${id}}>
            <div class="adjustable-counter-container"></div>
            <div class="adjustable-counter-controls-container"></div>
        </div>
        `
    }
    static getHtmlControlTemplate = () => {
        return `
            <div class="adjustable-counter-increase-button">&uarr;</div>
            <div class="adjustable-counter-decrease-button">&darr;</div>
        `
    }
    getControls$() {
        const controls = [
            {
                label: '&uarr;',
                action: () => {
                    if (this.subject.value + 1 > this.upperThreshold) return;
                    this.subject.increment(1);
                },
                classes: 'adjustable-counter-increase-button'
            },
            {
                label: '&darr;',
                action: () => {
                    if (this.subject.value - 1 < this.lowerThreshold) return;
                    this.subject.decrement(1);
                },
                classes: 'adjustable-counter-decrease-button'
            }
        ];
        return controls;
    }

    setControls() {
        rxjs.from(this.getControls$()).subscribe(({label, action, classes}) => {
            console.log('classes', classes)
            const control = elementFromHtml(
                `<div class="adjustable-counter-button ${classes}">${label}</div>`
            )
            rxjs.fromEvent(control, 'click').pipe(() => action)
            this.controlsContainer.append(control)            
        })
    }

    static getDefaultArgs = (id) => ({
        htmlTemplate: this.getHtmlTemplate(id),
        componentId: id,
    });

    constructor(args) {
        const id = getUuid();
        console.log(args)
        super({ ...args, ...AdjustableCounter.getDefaultArgs(id) });
        
        this.label = args.label;
        this.lowerThreshold = args.lowerThreshold;
        this.upperThreshold = args.upperThreshold;
        this.startValue = args.startValue;
        this.counterContainer = this.element.querySelector(".adjustable-counter-container");
        this.controlsContainer = this.element.querySelector(".adjustable-counter-controls-container");
        console.log(this.increaseButton, this.decreaseButton)
        this.subject = args.subject;
        
        this.context = args.context;
        this.setInterior();
        this.decreaseButton = this.element.querySelector('.adjustable-counter-decrease-button');
        this.increaseButton = this.element.querySelector('.adjustable-counter-increase-button')

        this.addListeners();
    }

    addListeners() {
        rxjs.fromEvent(this.increaseButton, 'click').subscribe(() => {
            if (this.subject.value >= this.upperThreshold) return;
            this.subject.increment(1);
        })
        rxjs.fromEvent(this.decreaseButton, 'click').subscribe(() => {
            if (this.subject.value <= this.lowerThreshold) return;
            this.subject.decrement(1);
        })
    }

    setInterior() {
        console.log(this)
        const counter = new Counter({...this, context: this.context});
        this.counterContainer.append(counter.element);
        this.setControls();
        // const controlls = elementFromHtml(AdjustableCounter.getHtmlControlTemplate())
        // this.controlsContainer.append(controlls);
    }

}
