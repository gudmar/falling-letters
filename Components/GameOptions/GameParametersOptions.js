const getParametersOptionsSturcture = (context) => ([
    {
        component: AdjustableCounter,
        args: {
            context,
            label: 'Move speed',
            lowerThreshold: 1,
            upperThreshold: 5,
            startValue: 1,
            subject: context.moveSpeed$, // subject will be set initially from localStorage
        }
    },
    {
        component: AdjustableCounter,
        args: {
            context,
            label: 'Appear speed',
            lowerThreshold: 1,
            upperThreshold: 5,
            startValue: 1,
            subject: context.appearSpeed$, // subject will be set initially from localStorage
        }
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
            checked: context.resetOnMiss$.value//getGameParamOrDefault(RESET_ON_MISS),
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