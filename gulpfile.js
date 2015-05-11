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
    'angular_sanitize': [
        './bower_components/angular-sanitize/angular-sanitize.min.js',
        './bower_components/angular-sanitize/angular-sanitize.min.js.map'
    ],
    'kk': [
        './bower_components/kenzo-kit/kk.js'
    ],
    'md5': [
        './bower_components/blueimp-md5/js/md5.min.js'
    ],
    'he': [
        './bower_components/he/he.js'
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

    var angular_sanitize = gulp
        .src(paths.angular_sanitize);

    var kk = gulp
        .src(paths.kk);

    var md5 = gulp
        .src(paths.md5);

    var he = gulp
        .src(paths.he);

    var core = gulp
        .src(paths.core)
        //.pipe(sourcemaps.init())
        .pipe(concat('core.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify().on("error", gutil.log))
        //.pipe(sourcemaps.write('../scripts/'))

    return es.merge(angular, angular_sanitize, kk, md5, he, core)
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('watch', function(){
    gulp.watch([
        './static/**/*.*',
        './sources/**/*'
    ], ['clean', 'static', 'scripts', 'styles']);

//    gulp.watch(['./static/**/*.*'], ['static']);
//    gulp.watch('./sources/**/*', ['scripts', 'styles']);
});


gulp.task('clean', function(callback){
    del.sync([
        'build/**/*'
    ]);

    callback();
});


gulp.task('build', ['static', 'scripts', 'styles']);
gulp.task('default', ['clean', 'build', 'watch']);
