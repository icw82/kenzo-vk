'use strict';
const gulp = require('gulp');
const concat = require('gulp-concat');
const insert = require('gulp-insert');

const paths = [
    'main.js',
    'utils/*.js',
    'events/*.js',
    'storage/*.js',
    'classes/*.js'
].map(item => './sources/core/' + item);

gulp.task('scripts_core', () => gulp
    .src(paths)
    .pipe(concat('core.js'))
    .pipe(insert.wrap(
        'const core = (kk => {\n\nconst each = kk.each;\n\n',
        '\nreturn core;\n})(kk);\n\ncore.init();\n'))
    .pipe(gulp.dest('build/scripts'))
);

gulp.task('watch__scripts_core', () => gulp.watch(paths, ['scripts_core']));
