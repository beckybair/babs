// Gulpfile

var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var header      = require('gulp-header');
var cleanCSS    = require('gulp-clean-css');
var rename      = require("gulp-rename");
var uglify      = require('gulp-uglify');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("app/scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("app/css"))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('watch', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/scss/*.scss", ['sass']);
    gulp.watch('app/css/*.css', ['minify-css']);
    gulp.watch('app/js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
});

// Minify compiled CSS
gulp.task('minify-css', ['sass'], function() {
    return gulp.src('app/css/app.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Minify JS
gulp.task('minify-js', function() {
    return gulp.src('app/js/app.js')
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('app/js'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

// Copy vendor libraries from /node_modules into /vendor
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
        .pipe(gulp.dest('app/lib/bootstrap'));

    gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
        .pipe(gulp.dest('app/lib/jquery'));

    gulp.src(['node_modules/tether/dist/js/tether.js', 'node_modules/tether/dist/js/tether.min.js'])
        .pipe(gulp.dest('app/lib/tether'));

    gulp.src([
            'node_modules/font-awesome/**',
            '!node_modules/font-awesome/**/*.map',
            '!node_modules/font-awesome/.npmignore',
            '!node_modules/font-awesome/*.txt',
            '!node_modules/font-awesome/*.md',
            '!node_modules/font-awesome/*.json'
        ])
        .pipe(gulp.dest('app/lib/font-awesome'));
});

// Run everything
gulp.task('default', ['watch', 'sass', 'minify-css', 'minify-js', 'copy']);
