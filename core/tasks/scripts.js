var gulp = require('gulp');

var es = require('event-stream');
var fs = require('fs');
var path = require('path');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var kk = require('../../core/kk-node.js');
var each = kk.each;

var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var streamqueue = require('streamqueue');

var streams = [];
var modules_path = './sources/modules/';
var parts_path = [
    './bower_components/angular/angular.min.js',
    './bower_components/angular/angular.min.js.map',
    './bower_components/angular-sanitize/angular-sanitize.min.js',
    './bower_components/angular-sanitize/angular-sanitize.min.js.map',
    './bower_components/kk/kk.min.js',
    './bower_components/kk/kk.min.js.map',
    './bower_components/blueimp-md5/js/md5.min.js',
    './bower_components/he/he.js']

gulp.task('scripts', function() {
    var parts = gulp.src(parts_path);

    var base = gulp.src([
        './sources/base/main.js',
        './sources/base/*.js',
        './sources/close-code__base.js'
    ])
        .pipe(concat('base.js'));

    var modules = [];

    each (fs.readdirSync(modules_path), function(item) {
        if (item === 'base') return;
        var item_path = path.join(modules_path, item);
        if (fs.statSync(item_path).isDirectory()) {
            modules.push(gulp
                .src([
                    path.join('./sources/open-code__mod.js'),
                    path.join(item_path, 'main.js'),
                    path.join(item_path, '*.js'),
                    path.join('./sources/close-code__mod.js')
                ])
                .pipe(concat(item + '.js'))
            );
        }
    });

    var all_modules = es.merge(modules);

    var init = gulp
        .src(['./sources/init.js']);


    streamqueue({ objectMode: true },
        gulp.src('foo/*'),
        gulp.src('bar/*')
    )


    var sources = streamqueue({ objectMode: true });
    sources.queue(base);
    sources.queue(all_modules);
    sources.queue(init);

    var sources = sources.done()
        .pipe(concat('ext.js'))
//        .pipe(sourcemaps.init())
//        .pipe(uglify().on("error", gutil.log)) // У uglify пока нет поддержки ES6.
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('../scripts/'))


    return es.merge(parts, sources)
        .pipe(gulp.dest('build/scripts'));
});



gulp.task('watch__scripts', function() {
    gulp.watch([parts_path, './sources/**/*.js'], ['scripts']);
});
