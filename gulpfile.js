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

var paths = {
    'angular': [
        './bower_components/angular/angular.min.js',
        './bower_components/angular/angular.min.js.map'
    ],
    'set': [
        './scripts/kenzo-set.js'
    ],
    'core': [
        './scripts/core/defaults.js',
        './scripts/core/base.js',
        './scripts/core/*.js',
        './scripts/core/modules/*/main.js',
        './scripts/core/modules/*/*.js'
    ]
};

gulp.task('scripts', function(){
    var angular = gulp
        .src(paths.angular)
        .pipe(gulp.dest('build/scripts'));

    var set = gulp
        .src(paths.set)
        .pipe(gulp.dest('build/scripts'));

    var core = gulp
        .src(paths.core)
        //.pipe(sourcemaps.init())
        .pipe(concat('core.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify().on("error", gutil.log))
        //.pipe(sourcemaps.write('../scripts/'))
        .pipe(gulp.dest('build/scripts'));

    return es.merge(angular, set, core);
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
