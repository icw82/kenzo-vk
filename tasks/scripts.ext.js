'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat');
const insert = require('gulp-insert');

const paths = [
    'main.js'
].map(item => './sources/ext/' + item);

gulp.task('scripts_ext', () => gulp
    .src(paths)
    .pipe(concat('ext.js'))
    .pipe(insert.wrap(
        'const ext = ((kk, core) => {\n\nconst each = kk.each;\n\n',
        '\nreturn ext;\n})(kk, core);\n\next.init();\n'))
    .pipe(gulp.dest('build/scripts'))
);

gulp.task('watch__scripts_ext', () => gulp.watch(paths, ['scripts_ext']));
