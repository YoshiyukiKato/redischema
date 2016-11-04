const gulp = require("gulp");
const babel = require("gulp-babel");

gulp.task('babel', function() {
  gulp.src('./src/**/*.js', )
    .pipe(babel())
    .pipe(gulp.dest('./dest'))
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['babel'])
});

gulp.task('default', ['babel', 'watch']);