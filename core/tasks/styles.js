var gulp = require('gulp');

var es = require('event-stream');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');

var globs = {
    reset: './bower_components/kenzo-kit/kk-reset.css',
    sources: './sources/**/*.css'
}

gulp.task('styles', function() {
    var reset = gulp
        .src(globs.reset);

    var styles = gulp
        .src(globs.sources)
        .pipe(concat('styles.css'));

    return es.merge(reset, styles)
        .pipe(gulp.dest('build/styles'));
});

gulp.task('watch__styles', function() {
    gulp.watch([globs.reset, globs.sources], ['styles']);
});
