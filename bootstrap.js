const context = new ContextProvider();
context.setInitialCharacterGenerator();
new Modal({
    parentId: ROOT_ID,
    context
})

const gameTitle = elementFromHtml('<div class="title">MASTER KEYBOARD</div>')

new CharacterMonitorHook(context)

const openModalWithGameOptionsButton = new Button({
    label: 'Game options',
    action: () => {
        const gameOptions = new GameOptions({context})
        context.modalComponent$.next(gameOptions.element)
        context.modalOpenClose$.next(OPEN_MODAL)
    },
    context,
    elementClasses: 'button-wrapper'
})

const pauseButton = new Button({
    label: 'Pause',
    context,
    elementClasses: 'button-wrapper',
    action: () => {
        PausedSubject.togglePause();
    }
})

const logCurrentCharactersButton = new Button({
    label: 'log characters',
    context,
    elementClasses: 'button-wrapper',
    action: () => {
        const characters = context.currentCharacters$.value;
        const nrOfCharacters = Object.values(characters).reduce((acc, arr) => {
            const newAcc = acc + arr.length
            return newAcc;
        }, 0)
    }
})

const score = new Counter({
    label: 'Score',
    lowerThreshold: 0,
    subject: context.scoreSubject$,
    startValue: 0,
    context,
})

const nrErrors = new Counter({
    label: 'Errors',
    lowerThreshold: 0,
    upperThreshold: NR_ERRORS_THRESHOLD,
    subject: context.nrErrorsSubject$,
    startValue: 0,
    context,
})

const nrMisses = new Counter({
    label: 'Missed',
    lowerThreshold: 0,
    upperThreshold: NR_MISSES_THRESHOLD,
    subject: context.nrMissesSubject$,
    startValue: 0,
    context,
})

const titleBar = new TitleBar({
    componentId: TITLE_ID,
    context,
    wrappingTag: 'div',
    children: [
        score.element,
        nrMisses.element,
        nrErrors.element,
        gameTitle,
        pauseButton.element,
        openModalWithGameOptionsButton.element,
        logCurrentCharactersButton.element
    ],
    wrapperClasses: 'TitleBar-wrapper'
})
const gameCanvas = new GameCanvas({
    componentId: GAME_CANVAS_ID,
    context,
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

new KeyboardHook(context)
