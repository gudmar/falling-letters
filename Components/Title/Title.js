class Title extends Component {
    static getDefaultArgs = (args) => ({
        context: null,
        htmlTemplate: Title.getHtmlTemplate(args)
    });
    static getHtmlTemplate = (args) => {
        return `
            <div class="title-wrapper">${args.label}</div>
        `
    }

    constructor(args) {
        super({
            ...args, ...Title.getDefaultArgs(args)
        })
    }
}