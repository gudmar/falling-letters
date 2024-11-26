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
    const htmlList = `<ul class="TimerPicker-list">${htmlItemsList}</ul>`
    return htmlList;
}

const clearAllSelectedFromContainer = (container) => {
    const elements = Array.from(container.querySelectorAll('.TimePicker-list-element'));
    elements.forEach((element) => {
        element.classList.remove('TimePicker-selected')
    })
}

const selectValueInContainer = (container, newValue) => {
    const elements = Array.from(container.querySelectorAll('.TimePicker-list-element'));
    console.log('New', newValue)
    const element = elements.find((element) => {
        const value = element.getAttribute('value');
        return +value === newValue
    })
    element.classList.add('TimePicker-selected')
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
        const boostedArgs = TimePicker.getBoostedArgs(args);
        super(boostedArgs);
        this.subject = args.subject;
        if (!TimePicker.isStepValid(args)) throw new Error(`TimePicker: ${args.secondsStep} is not a valid step`)
        this.minutesContainer = this.element.querySelector('.TimePicker-minutes-container');
        this.secondsContainer = this.element.querySelector('.TimePicker-seconds-container');
        this.appendInterior(args);
        this.setListenersToContainers();
        this.addListeners();
    }

    addListeners() {
        this.subject.subscribe((newTime) => {
            console.log(newTime);
            this.refreshValues(newTime);
        })
    }

    clearAllSelected() {
        clearAllSelectedFromContainer(this.minutesContainer);
        clearAllSelectedFromContainer(this.secondsContainer);
    }

    selectValues(time) {
        console.log('Time', time)
        const newMinutes = extractMinutes(time);
        selectValueInContainer(this.minutesContainer, newMinutes);
        const newSeconds = extractSeconds(time);
        selectValueInContainer(this.secondsContainer, newSeconds);
    }

    refreshValues(newTime) {
        this.clearAllSelected();
        this.selectValues(newTime);
    }

    setListenersToSeconds() {
        this.secondsContainer.querySelectorAll('.TimePicker-list-element').forEach((element) => {
            rxjs.fromEvent(element, 'click').subscribe((event) => {
                const element = event.target;
                const valueAsString = element.getAttribute('value');
                const seconds = +valueAsString;
                const currentTime = this.subject.value;
                const minutes = extractMinutes(currentTime);
                const newValue = minutes * SECONDS_IN_MINUTE + seconds;
                this.subject.next(newValue);    
            })
        })
    }

    setListenersToMinutes() {
        this.minutesContainer.querySelectorAll('.TimePicker-list-element').forEach((element) => {
            rxjs.fromEvent(element, 'click').subscribe((event) => {
                const element = event.target;
                const valueAsString = element.getAttribute('value');
                const minutes = +valueAsString;
                const currentTime = this.subject.value;
                const seconds = extractSeconds(currentTime);
                const newValue = minutes * SECONDS_IN_MINUTE + seconds;
                this.subject.next(newValue);    
            })
        })
    }

    setListenersToContainers() {
        this.setListenersToSeconds();
        this.setListenersToMinutes(this.minutesContainer);
        // this.secondsContainer.querySelectorAll('.TimePicker-list-element').forEach((element) => {
        //     rxjs.fromEvent(element, 'click').subscribe((event) => {
        //         const element = event.target;
        //         const valueAsString = element.getAttribute('value');
        //         const seconds = +valueAsString;
        //         const currentTime = this.subject.value;
        //         const minutes = extractMinutes(currentTime);
        //         const newValue = minutes * SECONDS_IN_MINUTE + seconds;
        //         this.subject.next(newValue);    
        //     })
        // })
    }


    getSecondsList(args) {
        const {min, max, secondsStep} = args;
        const htmlTemplate = getListAsHtml({
            min: 0, max: SECONDS_IN_MINUTE, step: secondsStep
        });
        const element = getElementFromTemplate({htmlTemplate})
        return element;
    }

    getMinutesList(args) {
        const {min, max} = args;
        const htmlTemplate = getListAsHtml({
            min: extractMinutes(min),
            max: Math.floor(max/SECONDS_IN_MINUTE),
            step: 1
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
