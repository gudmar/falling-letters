
class Table extends Component {
    static scheme = {
        rows: {
            requirement: MANDATORY,
            type: ARRAY,
        },
        headings: {
            requirement: MANDATORY,
            type: ARRAY,
        },
        title: {
            requirement: OPTIONAL,
            type: STRING,
        }
    }
    static boostArgs(args) {
        return {
            ...args,
            scheme: Table.scheme,
            htmlTemplate: Table.getHtmlTemplate(args),
        }
    }
    static getHtmlTemplate(args) {

        return `<div class="Table-wrapper">
            ${args.title ? '<h2 class="Table-title">' + args.title + '</h2>':''}
            <table class="Table-body">
                <thead class="Table-head">
                    ${
                        args.headings.map(
                            (heading) => '<th class="Table-th">' + heading + '</th>'
                        ).join('')
                    }
                </thead>
                <tbody class="Table-body">
                    ${Table.getHtmlRows(args)}
                </tbody>
            </table>
        </div>`
    }

    static getHtmlRows(args) {
        return args.rows.map((row) => {
            return `
                <tr class="Table-tr">
                    ${Table.getHtmlRow(row)}
                </tr>
            `
        }).join('')
    }

    static getHtmlRow(row) {
        return row.map((cell) => `<td class="Table-td">${cell}</td>`).join('')
    }

    constructor(args){
        throwIfNotFollowingScheme({...args, scheme: Table.scheme})
        console.log(args.rows, args.headings)
        const boostedArgs = Table.boostArgs(args);
        super(boostedArgs)
    }
}
