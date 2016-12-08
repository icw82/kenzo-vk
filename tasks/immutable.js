const gulp = require('gulp');
const glob = './sources/immutable/**/*.*';

gulp.task('immutable', () => gulp
    .src(glob)
    .pipe(gulp.dest('build'))
);

gulp.task('watch__immutable', () => gulp
    .watch(glob, ['immutable'])
);
