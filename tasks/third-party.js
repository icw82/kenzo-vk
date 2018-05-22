'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
const info = require('./../package.json');

const paths_to_scripts = [
    'angular/angular.min.js',
//    'angular/angular.min.js.map',
//    'angular-sanitize/angular-sanitize.min.js',
//    'angular-sanitize/angular-sanitize.min.js.map',
    'kenzo-kit/kk.min.js',
    'blueimp-md5/js/md5.min.js',
//    'blueimp-md5/js/md5.min.js.map',
    'he/he.js'
].map(item => './node_modules/' + item);

gulp.task(task_name + ':scripts', () => gulp
    .src(paths_to_scripts)//, { allowEmpty: true}
    .pipe(gulp.dest('build/scripts'))
);

gulp.task(task_name, gulp.parallel(
    task_name + ':scripts'
));
