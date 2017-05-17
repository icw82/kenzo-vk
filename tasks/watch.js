'use strict';

const gulp = require('gulp');
const path = require('path');
const task_name = path.basename(__filename, '.js');

gulp.task(task_name, done => {
    const tasks = gulp
        .tree().nodes
        .filter(item => /^watch:.+/.test(item));

    if (tasks.length === 0)
        done();
    else
        gulp.parallel(...tasks)(done);
});
