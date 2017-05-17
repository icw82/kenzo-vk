'use strict';

module.exports = error => {
    console.error(
        ['\x1b[31m', '\x1b[0m'].join('%s'),
        error.cause.filename
    );
    console.error(error.cause.message);
    console.error('line:', error.cause.line);
    console.error('col:', error.cause.col);
    console.error('pos:', error.cause.pos);
}
