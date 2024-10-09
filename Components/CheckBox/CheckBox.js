
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
            // wrappingTag: 'div',
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
        this.box = this.element.getElementById(upgradedArgs.id);
        this.label = upgradedArgs.label;
        this.check$ = new rxjs.BehaviorSubject(this.check)
        this.isChecked = args.checked;
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
            args.action(this.label)
        }).bind(this));
    }
    toggle() {
        console.log('Toggle')
        if (this.isChecked) {this.uncheck()}
        else { this.check()}
    }
    check() {
        console.log('Check')
        this.isChecked = true
        this.check$.next(true)
    }
    uncheck() { 
        console.log('Uncheck')
        this.isChecked = false
        this.check$.next(false)
    }
}

