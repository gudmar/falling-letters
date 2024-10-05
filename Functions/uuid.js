const getUuid = () => {
    const rand = Math.random();
    const shifted = rand * Math.pow(10, 16);
    const ceiled = Math.ceil(shifted);
    const result = ceiled.toString(36)
    return result;
}
