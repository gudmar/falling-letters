
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
        this.addListeners(action)
    }
    addListeners(action){
        if (!action) throw new Error('Button has not action');
        rxjs.fromEvent(this.element, 'click').subscribe(action);
    }
}