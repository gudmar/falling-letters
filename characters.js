const getCharactersRangeAttributes = ([startCharacter, endCharacter]) => {
    const startCharacterCode = startCharacter.charCodeAt();
    const endCharacterCode = endCharacter.charCodeAt();
    const count = endCharacterCode - startCharacterCode + 1;
    return { startCharacterCode, endCharacterCode, count }
}

const getCharactersFromRangeOneByOne = ([startCharacter, endCharacter]) => {
    const {startCharacterCode, count} = getCharactersRangeAttributes([startCharacter, endCharacter])
    const allCharacters = rxjs.range(startCharacterCode, count).pipe(
        rxjs.map((code) => (String.fromCharCode(code))),
    )
    return allCharacters
}

const getAllCharactersFromRange = (charRange) => {
    const { count } = getCharactersRangeAttributes(charRange);
    const charactersOneByOne = getCharactersFromRangeOneByOne(charRange);
    const allCharacters = charactersOneByOne.pipe(rxjs.buffer(count));
    return allCharacters
}
const getUpperLetters = () => getAllCharactersFromRange(['A','Z']);
const getLowerCases = () => getAllCharactersFromRange(['a', 'z']);
const getDigits = () => getAllCharactersFromRange(['0','9'])
const getLowerPolishCharacters = () => rxjs.from(['ą', 'ć', 'ó', 'ź', 'ż']);
const getUpperPolishCharacters = () => rxjs.from(['Ą', 'Ć', 'Ó', 'ź'.toUpperCase(), 'Ż']);

const optionToCharacterGeneratorMap = [
    { option: UPPER, handler: getUpperLetters, },
    { option: LOWER, handler: getLowerCases, },
    { option: DIGITS, handler: getDigits, },
    { option: LOWER_POLISH, handler: getLowerPolishCharacters, },
    { option: UPPER_POLISH, handler: getUpperPolishCharacters, },
]

const getCharacterSymbols = () => {
    const RANGE_1 = ['!', '/']
    const RANGE_2 = [':', '@']
    const RANGE_3 = ['[', '`']
    const RANGE_4 = ['{', '}']
    const allCharacterSymbols$ = rxjs.merge(
        getCharactersFromRangeOneByOne(RANGE_1),
        getCharactersFromRangeOneByOne(RANGE_2),
        getCharactersFromRangeOneByOne(RANGE_3),
        getCharactersFromRangeOneByOne(RANGE_4),
    ).pipe(
        rxjs.flatMap(x => x),
        rxjs.reduce((acc, character) => {
                acc.push(character)
                return acc
            },
            []
        )
    );
}

getCharacterSymbols()

const random = (nr) => Math.floor(Math.random() * nr);

const shuffleArray = (arr) => {
    const shuffled = arr.reduce((acc, item) => {
        const indexInShuffledArray = random(acc);
        acc[indexInShuffledArray] = item;
        return acc
    }, [])
    return shuffled
}

const observableToArray = (arrObservable) => {
    let arr = [];
    const subscribtion = arrObservable.subscribe((a) => { arr = a })
    subscribtion.unsubscribe()
    return arr;
}

const observablesToArray = (arrObservables) => {
    let arr = [];
    const subscribtion = rxjs.concat(...arrObservables)
        .pipe(rxjs.flatMap(x=>x), rxjs.buffer())
        .subscribe((a) => {arr = a})
    subscribtion.unsubscribe()
    return arr;    
}

const getRandomArrayElementFromObservableEmitter  = (arrayObservable) => {
    const array = observableToArray(arrayObservable);
    const toolkit = getRandomArrayElementEmitter(array);
    return toolkit;
}

const getRandomArrayElementFromObservableEmitters  = (arrayObservables) => {
    const array = observablesToArray(arrayObservables);
    const toolkit = getRandomArrayElementEmitter(array);
    return toolkit;
}


const getRandomArrayElementEmitter = (array) => {
    const randomEmitter = new rxjs.Subject();
    const nextElement = (() => {
        const randomIndex = random(array.length)
        const item = array[randomIndex]
        randomEmitter.next(item)
    }).bind(array)
    return {randomEmitter, nextElement, elements:array}
}

const nullElementEmitter = () => getRandomArrayElementEmitter([null]);

const getCharacterGenerator = () => {
    const emitterFunctions = getArrayGeneratorFunctions();
    if (!emitterFunctions.length) return nullElementEmitter()
    const emiters = emitterFunctions.map((emiter) => {
        return emiter()
    });
    const generator = getRandomArrayElementFromObservableEmitters(emiters)
    generator.nextElement()
    return generator
}

const charGenerators = [getLowerCases(), getUpperLetters()]
const lowerLettersEmitter = getRandomArrayElementFromObservableEmitters(charGenerators);
rxjs.generate(1, x => x < 5, x => x + 1).subscribe(() => lowerLettersEmitter.nextElement())
