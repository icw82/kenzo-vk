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

//const paths = [
//    'main.js'
//].map(item => './sources/ext/' + item);

const base = () => gulp
    .src('./sources/ext/main.js');

const modules = path => {
    const modules = [];

    each (fs.readdirSync(path), name => {
        const dir = join(path, name);

        if (!fs.statSync(dir).isDirectory())
            return;

//        const queue = streamqueue({ objectMode: true });

        const paths = [
            join(dir, 'main.js'),
            join(dir, '*.js')
        ];

        const module = gulp
            .src(paths)
            .pipe(concat(name + '.js'))
            .pipe(insert.wrap(
                '(ext => {\nconst mod = new core.Module(\'' + name + '\');\n',
                '\next.modules[\'' + name + '\'] = mod;\n})(ext);\n'));

        modules.push(module);

//        const queue = streamqueue({ objectMode: true });

//        queue.queue(gulp.src([
//            join('./sources/open-code__mod.js'),
//            join(module_dir, 'main.js'),
//            join(module_dir, '*.js')
//        ]));
//
//        let sub_modules_dir = join(module_dir, 'submodules');
//
//        if (is_dirSync(sub_modules_dir)) {
//            queue.queue(sub_modules_stream(sub_modules_dir));
//        }
//
//        queue.queue(gulp.src([
//            join('./sources/close-code__mod.js')
//        ]));
//
//        let module = queue.done().pipe(concat(name + '.js'))
//
//        modules.push(module);

    });

    return es.merge(modules);
}

const submodules = path => {

}

gulp.task('scripts_ext', () => {
    const queue = streamqueue({ objectMode: true });

    queue.queue(base());
    queue.queue(modules('./sources/ext/modules/'));

    return queue.done()
        .pipe(concat('ext.js'))
        .pipe(insert.wrap(
            'const ext = ((kk, core) => {\n\nconst each = kk.each;\n\n',
            '\nreturn ext;\n})(kk, core);\n\next.init();\n'))
        .pipe(gulp.dest('build/scripts'));

});

//gulp.task('watch__scripts_ext', () => gulp.watch(paths, ['scripts_ext']));
