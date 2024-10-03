const MODAL_ID = 'only-one-modal';
const MODAL_CONTAINER_ID = MODAL_ID + '-container';


class Modal extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'modal-wrapper',
        elementId: MODAL_ID,
    }
    
    constructor(args) {
        if (Modal.instance) {
            throw new Error('Error in Modal: there should be only one modal per whole application')
        }
        super({...args, ...Modal.defaultArgs})
        Modal.instance = this;
        this.addListeners()
        this.reloadChild();
    }

    removeAllChildren() {
        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
    }

    reloadChild() {
        const newChildContainer = addElementWithClasses({
            parent: this.element,
            cssClassNames: 'modal-container',
            elementTag: 'div',
            elementId: MODAL_CONTAINER_ID,
        })
        this.removeAllChildren();
        const childComponent = this.contentElement;
        const childElement = childComponent.element;
        newChildContainer.append(childElement);
    }

    get contentElement() {
        try{
            let content = null
            const subscribtion = this.context.modalComponent$.subscribe((component) => {
                content = component
            });
            subscribtion.unsubscribe();
            return content;    
        } catch (error) {
            throw new Error(`Modal: no modalComponent$ subject in context. Original error: ${error.message}`)
        }
    }

    addListeners() {
        this._context
        rxjs.fromEvent(this.element, 'click').subscribe(this.close.bind(this))
        this.context.modalComponent$.subscribe((child) => {
            this.child = child
        })
        this.context.modalOpenClose$.subscribe((command) => {
            if (command === OPEN_MODAL) this.open.bind(this)();
            if (command === CLOSE_MODAL) this.close.bind(this)();
            if (command === TOGGLE_MODAL) this.toggleVisibility.bind(this)();
        })
    }
    toggleVisibility() {
        const elementInDom = document.getElementById(this.elementId);
        if (elementInDom) { elementInDom.remove();}
        else { this.parent.append(this.element)}
    }
    open() {
        const elementInDom = document.getElementById(this.elementId);
        if (!elementInDom) { this.parent.append(this.element)}
    }
    close() {
        const elementInDom = document.getElementById(this.elementId);
        console.log('Element', elementInDom, this.elementId)
        if (elementInDom) { elementInDom.remove();}        
    }
}