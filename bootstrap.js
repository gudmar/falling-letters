const context = new ContextProvider();

new Modal({
    parentId: ROOT_ID,
    context
})

const score = document.createElement('div');
score.innerHTML = 'Score'

const gameTitle = elementFromHtml('<div>MASTER KEYBOARD</div>')

const openModalWithGameOptionsButton = new Button({
    label: 'Game options',
    action: () => {
        context.modalOpenClose$.next(OPEN_MODAL)
        console.log('Button click')
    },
    context,
    elementClasses: 'button-wrapper'
})

const titleBar = new TitleBar({
    componentId: TITLE_ID,
    context,
    wrappingTag: 'div',
    children: [score, gameTitle, openModalWithGameOptionsButton.element],
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

