var gulp = require('gulp');
var del = require('del');

gulp.task('clean', function(callback) {
    del.sync([
        'build/**/*'
    ]);

    callback();
});

//gulp.task('watch__clean', function() {
//    gulp.watch(['…'], ['clean']);
//});
