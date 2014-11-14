var gulp = require('gulp'),
    gutil = require('gulp-util'),
    es = require('event-stream'),
    del = require('del'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    sourcemaps = require('gulp-sourcemaps');


gulp.task('static', function(){
    return gulp.src('./static/**/*.*')
        .pipe(gulp.dest('build'))
});

var scripts_paths = [
    './scripts/kenzo-set.js',
    './scripts/base.js',
    './scripts/*.js',
    './scripts/modules/*/main.js',
    './scripts/modules/*/*.js',
    './scripts/init.js'];


gulp.task('scripts', function(){
    var angular = gulp.src([
        './bower_components/angular/angular.min.js',
        './bower_components/angular/angular.min.js.map'
    ])
        .pipe(gulp.dest('build/scripts'));

    var background = gulp.src([
        './scripts/kenzo-set.js',
        './scripts/background/base.js',
        './scripts/background/*.js'
    ])
        .pipe(concat('background.js'))
        .pipe(gulp.dest('build/scripts'));

    var defaults = gulp.src([
        './scripts/defaults.js'
    ])
        .pipe(gulp.dest('build/scripts'));

    var scripts = gulp.src(scripts_paths)
        //.pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify().on("error", gutil.log))
        //.pipe(sourcemaps.write('../scripts/'))
        .pipe(gulp.dest('build/scripts'));

    return es.merge(angular, defaults, background, scripts)
});

gulp.task('watch', function(){
    gulp.watch(['./static/**/*.*'], ['static']);
    gulp.watch('./scripts/**/*.js', ['scripts']);
});

gulp.task('clean', function(callback){
    del(['build'], callback);
});

gulp.task('build', ['static', 'scripts']);
gulp.task('default', ['build', 'watch']);
