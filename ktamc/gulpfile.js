var gulp = require('gulp');

var watch = require('gulp-watch');
var concat = require('gulp-concat');
var scss = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var spritesmith = require('gulp.spritesmith');
var imagemin = require('gulp-imagemin');

gulp.task('spimg', function() {
    var spriteData = gulp.src('img/sp/*.png')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}]
    }))
    .pipe(spritesmith({
        imgName: 'sp.png',
        imgPath: '../img/sp.png',
        padding: 4,
        cssName: 'sp.scss'
    }));
    spriteData.img.pipe( gulp.dest('img') );
    return spriteData.css.pipe( gulp.dest('css/scss') );
});

var scssOptions = { 
    outputStyle : "compressed",
    // outputStyle : "expanded",
    sourceComments: true };
gulp.task('scss', function() {
    return gulp.src('css/scss/ktamc.scss')
    .pipe( sourcemaps.init() )
    .pipe( scss(scssOptions).on('error', scss.logError) )
    .pipe( autoprefixer('last 2 version', 'safari 5', 'ie 9', 'ios 6', 'android 4') )
    // .pipe( autoprefixer({ browsers: ["> 0%"] }) )
    .pipe ( concat('ktamc.css') )
    .pipe( sourcemaps.write('./scss/map') )
    .pipe( gulp.dest('css') );
});

gulp.task('watch', function() {
    gulp.watch('css/scss/*', ['scss']);
    gulp.watch('img/sp/*.png', ['spimg']);
});

gulp.task('default', ['watch']);