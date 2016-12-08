require('require-dir')('./tasks');

const gulp = require('gulp');

const observers = [];
for (var key in gulp.tasks) {
    if (key.indexOf('watch__') === 0);
        observers.push(key);
}

gulp.task('watch', observers);
gulp.task('scripts', ['scripts_parts', 'scripts_core', 'scripts_ext']);
gulp.task('build', ['immutable', 'scripts', 'styles']);
gulp.task('default', ['clean', 'build', 'watch']);
