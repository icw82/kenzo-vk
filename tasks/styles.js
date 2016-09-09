'use strict';
const gulp = require('gulp');
const es = require('event-stream');
const concat = require('gulp-concat');
//const join = require('path').join;

gulp.task('styles', () => {
    const streams = [];

    streams.push(
        gulp.src('./bower_components/kk/kk-reset.css')
    );

    streams.push(
        gulp.src([
            'styles.css',
            'modules/*/styles.css',
            'modules/*/submodules/*/styles.css'].map(item => './sources/ext/' + item))
        .pipe(concat('ext.css'))
    );

    return es.merge.apply(this, streams)
        .pipe(gulp.dest('build/styles'));
});

gulp.task('watch__styles', () => gulp.watch([
    './sources/ext/*.css',
    './sources/ext/**/*.css'
], ['styles']));

