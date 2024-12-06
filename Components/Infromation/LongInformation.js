const getSingleItemAsHtmlString = (type, value) => {
    if (type === 'component') {
        return value
    }
    if (type === 'list') {
        return `
            <ul>
                ${value.map((item) => '<li>' + item + '</li>').join('')}
            </ul>
        `
    }
    if (type === 'section') {
        return `
            <section>
                ${getSingleItemAsHtmlString(value)}
            </section>
        `
    }
    if (type === 'acticle') {
        return `
            <article>
                ${getSingleItemAsHtmlString(value)}
            </article>
        `
    }
    return `
        <${type}>${value}</${type}>
    `
}

const getHtmlElements = (content) => {
    const elements = content.map(({type, value}) => {
        if (type === 'component') return value;
        const result = elementFromHtml(getSingleItemAsHtmlString(type, value));
        return result;
    })
    return elements;
}

const contentToHtmlString = (content) => {
    const result = content.map(
        ({ type, value }) => {
            return getSingleItemAsHtmlString(type, value)
        }
    ).join('')
    return result
}

const getDomElement = (content) => elementFromHtml(content);

class LongInformation extends Component {
    static throwIfKeysMissing(args) {
        const mandatoryKeys = ['message']
        const keys = Object.keys(args);
        if (mandatoryKeys.some((key) => !keys.includes(key))) {
            throw new Error('Information: key missing')
        }
    }
    static getHtmlTemplate(args) {
        const width = args.width ? `${args.width}%`: '100%';
        const result =
            `
                <div class="information-wrapper long-information-size-limit">
                    <div class="long-information-container" style="width: ${width}">
                    </div>
                </div>
            `
        return result;
    }
    static getBoostedArgs(args) {
        return {
            ...args,
            htmlTemplate: LongInformation.getHtmlTemplate(args),
            schema: {
                content: {
                    type: ARRAY,
                    requirement: MANDATORY,
                },
                timeout: {
                    type: NUMBER,
                    requirement: OPTIONAL,
                }
            }
        }
    }
    constructor(args) {
        const boostedArgs = LongInformation.getBoostedArgs(args);
        super(boostedArgs);
        this.infoContainer = this.element.querySelector('.long-information-container');
        this.timeout = args.timeout;
        this.addContent(args.content);
        context.modalComponent$.next(this.element);
        this.context.modalOpenClose$.next(OPEN_MODAL);
        this.addListeners()
    }

    addContent(content) {
        const elements = getHtmlElements(content);
        elements.forEach(((element) => {this.infoContainer.append(element)}).bind(this))
    }

    addListeners() {
        if (!this.timeout) return;
        onTimeout(this.timeout, () => this.context.modalOpenClose$.next(CLOSE_MODAL));
    }
}
