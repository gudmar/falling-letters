const getParametersOptionsSturcture = (context) => {[
    {
        component: AdjustableCounter,
        args: {
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
            label: 'Appear speed',
            lowerThreshold: 1,
            upperThreshold: 5,
            startValue: 1,
            subject: context.moveSpeed$, // subject will be set initially from localStorage
        }
    },
    {
        component: CheckBox,
        args: {
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
]}

const structureToDocumentFragment = (structure) => {
    const fragment = document.createDocumentFragment();
    rxjs.from(structure).subscribe(
        ({component, args}) => {
            const componentInstance = new component(args);
            fragment.append(componentInstance.element);    
        }
    )
    return fragment;
}

class GameParametersOptions extends Component {
    static defaultArgs = {
        elementTag: 'div',
        elementClasses: 'game-parameters-options-wrapper',
        componentId: getUuid(),
    }

    constructor(args) {
        super({...args, ...GameParametersOptions.defaultArgs});
        // this.setInterior();
    }

    setInterior() {
        const structure = getParametersOptionsSturcture(this.context);
        const fragment = structureToDocumentFragment(structure);
                
    }
}