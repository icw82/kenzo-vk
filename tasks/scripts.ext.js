'use strict';
const kk = require('../kk-node.js'); // TODO: Вынести в KK.
const each = kk.each;

const gulp = require('gulp');
const streamqueue = require('streamqueue');
const concat = require('gulp-concat');
const insert = require('gulp-insert');
const fs = require('fs');
const join = require('path').join;
const es = require('event-stream');

//const replace = require('gulp-replace');
//const rename = require('gulp-rename');
//const gutil = require('gulp-util');
//const uglify = require('gulp-uglify');

const is_dirSync = path => {
    try {
        return fs.statSync(path).isDirectory();
    } catch (error) {
        return false;
    }
}

const base = path => gulp
    .src(join(path, 'main.js'));

const modules = path => {
    const modules = [];

    if (is_dirSync(path)) {
        each (fs.readdirSync(path), name => {
            const dir = join(path, name);

            if (!is_dirSync(dir))
                return;

            const queue = streamqueue({ objectMode: true });

            // Основные файлы модуля
            queue.queue(gulp.src([
                join(dir, 'main.js'),
                join(dir, '*.js')
            ]).pipe(concat(name + '.js')));

            // Подмодули
            queue.queue(submodules(join(dir, 'submodules')));

            const module = queue.done()
                .pipe(concat(name + '.js'))
                .pipe(insert.wrap(
                    '(ext => {\nconst mod = new core.Module(\'' + name + '\', ext);\n\n',
                    '\next.modules[\'' + name + '\'] = mod;\n})(ext);\n'));

            modules.push(module);
        });
    }

    return es.merge(modules);
}

const submodules = path => {
    const submodules = [];

    if (is_dirSync(path)) {
        each (fs.readdirSync(path), name => {
            const dir = join(path, name);

            if (!is_dirSync(dir))
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
                    '(mod => {\nconst sub = new core.SubModule(\'' + name + '\', mod);\n\n',
                    '\nmod.submodules[\'' + name + '\'] = sub;\n})(mod);\n'));

            modules.push(submodule);

        });
    }

    return es.merge(submodules);
}

gulp.task('scripts_ext', () => {
    const path = './sources/ext';
    const queue = streamqueue({ objectMode: true });

    queue.queue(base(path));
    queue.queue(modules(join(path, 'modules')));

    return queue.done()
        .pipe(concat('ext.js'))
        .pipe(insert.wrap(
            'const ext = ((kk, core) => {\n\nconst each = kk.each;\n\n',
            '\nreturn ext;\n})(kk, core);\n\next.init();\n'))
        .pipe(gulp.dest('build/scripts'));

});

gulp.task('watch__scripts_ext', () => gulp.watch([
    './sources/ext/*.js',
    './sources/ext/**/*.js',
], ['scripts_ext']));
