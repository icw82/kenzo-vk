var gulp = require('gulp'),
    gutil = require('gulp-util'),
    es = require('event-stream'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    'angular': [
        './bower_components/angular/angular.min.js',
        './bower_components/angular/angular.min.js.map'
    ],
    'kk': [
        './bower_components/kenzo-kit/kk.js'
    ],
    'core': [
        './sources/core/defaults.js',
        './sources/core/base.js',
        './sources/core/*.js',
        './sources/core/modules/*/main.js',
        './sources/core/modules/*/*.js'
    ]
};

gulp.task('static', function(){
    return gulp
        .src('./static/**/*.*')
        .pipe(gulp.dest('build'))
});

gulp.task('styles', function(){
    var reset = gulp
        .src('./bower_components/kenzo-kit/kk-reset.css');

    var styles = gulp
        .src('./sources/**/*.css')
        .pipe(concat('styles.css'));

    return es.merge(reset, styles)
        .pipe(gulp.dest('build/styles'));
});

gulp.task('scripts', function(){
    var angular = gulp
        .src(paths.angular);

    var kk = gulp
        .src(paths.kk);

    var core = gulp
        .src(paths.core)
        //.pipe(sourcemaps.init())
        .pipe(concat('core.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify().on("error", gutil.log))
        //.pipe(sourcemaps.write('../scripts/'))

    return es.merge(angular, kk, core)
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('watch', function(){
    gulp.watch(['./static/**/*.*'], ['static']);
    gulp.watch('./sources/**/*', ['scripts', 'styles']);
});

gulp.task('clean', function(callback){
    del(['build'], callback);
});

gulp.task('build', ['static', 'scripts', 'styles']);
gulp.task('default', ['build', 'watch']);
