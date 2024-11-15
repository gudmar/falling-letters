
class CheckBox extends Component{
    static labelBase = `check-box`
    static checkedClassName = 'check-box-checked'
    static getHtmlTemplate(args) {
        return `
            <div class="check-box-wrapper">
                <span class="check-box" id="${args.id}"></span>
                <span class="check-box-label">${args.label}</span>
            </div>
        `
    }
    static getDefaultArgs(args) {
        const id = `CheckBox.labelBase-${args.uuid}`
        const boost = {
            wrapperClass: 'check-box-wrapper',
            htmlTemplate: CheckBox.getHtmlTemplate({...args, id}),
            id
        }
        return {...args, ...boost}
    }
    static mandatoryKeys = ['label', 'action'];
    constructor(args) {
        const uuid = getUuid();
        const upgradedArgs = CheckBox.getDefaultArgs({...args, uuid});
        super(upgradedArgs);
        Component.throwIfNotMandatoryFields(
            CheckBox.mandatoryKeys, upgradedArgs, `CheckBox: some of mandatory keys: ${CheckBox.mandatoryKeys.join(', ')} are missing`
        )
        this.box = findChildWithId(this.element, upgradedArgs.id)        
        this.label = upgradedArgs.label;
        this.check$ = new rxjs.BehaviorSubject(this.check)
        this.isChecked = args.checked;
        this.action = args.action;
        this.addListeners(upgradedArgs)
        this.check$.next(args.checked)
    }

    addListeners(args) {
        this.check$.subscribe((value) => {
            if (value) { this.box.classList.add(CheckBox.checkedClassName)}
            else (this.box.classList.remove(CheckBox.checkedClassName))
        })
        rxjs.fromEvent(this.box, 'click').subscribe(((newValue) => {
            this.toggle()
        }).bind(this));
    }
    toggle() {
        if (this.isChecked) {this.uncheck()}
        else { this.check()}
    }
    check() {
        const isChangeMade = this.action(this.label, this.check$.value)
        if (!isChangeMade) return;
        this.isChecked = true
        this.check$.next(true)
    }
    uncheck() { 
        const isChangeMade = this.action(this.label, this.check$.value)
        if (!isChangeMade) return;
        this.isChecked = false
        this.check$.next(false)
    }
}

