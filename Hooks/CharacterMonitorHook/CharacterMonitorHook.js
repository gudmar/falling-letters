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
    constructor(context) {
        this.context = context;
        context.currentCharacters$ = new rxjs.BehaviorSubject({});
        context.characterRemoveCause$ = new rxjs.BehaviorSubject({ cause: EMPTY, id: null });
        context.registerBirth$ = new rxjs.Subject({id: null, character:''});
        this.addListeners();
    }

    addListeners() {
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
            }
            // if (cause === EMPTY) { console.log('characterRemoveCauseInitialized')}
        }).bind(this))
    }
}
