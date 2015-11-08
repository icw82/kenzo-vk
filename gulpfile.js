require('require-dir')('./core/tasks');

var gulp = require('gulp');

var observers = [];
for (var key in gulp.tasks) {
    if (key.indexOf('watch__') === 0);
        observers.push(key);
}

gulp.task('build', ['immutable', 'scripts', 'styles']);
gulp.task('watch', observers);

gulp.task('default', ['clean', 'build', 'watch']);
