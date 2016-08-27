'use strict';

const kk = require('../kk-node.js'); // TODO: Вынести в KK.
const each = kk.each;

const gulp = require('gulp');

//const es = require('event-stream');
//const fs = require('fs');
//const path = require('path');
//const replace = require('gulp-replace');
//const rename = require('gulp-rename');
//const gutil = require('gulp-util');
//const uglify = require('gulp-uglify');
//const streamqueue = require('streamqueue');


//gulp.task('scripts', function() {

//
//    let queue = streamqueue({ objectMode: true });
//    queue.queue(base);
//    queue.queue(modules_stream('./sources/modules/'));
//    queue.queue(gulp.src(['./sources/init.js']));
//
//    let sources = queue.done()
//        .pipe(concat('ext.js'))
////        .pipe(sourcemaps.init())
////        .pipe(uglify().on("error", gutil.log)) // У uglify пока нет поддержки ES6.
//        .pipe(rename({suffix: '.min'}))
//        .pipe(sourcemaps.write('../scripts/'))
//
//
//    return es.merge(
//        gulp.src(parts_path),
//        sources
//    ).pipe(gulp.dest('build/scripts'));
//});
//
//function is_dirSync(path) {
//    try {
//        return fs.statSync(path).isDirectory();
//    } catch (error) {
//        return false;
//    }
//}
//
//function modules_stream(modules_dir) {
//    const modules = [];
//
//    each (fs.readdirSync(modules_dir), function(name) {
//        const module_dir = path.join(modules_dir, name);
//
//        if (!fs.statSync(module_dir).isDirectory())
//            return;
//
//        let queue = streamqueue({ objectMode: true });
//
//        queue.queue(gulp.src([
//            path.join('./sources/open-code__mod.js'),
//            path.join(module_dir, 'main.js'),
//            path.join(module_dir, '*.js')
//        ]));
//
//        let sub_modules_dir = path.join(module_dir, 'submodules');
//
//        if (is_dirSync(sub_modules_dir)) {
//            queue.queue(sub_modules_stream(sub_modules_dir));
//        }
//
//        queue.queue(gulp.src([
//            path.join('./sources/close-code__mod.js')
//        ]));
//
//        let module = queue.done().pipe(concat(name + '.js'))
//
//        modules.push(module);
//
//    });
//
//    return es.merge(modules);
//}
//
//function sub_modules_stream (sub_modules_dir) {
//    const submodules = [];
//
//    each (fs.readdirSync(sub_modules_dir), function(name) {
//        const submodule_dir = path.join(sub_modules_dir, name);
//
//        if (!is_dirSync(submodule_dir))
//            return;
//
//        let queue = streamqueue({ objectMode: true });
//
//        queue.queue(gulp.src([
//            path.join('./sources/open-code__submod.js'),
//            path.join(submodule_dir, 'main.js'),
//            path.join(submodule_dir, '*.js'),
//            path.join('./sources/close-code__submod.js')
//        ]));
//
//        let submodule = queue.done().pipe(concat(name + '.js'))
//        submodules.push(submodule);
//
//    });
//
//    return es.merge(submodules);
//
//}

//gulp.task('watch__scripts', function() {
//    gulp.watch([paths.parts, './sources/**/*.js'], ['scripts']);
//});
