'use strict';

const fs = require('fs');

const mod = {};

mod.file = path => {
    try {
        return fs.statSync(path).isFile();
    } catch (error) {
        return false;
    }
}

mod.dir = path => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (error) {
        return false;
    }
}


module.exports = mod;
