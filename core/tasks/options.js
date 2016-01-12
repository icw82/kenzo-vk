var gulp = require('gulp');
var gutil = require('gulp-util');
var swig = require('gulp-swig');

var es = require('event-stream');
var rename = require('gulp-rename');

gulp.task('options', function() {
    var templates = gulp
        .src('./sources/options/index.html')
        .pipe(swig().on('error', gutil.log))

    var styles = gulp
        .src('./sources/options/*.css')

    var scripts = gulp
        .src('./sources/options/*.js')

    return es.merge(templates, styles, scripts)
        .pipe(gulp.dest('build/options'));
});

gulp.task('watch__options', function() {
    gulp.watch(['./sources/options/*.*'], ['options']);
});
