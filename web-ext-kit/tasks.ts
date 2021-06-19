import { series, parallel } from 'gulp';

import { clean } from './tasks/clean';
import { immutable, immutableWatch } from './tasks/immutable';
import { scripts, scriptsWatch } from './tasks/scripts';
import { styles, stylesWatch } from './tasks/styles';


const build = series(
    immutable,
    parallel(
        scripts,
        styles,
    ),
);

const watch = series(
    immutableWatch,
    parallel(
        scriptsWatch,
        stylesWatch,
    )
);

const defaultTask = series(clean, build, watch);


export {
    clean,

    build,
    watch,

    defaultTask as default,
};
