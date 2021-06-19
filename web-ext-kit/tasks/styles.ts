import { resolve, relative, join } from 'path';
import { series, src, dest, watch } from 'gulp';
import { TaskFunction } from 'undertaker';
import * as less from 'gulp-less';
import * as chalk from 'chalk';
import { sync as del } from 'del';

import { sources, destination } from '../paths';


const globToSync = [
    './sources/**/*.less',
];

const compile = () => src(globToSync)
    // .pipe(less())
    .pipe(dest(destination));

const styles: TaskFunction = series(
    compile,
);

const stylesWatch: TaskFunction = () => {
    const watcher = watch(globToSync);

    watcher.on('change', (event: string, filename: string) => {
        const file = chalk.blue(filename);
        // const event = chalk.blue('changed');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('add', (event: string, filename: string) => {
        const file = chalk.greenBright(filename);
        // const event = chalk.greenBright('added');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('unlink', (event: string, filename: string) => {
        const file = chalk.redBright(filename);
        // const event = chalk.redBright('removed');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('change', compile);

    watcher.on('add', compile);

    watcher.on('unlink', (event: string, filename: string) => {
        const abs = resolve(filename.replace(/.less$/, '.css'));
        const rel = relative(sources, abs);
        const dest = join(destination, rel);

        return del(dest);
    });
};


export {
    styles,
    stylesWatch,
};
