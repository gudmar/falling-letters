
class Button extends Component {
    static defaultArgs = {
        elementTag: 'div'
    }    
    constructor(args) {
        super({...args, ...Button.defaultArgs});
        const {
            label,
            action
        } = args;
        this.element.innerText = label;
        this.labelChangers = args.labelChangers;
        this.addListeners(action)
        this.addLabelChangers();
    }
    addListeners(action){
        if (!action) throw new Error('Button has not action');
        rxjs.fromEvent(this.element, 'click').subscribe(action);
    }
    addLabelChangers() {
        if (!this.labelChangers?.length) return;
        this.labelChangers.forEach((changer$) => {
            changer$.subscribe(((newLabel) => {
                this.element.innerText = newLabel
            }).bind(this))
        })
    }
}