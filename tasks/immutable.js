'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const info = require('./../package.json');

const replace = require('gulp-replace');

const base = './sources/immutable/';
const glob_text = [
    '**/*.html',
    '**/*.css',
    '**/*.js',
    '**/*.json',
    '**/*.html'
].map(item => base + item);

const glob_rest = glob_text.map(item => '!' + item);
glob_rest.push(base + '**/*.*');

gulp.task(task_name + ':text', () => gulp
    .src(glob_text)
    .pipe(replace(/::version::/g, info.version))
    .pipe(gulp.dest('build'))
);

gulp.task(task_name + ':rest', () => gulp
    .src(glob_rest)
    .pipe(gulp.dest('build'))
);

gulp.task(task_name, gulp.parallel(
    task_name + ':text',
    task_name + ':rest'
));

gulp.task('watch:' + task_name, () => gulp
    .watch([base + '**/*.*'], [task_name])
);

gulp.task('watch:' + task_name, () => gulp.watch([
    base + '**/*.*'
], gulp.task(task_name)));
