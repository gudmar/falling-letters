const copyCurrentCharacters = (currentCharacters) => {
    const entries = Object.entries(currentCharacters);
    const newCurrentCharacters = entries.reduce((acc, [key, value]) => {
        acc[key] = [...value];
        return acc;
    }, {})
    return newCurrentCharacters;
}

const removeOldestCharacter = (currentCharacters, character) => {
    const currentCharacterCopy = copyCurrentCharacters(currentCharacters);
    const archive = currentCharacterCopy?.[character];
    if (!archive?.length) return {removedItemId: null, currentRejester: currentCharacters};
    const characterIndex = 0; // always the first element, new items are added at the end
    const removedItemId = archive[characterIndex];
    archive.splice(0, 1);
    return {
        removedItemId,
        currentRejester: currentCharacterCopy,
    }
}

const removeOldestCharacterIfIdMatches = (currentCharacters, character, id) => {
    const currentCharacterCopy = copyCurrentCharacters(currentCharacters);
    const archive = currentCharacterCopy?.[character];
    if (!archive?.length) return;
    const characterIndex = archive.findIndex((itemId) => itemId === id);
    if (characterIndex === -1) return;
    archive.splice(characterIndex, 1);
    return currentCharacterCopy;
}

const registerEntry = (currentCharacters, {id, character}) => {
    const copy = copyCurrentCharacters(currentCharacters);
    if (id && character) {
        if (!copy[character]) copy[character] = [];
        copy[character].push(id)
    }
    return copy;
}

class CharacterMonitorHook {
    static getNrOfCharactersCurrentlyInGame(context) {
        const currentCharactersKeeper = context.currentCharacters$.value;
        const currentCharacters = Object.values(currentCharactersKeeper);
        const sum = currentCharacters.reduce(
            (acc, ids) => {
                const newAcc = acc + ids.length;
                return newAcc
            }, 0
        )
        return sum
    }

    constructor(context) {
        this.context = context;
        context.currentCharacters$ = new rxjs.BehaviorSubject({});
        context.characterRemoveCause$ = new rxjs.BehaviorSubject({ cause: EMPTY, id: null });
        context.registerBirth$ = new rxjs.Subject({id: null, character:''});
        this.addListeners();
        this.oldGameState = ContextProvider.gameState$.value;
    }

    reset() {
        this.context.currentCharacters$.next({});
    }

    addListeners() {
        ContextProvider.gameState$.subscribe((newValue) => {
            if (this.oldGameState === GAME_ENDED && newValue === START_NEW_GAME) {
                this.context.currentCharacters$.next({});
                this.context.registerBirth$.next({id: null, character:''})
            }
            this.oldGameState = newValue;
        })
        this.context.registerBirth$.subscribe((entry) => {
            if (!entry?.id) return;
            const newCharacterRegister = registerEntry(this.context.currentCharacters$.value, entry);
            this.context.currentCharacters$.next(newCharacterRegister);
        })
        this.context.characterRemoveCause$.subscribe((({cause, id, character}) => {
            if (cause === HIT) {
                const {
                    removedItemId,
                    currentRejester,
                } = removeOldestCharacter(this.context.currentCharacters$.value, character)
                const isError = removedItemId === null;
                if (isError) {
                    this.context.nrErrorsSubject$.increment(1);
                    return;
                }
                this.context.removeCharacterWithIdSubject$.next(removedItemId); // remove component
                this.context.currentCharacters$.next(currentRejester);
                this.context.scoreSubject$.increment(10)
                return;
            }
            if (cause === MISS) {
                const characters = removeOldestCharacterIfIdMatches(
                    this.context.currentCharacters$.value, character, id
                ); // remove from rejester, component already gone
                this.context.currentCharacters$.next(characters)
                this.context.nrMissesSubject$.increment(1)
                if (this.context.resetOnMiss$.value === true) {
                    this.context.removeCharacterWithIdSubject$.next(RESET);
                    this.reset();
                    new Information({
                        context: this.context,
                        message: 'You missed a character',
                        timeout: 1000,
                    })
                }
            }
            if (cause === RESET) {
                this.context.removeCharacterWithIdSubject$.next(RESET);
                this.reset();
            }
        }).bind(this))
    }
}
