var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var sassFiles = './assets/admin/pages/scss/**/*.scss',  
    cssDest = './assets/admin/pages/css/';

gulp.task('default', ['serve']);

gulp.task('serve', [], function () {
    browserSync({
        notify: false,
        server: {
            baseDir: '.'
        }
    });
    gulp.watch(['views/**/*.html'], reload);
    gulp.watch(['app/controllers/**/*.js'], reload);
    gulp.watch(['app/services/**/*.js'], reload);
});

gulp.task('styles', function() {
    gulp.src(sassFiles)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(cssDest))
});

//Watch task
gulp.task('watch',function() {  
    gulp.watch(sassFiles,['styles']);
});