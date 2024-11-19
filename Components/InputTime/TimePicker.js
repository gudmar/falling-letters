const getList = ({min, max, step}) => {
    let list = [];
    for(let item = min; item < max; item+=step) {
        list.push(item);
    }
    return list;
}

const getListAsHtml = ({min, max, step}) => {
    const items = getList({min, max, step})
    const htmlItemsList = items.map((item) => `<li value="${item}" class="TimePicker-list-element">${item}</li>`).join('');
    const htmlList = `<div class="TimerPicker-list">${htmlItemsList}</div>`
    return htmlList;
}


class TimePicker extends Component {
    static getHtmlTemplate(args) {
        return `
            <div class="TimePicker-wrapper">
                <div class="TimePicker-minutes-container"></div>
                <div class="TimePicker-seconds-container"></div>
            </div>
        `
    }
    static getBoostedArgs(args) {
        return {
            ...args,
            htmlTemplate: TimePicker.getHtmlTemplate(args),
            scheme: {
                max: {
                    type: NUMBER,
                    requirement: MANDATORY,
                },
                min: {
                    type: NUMBER,
                    requirement: MANDATORY,
                },
                secondsStep: {
                    type: NUMBER,
                    requirement: MANDATORY,
                },
                subject: {
                    type: OBJECT,
                    requirement: MANDATORY,
                }
            }
        }
    }

    static isStepValid(args) {
        const {secondsStep} = args;
        const validSteps = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30];
        const isValid = validSteps.includes(secondsStep);
        return isValid;
    }

    constructor(args) {
        const boostedArgs = TimePicker(args);
        super(boostedArgs);
        if (!TimePicker.isStepValid(args)) throw new Error(`TimePicker: ${args.secondsStep} is not a valid step`)
        this.minutesContainer = this.element.querySelector('.TimePicker-minutes-container');
        this.secondsContainer = this.element.secondsContainer('.TimePicker-seconds-container');
        this.appendInterior(args);
    }

    getSecondsList(args) {
        const {secondsStep} = args;
        const htmlTemplate = getListAsHtml({
            min: 0, max: 60, step: secondsStep
        });
        const element = getElementFromTemplate({htmlTemplate})
        return element;
    }

    getMinutesList(args) {
        const {min, max} = args;
        const htmlTemplate = getListAsHtml({
            min, max, step: 1
        });
        const element = getElementFromTemplate({htmlTemplate})
        return element;
    }

    appendInterior(args) {
        const secondsElement = this.getSecondsList(args);
        const minutesElement = this.getMinutesList(args);
        this.minutesContainer.append(minutesElement);
        this.secondsContainer.append(secondsElement);
    }

    selectMinutes(value) {
        currentValue = this.subject.value;
        this.subject.next({
            ...currentValue,
            minutes: value
        })
    }
    selectSeconds(value) {
        currentValue = this.subject.value;
        this.subject.next({
            ...currentValue,
            seconds: value
        })
    }

}
