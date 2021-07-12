/**
 * Проверки типов
 */

/**
 * @param {any} value
 * @returns {boolean}
 * // TODO: Производить проверку доступности нативной реализации единожды.
 * // TODO: Встроенный выброс ошибки
 */
const isInteger = (value: unknown): boolean => {
    if (Number.isInteger instanceof Function) {
        return Number.isInteger(value);
    }

    return typeof value === 'number' &&
        isFinite(value) && !(value % 1);
};

const isIntegerArray = (value: unknown[]): boolean =>
    (value instanceof Array) &&
        value.every((item: unknown): boolean => isInteger(item));

const isPositiveInteger = (value: unknown): boolean =>
    isInteger(value) && value >= 0;

const isPositiveIntegerArray = (value: unknown[]): boolean =>
    (value instanceof Array) &&
        value.every((item: unknown): boolean => isPositiveInteger(item));

const isNonzeroPositiveInteger = (value: unknown): boolean =>
    value !== 0 && isPositiveInteger(value);

const isNonzeroPositiveIntegerArray = (value: unknown[]): boolean =>
    (value instanceof Array) &&
        value.every((item: unknown): boolean => isNonzeroPositiveInteger(item));

export {
    isInteger,
    isIntegerArray,
    isPositiveInteger,
    isPositiveIntegerArray,
    isNonzeroPositiveInteger,
    isNonzeroPositiveIntegerArray
};
