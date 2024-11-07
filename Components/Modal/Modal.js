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
        this.child = null;
        Modal.instance = this;
        console.log(this.element)
        this.backdrop = document.getElementById(MODAL_ID)
        this.addListeners()
        this.reloadChild();
        this.closeByAgent();
    }

    removeAllChildren() {
        while(this.element.firstChild) {
            this.element.removeChild(this.element.firstChild)
        }
    }

    reloadChild() {
        this.removeAllChildren();
        const newChildContainer = addElementWithClasses({
            parent: this.element,
            cssClassNames: 'modal-container',
            elementTag: 'div',
            elementId: MODAL_CONTAINER_ID,
        })
        this.container = newChildContainer;
        newChildContainer.append(this.child);
        this.element.append(newChildContainer)
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
        rxjs.fromEvent(this.backdrop, 'click').subscribe((e) => {
            if (this.dontCloseOnClick) return;
            if (e.target !== this.backdrop) return;
            console.log(e, e.target)
            this.close.bind(this)();
        })
        this.context.modalComponent$.subscribe(((child) => {
            this.child = child
            this.reloadChild()
        }).bind(this))
        this.context.modalOpenClose$.subscribe((command) => {
            if (command === OPEN_MODAL_DONT_CLOSE_ON_CLICK) {
                this.open.bind(this)();
                this.dontCloseOnClick = true;
            }
            if (command === OPEN_MODAL) this.open.bind(this)();
            if (command === CLOSE_MODAL) this.close.bind(this)();
            if (command === CLOSE_MODAL_BY_AGENT) this.closeByAgent.bind(this)();
            if (command === TOGGLE_MODAL) this.toggleVisibility.bind(this)();
        })
    }
    toggleVisibility() {
        const elementInDom = document.getElementById(this.elementId);
        if (elementInDom) {
            elementInDom.remove();
            PausedSubject.setPause();
            this.dontCloseOnClick = false;
        }
        else {
            this.parent.append(this.element);
            PausedSubject.resetPause();
        }
    }
    open() {
        const elementInDom = document.getElementById(this.elementId);
        if (!elementInDom) {
            this.parent.append(this.element);
            PausedSubject.setPause();
        }
    }
    closeByAgent() {
        const elementInDom = document.getElementById(this.elementId);
        if (elementInDom) {
            elementInDom.remove();
            PausedSubject.resetPause();
            this.dontCloseOnClick = false;
        }
    }
    close(event) {
        if (event && event.target !== this.element) return;
        this.closeByAgent();
        PausedSubject.resetPause();
    }
}