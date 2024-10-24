class GameOptions extends Component {
    static getBoostedArgs(args) {
        const result = {
            ...args,
            htmlTemplate: GameOptions.getHtmlTemplate(args),
            placeChildren: GameOptions.placeChildren,
            slotChildren: {
                'game-options-characters': args.gameCharacterOptionsInterior.element,
            }            
        }
        return result
    }
    static placeChildren(element, children) {
        const placeChildrenFunction = getPlaceChildren();
        const elementWithChildren = placeChildrenFunction(element, children);
        return elementWithChildren;
    }
    static getHtmlTemplate(args) {
        return `
        <div class = "game-options-wrapper">
            <div class="game-options-container">
                <div class="game-options-title">
                    Select characters
                </div>
                <div class="game-options-form game-options-characters">
            
                </div>
            </div>
            <div class="game-options-container">
                <div class="game-options-title">
                    Select parameters
                </div>
                <div class="game-options-form game-options-parameters">
            
                </div>
            </div>
        </div>
        `
    }
    constructor(args) {
        const {context} = args;
        const gameCharacterOptionsInterior = new GameCharacterOptions({context}); 
        const boostedArgs = GameOptions.getBoostedArgs({...args, gameCharacterOptionsInterior: gameCharacterOptionsInterior});
        super(boostedArgs);
        this.gameCharacterOptionsInterior = gameCharacterOptionsInterior;
    }
}
