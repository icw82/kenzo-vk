'use strict';
const gulp = require('gulp');

const paths = [
    'angular/angular.min.js',
    'angular/angular.min.js.map',
    'angular-sanitize/angular-sanitize.min.js',
    'angular-sanitize/angular-sanitize.min.js.map',
    'kk/kk.min.js',
    'kk/kk.min.js.map',
    'blueimp-md5/js/md5.min.js',
    'he/he.js'
].map(item => './bower_components/' + item);

gulp.task('scripts_parts', () => gulp
    .src(paths)
    .pipe(gulp.dest('build/scripts'))
);

gulp.task('watch__scripts_parts', () => gulp.watch(paths, ['scripts_parts']));
