import kk from 'kenzo-kit';

import { test } from './modules/test/test.js';


const main = (): void => {
    // chrome.runtime.reload();
    console.log('MAIN SCRIPT');
    console.log(kk.generate_key(10));

    test.log();
};


export {
    main,
};
