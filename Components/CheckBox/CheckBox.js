
class CheckBox extends Component{
    static labelBase = `check-box`
    static getHtmlTemplate(args) {
        return `
            <div class="check-box" id="${args.id}"></div>
            <span class="check-box-label">${args.label}</span>
        `
    }
    static getDefaultArgs(args) {
        const id = `CheckBox.labelBase-${args.uuid}`
        const boost = {
            wrapperTag: 'div',
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
        console.log('UPG', upgradedArgs)
        super(upgradedArgs);
        Component.throwIfNotMandatoryFields(
            CheckBox.mandatoryKeys, upgradedArgs, `CheckBox: some of mandatory keys: ${CheckBox.mandatoryKeys.join(', ')} are missing`
        )
        this.box = this.element.getElementById(upgradedArgs.id);
        this.addListeners(upgradedArgs)
    }

    addListeners(args) {
        rxjs.fromEvent(this.box, 'click').subscribe(args.action);
    }
}

