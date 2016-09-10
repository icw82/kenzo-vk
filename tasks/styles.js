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

    for (let mode of ['', '.2016', '.m']) {
        let list = [
            'styles',
            'modules/*/styles',
            'modules/*/submodules/*/styles'
        ];

        streams.push(gulp
            .src(list.map(item => './sources/ext/' + item + mode + '.css'))
            .pipe(concat('ext' + mode + '.css'))
        );
    }

    return es.merge.apply(this, streams)
        .pipe(gulp.dest('build/styles'));
});

gulp.task('watch__styles', () => gulp.watch([
    './sources/ext/*.css',
    './sources/ext/**/*.css'
], ['styles']));

