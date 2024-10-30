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
            upperThreshold: 5,
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
            upperThreshold: 5,
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
        }
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
        }
    },
    {
        component: Title,
        args: { label: 'Other' }
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
            },
            checked: context.endGameOnThresholdsBroken$.value,
        }
    }
])

const structureToDocumentContainer = (structure, container) => {
    rxjs.from(structure).subscribe(
        ({component, args}) => {
            const componentInstance = new component(args);
            container.append(componentInstance.element); 
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
    }

    setInterior() {
        const structure = getParametersOptionsSturcture(this.context);
        structureToDocumentContainer(structure, this.element);
                
    }
}