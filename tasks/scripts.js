'use strict';

const gulp = require('gulp');
const path = require('path');
const fs = require('fs');
const join = path.join;
const task_name = path.basename(__filename, '.js');
const info = require('./../package.json');

const is = require('./../tools/is');
const ms = require('./../tools/ms');
const streamqueue = require('streamqueue');
const insert = require('gulp-insert');
const concat = require('gulp-concat');
const strip = require('gulp-strip-comments');
//const rename = require('gulp-rename');
//const uglify = require('gulp-uglify');
//const replace = require('gulp-replace');

const glob_core = [
    'main.js',
    'utils/*.js',
    'events/*.js',
    'storage/*.js',
    'classes/*.js'
].map(item => './sources/core/' + item);

gulp.task(task_name + ':core', () => gulp
    .src(glob_core)
    .pipe(concat('core.js'))
    .pipe(insert.wrap(
        'if(typeof browser===kk._u){var browser;' +
        'typeof chrome!==kk._u?browser=chrome:console.error' +
        '("Неизвестный браузер")}\n' +
        'const core = (kk => {\n\nconst each = kk.each;\n\n',
        '\nreturn core;\n})(kk);\n\ncore.init();\n'))
    .pipe(strip())
    .pipe(gulp.dest('build/scripts'))
);


const base = path => gulp
    .src(join(path, 'main.js'));

const modules = path => {
    const modules = [];

    if (is.dir(path)) {
        fs.readdirSync(path).forEach(name => {
            const dir = join(path, name);

            if (!is.dir(dir))
                return;

            const queue = streamqueue({ objectMode: true });

            // Основные файлы модуля
            queue.queue(gulp.src([
                join(dir, 'main.js'),
                join(dir, '*.js')
            ], { allowEmpty: true }).pipe(concat(name + '.js')));

            // Подмодули
            queue.queue(submodules(join(dir, 'submodules')));

            const module = queue.done()
                .pipe(concat(name + '.js'))
                .pipe(insert.wrap(
                    ';(ext => {\nconst mod = new core.Module(\'' + name + '\', ext);\n\n',
                    '\next.modules[\'' + name + '\'] = mod;\n})(ext);\n'));

            modules.push(module);
        });
    }

    return ms(modules);
}

const submodules = path => {
    const submodules = [];

    if (is.dir(path)) {
        fs.readdirSync(path).forEach(name => {
            const dir = join(path, name);

            if (!is.dir(dir))
                return;

            const queue = streamqueue({ objectMode: true });

            // Файлы подмодуля
            queue.queue(gulp.src([
                join(dir, 'main.js'),
                join(dir, '*.js')
            ]).pipe(concat(name + '.js')));

            const submodule = queue.done()
                .pipe(concat(name + '.js'))
                .pipe(insert.wrap(
                    ';(mod => {\nconst sub = new core.SubModule(\'' + name + '\', mod);\n\n',
                    '\nmod.submodules[\'' + name + '\'] = sub;\n})(mod);\n'));

            submodules.push(submodule);

        });
    }

    return ms(submodules);
}

gulp.task(task_name + ':ext', () => {
    const path = './sources/ext';
    const queue = streamqueue({ objectMode: true });

    queue.queue(base(path));
    queue.queue(modules(join(path, 'modules')));

    return queue.done()
        .pipe(concat('ext.js'))
        .pipe(insert.wrap(
            'const ext = ((kk, core) => {\n\nconst each = kk.each;\n\n',
            '\nreturn ext;\n})(kk, core);\n\next.init();\n'))
        .pipe(strip())
        .pipe(gulp.dest('build/scripts'));

});

gulp.task(task_name, gulp.parallel(
    task_name + ':core',
    task_name + ':ext'
));

gulp.task('watch:' + task_name + ':core', () => gulp.watch([
    './sources/core/**/*.js'
], gulp.task(task_name + ':core')));

gulp.task('watch:' + task_name + ':ext', () => gulp.watch([
    './sources/ext/**/*.js'
], gulp.task(task_name + ':ext')));
