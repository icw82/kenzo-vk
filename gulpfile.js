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

gulp.task('scripts', function(){
    var angular = gulp.src([
        './bower_components/angular/angular.min.js',
        './bower_components/angular/angular.min.js.map'
    ])
        .pipe(gulp.dest('build/scripts'));

    var defaults = gulp.src([
        './scripts/defaults.js'
    ])
        .pipe(gulp.dest('build/scripts'));

    var paths = [
        './scripts/kenzo-set.js',
        './scripts/kenzo-get-buffer.js',
        './scripts/*.js'
    ];

    var scripts = gulp.src(paths)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        //.pipe(gulp.dest(paths.build.abs.scripts))
        //.pipe(sourcemaps.init())
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify().on("error", gutil.log))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest('build/scripts'));

    return es.merge(angular, defaults, scripts)
});

gulp.task('watch', function(){
    gulp.watch(['./static/**/*.*'], ['static']);
    gulp.watch(['./scripts/*.js'], ['scripts']);
});

gulp.task('clean', function(callback){
    del(['build'], callback);
});

gulp.task('build', ['static', 'scripts']);
gulp.task('default', ['build', 'watch']);
