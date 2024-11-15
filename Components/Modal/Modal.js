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
        this.backdrop = document.getElementById(MODAL_ID)
        this._onModalCloseCallback = () => {};
        this.addListeners();
        this.reloadChild();
        this._closeByAgent();
    }

    open(onModalCloseCallback) {
        this._onModalCloseCallback = onModalCloseCallback || (() => {});
        this.context.modalOpenClose$.next(OPEN_MODAL);
    }
    close() {
        this.context.modalOpenClose$.next(CLOSE_MODAL_BY_AGENT);
    };
    closeByAgent() { this.context.modalOpenClose$.next(CLOSE_MODAL_BY_AGENT) }

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
            this.closeByAgent();
        })
        this.context.modalComponent$.subscribe(((child) => {
            this.child = child
            this.reloadChild()
        }).bind(this))
        this.context.modalOpenClose$.subscribe((command) => {
            if (command === OPEN_MODAL_DONT_CLOSE_ON_CLICK) {
                this._open.bind(this)();
                this.dontCloseOnClick = true;
            }
            if (command === OPEN_MODAL) this._open.bind(this)();
            if (command === CLOSE_MODAL) this._close.bind(this)();
            if (command === CLOSE_MODAL_BY_AGENT) this._closeByAgent.bind(this)();
            if (command === TOGGLE_MODAL) this.toggleVisibility.bind(this)();
        })
    }
    set onCloseCallback(callback) {
        this._onModalCloseCallback = callback;
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
    _open() {
        const elementInDom = document.getElementById(this.elementId);
        if (!elementInDom) {
            this.parent.append(this.element);
            PausedSubject.setPause();
        }
    }
    _closeByAgent() {
        const elementInDom = document.getElementById(this.elementId);
        if (elementInDom) {
            elementInDom.remove();
            PausedSubject.resetPause();
            this.dontCloseOnClick = false;
            this._onModalCloseCallback();
            this._onModalCloseCallback = (() => {});
        }
    }
    _close(event) {
        if (event && event.target !== this.element) return;
        this._closeByAgent();
        PausedSubject.resetPause();
        if (this.onCloseSubject$) this.onCloseSubject$.value();
    }
}