import { isNonzeroPositiveInteger } from './typeCheck'
import { rand } from './rand';


const generateKey = (length?: number) => {
    if (!isNonzeroPositiveInteger(length)) {
        length = 1
    }

    return Array(length).fill('').reduce((prev, item) =>
        prev + String.fromCharCode(rand(19968, 40869))
    , '');
};


export {
    generateKey
}
