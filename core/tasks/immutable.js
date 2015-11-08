var gulp = require('gulp');

gulp.task('immutable', function() {
    return gulp
        .src('./immutable/**/*.*')
        .pipe(gulp.dest('build'))
});

gulp.task('watch__immutable', function() {
    gulp.watch(['./immutable/**/*.*'], ['immutable']);
});
