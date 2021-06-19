import { series, parallel } from 'gulp';
import { immutable } from './immutable';
import { scripts, scriptsWatch } from './scripts';
import { styles, stylesWatch } from './styles';


const build = series(
    immutable,
    parallel(
        scripts,
        styles,
    ),
);

const buildWatch = parallel(
    scriptsWatch,
    stylesWatch,
);


export {
    build,
    buildWatch,
    stylesWatch,
};
