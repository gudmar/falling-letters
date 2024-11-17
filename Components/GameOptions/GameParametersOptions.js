const MAX_MISSED_KEY = 'maxMissed';
const MAX_MISTAKEN_KEY = 'maxMistaken';

const getParametersOptionsSturcture = (context) => ([
    {
        component: Title,
        args: { label: 'Speed' }
    },
    {
        component: WithLabel,
        args: {
            component: AdjustableCounter,
            context,
            label: 'Move',
            lowerThreshold: 1,
            upperThreshold: 10,
            startValue: 1,
            subject: context.moveSpeed$, // subject will be set initially from localStorage
        }
    },
    {
        component: WithLabel,
        args: {
            component: AdjustableCounter,
            context,
            label: 'Appear',
            lowerThreshold: 1,
            upperThreshold: 10,
            startValue: 1,
            subject: context.appearSpeed$, // subject will be set initially from localStorage
        }
    },
    {
        component: Title,
        args: { label: 'Errors' }
    },
    {
        component: WithLabel,
        args: {
            component: AdjustableCounter,
            context,
            label: 'Max missed',
            lowerThreshold: 1,
            upperThreshold: 5,
            startValue: 1,
            subject: context.maxMissed$, // subject will be set initially from localStorage
        },
        as: MAX_MISSED_KEY
    },
    {
        component: WithLabel,
        args: {
            component: AdjustableCounter,
            context,
            label: 'Max mistaken',
            lowerThreshold: 1,
            upperThreshold: 10,
            startValue: 1,
            subject: context.maxMistaken$, // subject will be set initially from localStorage
        },
        as: MAX_MISTAKEN_KEY
    },
    {
        component: Title,
        args: { label: 'End game on timeout' }
    },
    {
        component: CheckBox,
        args: {
            context,
            label: 'Should end game on timeout',
            action: () => {
                const currentValue = context.shouldEndGameOnTimeoutSubject$.value;
                const newValue = !currentValue;
                context.shouldEndGameOnTimeoutSubject$.next(newValue);
                updateGameParamInLs(SHOULD_END_GAME_ON_TIMEOUT, newValue);
                return true;
            },
            checked: context.resetOnMiss$.value,
        }
    },
    {
        component: InputTime,
        args: {
            context,
            label: 'Timeout',
            // value: context.endGameTimeoutValueSubject$.value,
            subject: context.endGameTimeoutValueSubject$,
        },
    },

    {
        component: Title,
        args: { label: 'Other' }
    },
    {
        component: TextBox,
        args: {
            context,
            label: 'Player name',
            value: context.playerName$.value,
            callback: (newName) => {
                context.playerName$.next(newName);
            }    
        },
    },
    {
        component: CheckBox,
        args: {
            context,
            label: 'Reset on miss',
            action: () => {
                const currentValue = context.resetOnMiss$.value;
                const newValue = !currentValue;
                context.resetOnMiss$.next(newValue);
                updateGameParamInLs(RESET_ON_MISS, newValue);
                return true;
            },
            checked: context.resetOnMiss$.value,
        }
    },
    {
        component: CheckBox,
        args: {
            context,
            label: 'End game on threshold broken',
            action: () => {
                const currentValue = context.resetOnMiss$.value;
                const newValue = !currentValue;
                context.resetOnMiss$.next(newValue);
                updateGameParamInLs(END_GAME_ON_THRESHOLD_BROKEN, newValue);
                return true
            },
            checked: context.endGameOnThresholdsBroken$.value,
        }
    }
])

const structureToDocumentContainer = (structure, container, componentContext) => {
    rxjs.from(structure).subscribe(
        ({component, args, as}) => {
            const componentInstance = new component(args);
            container.append(componentInstance.element);
            if (as) {
                componentContext[as] = componentInstance;
            }
        }
    )
}

class GameParametersOptions extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-parameters-options-wrapper',
        componentId: getUuid(),
    }

    constructor(args) {
        super({...args, ...GameParametersOptions.defaultArgs});
        this.setInterior();
        this.context = args.context;
    }

    setInterior() {
        const structure = getParametersOptionsSturcture(this.context);
        structureToDocumentContainer(structure, this.element, this);
    }

    endIfOverThreshold() {
        const isOverErrorsThreshold = 
            this[MAX_MISTAKEN_KEY]?.component?.counter?.isBelowLowerThreshold || this[MAX_MISTAKEN_KEY]?.component?.counter?.isAboveUpperThreshold;
        const isOverMissesThreshold = this[MAX_MISSED_KEY]?.component?.counter?.isBelowLowerThreshold || this[MAX_MISTAKEN_KEY]?.component?.counter?.isAboveUpperThreshold;
        if (isOverErrorsThreshold || isOverMissesThreshold) ContextProvider.gameState$.next(GAME_ENDED);
    }
}
