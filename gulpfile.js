var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync').create();

// ----------------------------------
// Task
// ----------------------------------

// Sass compilor
gulp.task('sass', function () {
  return gulp.src('app/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('app/css/'))
    .pipe(browserSync.stream());
});

// Static server (BrowserSync)
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "app"
        }
    });
});


// ----------------------------------
// Watch
// ----------------------------------
gulp.task('watch', function () {
  gulp.watch('app/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/js/**/*.js', browserSync.reload);
});



// ----------------------------------
// Default task
// ----------------------------------
gulp.task('default', ['sass', 'browser-sync', 'watch']);