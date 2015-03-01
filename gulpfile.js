var gulp = require('gulp');
var mocha = require('gulp-mocha');
 
gulp.task('mocha', function() {
  return gulp.src(['test/*.js'], { read: false })
    .pipe(mocha({ reporter: 'nyan' }))
    .on('error', gutil.log);
});

gulp.task('watch-mocha', function() {
    gulp.watch(['*.js', 'lib/**', 'test/**'], ['mocha']);
});

gulp.task('default', function () {
    return gulp.src('tests/logicalTests.js', {read: false})
        .pipe(mocha({reporter: 'nyan'}));
});
