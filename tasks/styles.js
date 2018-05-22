'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');
//const info = require('./../package.json');

const streamqueue = require('streamqueue');
//const insert = require('gulp-insert');
const concat = require('gulp-concat');
const strip = require('gulp-strip-comments');
//const csso = require('gulp-csso');
//const rename = require('gulp-rename');
//const replace = require('gulp-replace');

const ext = '.css';
const glob = [
    'styles',
    'modules/*/styles',
    'modules/*/submodules/*/styles'
].map(item => './sources/ext/' + item);

const task = (() => {
    const subtasks = [];

    {
        const subtask_name = task_name + ':reset';
        subtasks.push(subtask_name);

        gulp.task(subtask_name, () => gulp
            .src('./node_modules/kenzo-kit/kk-reset.css')
            .pipe(gulp.dest('build/styles'))
        );
    }

    const modes = [{
        name: 'common',
        postfix: ''
    }, {
        name: '2016',
        postfix: '.2016'
    }, {
        name: 'mobile',
        postfix: '.m'
    }];

    for (let mode of modes) {
        const subtask_name = task_name + ':' + mode.name;
        subtasks.push(subtask_name);

        gulp.task(subtask_name, () => gulp
            .src(
                glob.map(item => item + mode.postfix + ext),
                { allowEmpty: true }
            )
            .pipe(concat('ext' + mode.postfix + '.css'))
            .pipe(strip.text())
            .pipe(gulp.dest('build/styles'))
        );
    }

    return gulp.parallel(...subtasks);
})();

gulp.task(task_name, task);

gulp.task('watch:' + task_name, () => gulp.watch([
    './sources/ext/*' + ext,
    './sources/ext/**/*' + ext
], gulp.task(task_name)));
