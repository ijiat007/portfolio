var gulp = require('gulp');

var watch = require('gulp-watch');
var concat = require('gulp-concat');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');

var scssOptions = { 
    outputStyle : "compressed",
    // outputStyle : "expanded",
    sourceComments: true };
gulp.task('scss', function() {
    gulp.src('css/scss/ipark.scss')
    .pipe( sourcemaps.init() )
    .pipe( scss(scssOptions).on('error', scss.logError) )
    .pipe( autoprefixer('last 2 version', 'safari 5', 'ios 6', 'android 4') )
    // .pipe( autoprefixer({ browsers: ["> 0%"] }) )
    .pipe ( concat('ipark.css') )
    .pipe( sourcemaps.write('scss/map') )
    .pipe( gulp.dest('css') );
});

gulp.task('watch', function () {
    gulp.watch('css/scss/*', ['scss']);
});

gulp.task('default', ['watch']);

