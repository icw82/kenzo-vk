/**
 * Случайное целое число
 */
const rand = (first: number | unknown[], second) => {
    let min: number;
    let max: number;

    // Если первым аргументом передан массив
    if (first instanceof Array)
        return first[ rand(0, first.length - 1) ];

    // Если аргументов нет — выдавать случайно true/false
    if (typeof first === 'undefined')
        return !Math.round(Math.random())

    // Если аргумент только один — задаёт разряд случайного числа
    if (typeof second === 'undefined') {
        var depth = Math.floor(Math.abs(first));

        if (depth >= 16)
            throw new Error(`Нельзя задать число более чем в 16 знаков`);

        if (depth === 0)
            return 0;

        if (depth === 1)
            min = 0;
        else
            min = Math.pow(10, depth - 1);

        return rand(min, Math.pow(10, depth) - 1);

    }

    // Если два аргумента
    min = first;
    max = second + 1;

    return Math.floor( Math.random() * (max - min) ) + min;

};


export {
    rand
}
