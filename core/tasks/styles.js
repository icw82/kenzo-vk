var gulp = require('gulp');

var es = require('event-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');

var globs = {
    reset: './bower_components/kk/kk-reset.css',
    common: ['./sources/base/styles.css', './sources/modules/**/styles.css'],
    mode_2006: ['./sources/base/styles.2006.css', './sources/modules/**/styles.2006.css'],
    mode_2016: ['./sources/base/styles.2016.css', './sources/modules/**/styles.2016.css']
}

gulp.task('styles', function() {
    var reset = gulp
        .src(globs.reset);

    var styles = gulp
        .src(globs.common)
        .pipe(concat('styles.css'));

    return es.merge(reset, styles)
        .pipe(gulp.dest('build/styles'));
});

gulp.task('styles.2006', function() {
    return gulp
        .src(globs.mode_2006)
        .pipe(concat('styles.2006.css'))
        .pipe(gulp.dest('build/styles'));
});

gulp.task('styles.2016', function() {
    return gulp
        .src(globs.mode_2016)
        .pipe(concat('styles.2016.css'))
        .pipe(gulp.dest('build/styles'));
});

gulp.task('watch__styles', function() {
    gulp.watch(
        [globs.reset, globs.common, globs.mode_2006, globs.mode_2016],
        ['styles', 'styles.2006', 'styles.2016']
    );
});
