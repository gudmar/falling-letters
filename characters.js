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

const getUpperLetters = () => getCharactersFromRange(['A','Z']);
const getLowerCases = () => getCharactersFromRange(['a', 'z']);
const getDigits = () => getCharactersFromRange(['0','9'])
const getLowerPolishCharacters = () => (['ą', 'ć', 'ó', 'ź', 'ż']);
const getUpperPolishCharacters = () => (['Ą', 'Ć', 'Ó', 'ź'.toUpperCase(), 'Ż']);

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
    allCharacterSymbols$.subscribe(c => console.log(c))
}

getCharacterSymbols()

const random = (nr) => Math.floor(Math.random() * nr);

// const getArrayStreamInRandomOrder = (arr) => {
//     if (!arr.length) { throw new Error('Array has to have items')}
//     const currentArray$ = new rxjs.BehaviorSubject(arr);
//     const emitter = new rxjs.Subject();
//     currentArray$.subscribe((currArr) => {
//         const definedArray = currArr.length? currArr: arr;
//         const maxValue = definedArray.length;
//         const nextIndex = random(maxValue);
//         emitter.next(definedArray[nextIndex]);
//         const arrWithRemovedItem = [...definedArray];
//         arrWithRemovedItem.splice(nextIndex, 1);
//         currentArray$.next(arrWithRemovedItem);
//     })
//     const emitNextRandomValue = () => {
        
//     }
// }
