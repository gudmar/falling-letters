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
            <div>&uarr;</div>
            <div>&darr;</div>
        `
    }
    getControls$() {
        const controls = [
            {
                label: '&uarr;',
                action: () => {
                    if (this.subject.value + 1 > this.upperThreshold) return;
                    this.subject.increment(1);
                }
            },
            {
                label: '&darr;',
                action: () => {
                    if (this.subject.value - 1 < this.lowerThreshold) return;
                    this.subject.decrement(1);
                }
            }
        ];
        return controls;
    }

    setControls() {
        rxjs.from(this.getControls$()).subscribe(({label, action}) => {
            const control = elementFromHtml(
                `<div class="adjustable-counter-button">${label}</div>`
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
        this.subject = args.subject;
        
        this.context = args.context;
        this.setInterior();
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
