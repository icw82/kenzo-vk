import { resolve, relative, join } from 'path';
import { series, src, dest, watch } from 'gulp';
import { TaskFunction } from 'undertaker';
import * as chalk from 'chalk';
import { sync as del } from 'del';
import { createProject } from 'gulp-typescript';

import { sources, destination } from '../paths';

const tsProject = createProject({
    alwaysStrict: true,
    baseUrl: 'sources',
    // importHelpers: true,
    isolatedModules: false,
    lib: [
        'esNext',
        'dom',
    ],
    target: 'es2020',
    moduleResolution: 'node',
    // typeRoots: ['node_modules/@types']

    // declaration: true,
    // noImplicitReturns: true,
    // noUnusedParameters: false,
    // strict: true,

    // forceConsistentCasingInFileNames: true,
});

const globToSync = [
    './sources/**/*.ts',
];

const compile = () => src(globToSync)
    .pipe(tsProject())
    .pipe(dest(destination));


const scripts: TaskFunction = series(
    compile,
);

const scriptsWatch: TaskFunction = () => {
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

    watcher.on('unlink',(event: string, filename: string) => {
        const file = chalk.redBright(filename);
        // const event = chalk.redBright('removed');

        console.log(`File ${ file } has been ${ event }`);
    });

    watcher.on('change', compile);

    watcher.on('add', compile);

    watcher.on('unlink', (event: string, filename: string) => {
        const abs = resolve(filename.replace(/.ts$/, '.js'));
        const rel = relative(sources, abs);
        const dest = join(destination, rel);

        return del(dest);
    });
};


export {
    scripts,
    scriptsWatch,
};
