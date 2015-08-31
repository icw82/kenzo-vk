var gulp = require('gulp');
var es = require('event-stream');
var del = require('del');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
//var gutil = require('gulp-util');
//var uglify = require('gulp-uglify');
//var sourcemaps = require('gulp-sourcemaps');

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
    'sources': [
        './sources/defaults.js',
        './sources/base.js',
        './sources/*.js',
        './sources/modules/*/main.js',
        './sources/modules/*/*.js'
    ]
};

gulp.task('immutable', function(){
    return gulp
        .src('./immutable/**/*.*')
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

    var main = gulp
        .src(paths.sources)
        //.pipe(sourcemaps.init())
        .pipe(concat('main.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(uglify().on("error", gutil.log))
        //.pipe(sourcemaps.write('../scripts/'))

    return es.merge(angular, angular_sanitize, kk, md5, he, main)
        .pipe(gulp.dest('build/scripts'));
});

gulp.task('watch', function(){
    gulp.watch([
        './immutable/**/*.*',
        './sources/**/*'
    ], ['clean', 'immutable', 'scripts', 'styles']);

//    gulp.watch(['./immutable/**/*.*'], ['immutable']);
//    gulp.watch('./sources/**/*', ['scripts', 'styles']);
});


gulp.task('clean', function(callback){
    del.sync([
        'build/**/*'
    ]);

    callback();
});


gulp.task('build', ['immutable', 'scripts', 'styles']);
gulp.task('default', ['clean', 'build', 'watch']);
