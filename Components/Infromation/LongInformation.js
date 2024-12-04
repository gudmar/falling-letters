const getSingleItemAsHtmlString = (type, value) => {
    if (type === 'component') {
        return value.element;
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

const contentToHtmlString = (content) => {
    const result = content.map(
        ({ type, value }) => {
            console.log(type, value)
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
        const result =
            `
                <div class="information-wrapper long-information-size-limit">
                    <div class="long-information-container">
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
        const html = contentToHtmlString(content);
        console.log(html)
        console.dir(this.infoContainer)
        this.infoContainer.innerHTML = html;
    }

    addListeners() {
        if (!this.timeout) return;
        onTimeout(this.timeout, () => this.context.modalOpenClose$.next(CLOSE_MODAL));
    }
}
