const context = new ContextProvider();

const score = document.createElement('div');
score.innerHTML = 'Score'

const gameTitle = elementFromHtml('<div>MASTER KEYBOARD</div>')

const titleBar = new TitleBar({
    componentId: TITLE_ID,
    context,
    wrappingTag: 'div',
    children: [score, gameTitle],
    wrapperClasses: 'TitleBar-wrapper'
})
const gameCanvas = new GameCanvas({
    componentId: GAME_CANVAS_ID,
    context,
    elementTag: 'div',
    elementClasses: 'GameCanvas-wrapper',
})

new Wrapper({
    parentId: ROOT_ID,
    componentId: ROOT_ID,
    wrappingTag: 'div',
    wrapperClasses: 'wrapper',
    children: [
        titleBar.element,
        gameCanvas.element,
    ],
    context,
})
