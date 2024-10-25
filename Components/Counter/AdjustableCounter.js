class AdjustableCounter extends Component {
    static getHtmlTemplate = (id) => {
        return `
        <div class="adjustable-counter-wrapper" id={${id}}>
            <div class="adjustable-counter-container"></div>
            <div class="adjustable-counter-controls-container"></div>
        </div>
        `
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
        this.counterContainer.append(counter);
    }

}
