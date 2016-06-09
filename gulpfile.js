'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var footer = require('gulp-footer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var rename = require('gulp-rename');
var merge = require('merge2');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var streamqueue  = require('streamqueue');
var zip = require('gulp-zip');

var DEST = 'src/assets/';
var scriptSrc = 'dev/js/';
var scriptsGlob = 'dev/**/*.js';
var sassGlob = 'dev/sass/**/*.scss';
var cssGlob = 'dev/css/**/*.css';

gulp.task('styles', function () {
    return merge(
        gulp.src(cssGlob),
        gulp.src(sassGlob)
            .pipe(sass().on('error', sass.logError))
        )
        .pipe(cached('styles'))
        .pipe(remember('styles')) 
        .pipe(concat('app.css'))
        .pipe(cleanCSS())
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(DEST));
});

gulp.task('scripts', function () {
    // make sure the scripts get put into the correct order
    return streamqueue({ objectMode: true },
        gulp.src(scriptSrc + 'jquery.fitvids.js'),
        gulp.src(scriptSrc + 'prism.js'),
        gulp.src(scriptSrc + 'reading-time.js'),
        gulp.src(scriptSrc + 'scroller.js'),
        gulp.src(scriptSrc + 'cerkit-app.js'),
        gulp.src(scriptSrc + 'startup.js')
    )
    .pipe(cached('scripts'))        // only pass through changed files
    .pipe(jshint())                 // do special things to the changed files...
    .pipe(header('(function () {')) // e.g. jshinting ^^^
    .pipe(footer('})();'))          // and some kind of module wrapping
    .pipe(remember('scripts'))      // add back all files to the stream
    .pipe(concat('app.js'))         // do things that require all files
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(DEST));
});

//Watch tasks
gulp.task('default', function () {
    var scriptWatcher = gulp.watch(scriptsGlob, ['scripts']); // watch the same files in our scripts task
    scriptWatcher.on('change', function (event) {
        if (event.type === 'deleted') {                   // if a file is deleted, forget about it
            delete cached.caches.scripts[event.path];       // gulp-cached remove api
            remember.forget('scripts', event.path);         // gulp-remember remove api
        }
    });

    var styleWatcher = gulp.watch([sassGlob, cssGlob], ['styles']); // watch the same files in our scripts task
    scriptWatcher.on('change', function (event) {
        if (event.type === 'deleted') {                   // if a file is deleted, forget about it
            delete cached.caches.styles[event.path];       // gulp-cached remove api
            remember.forget('styles', event.path);         // gulp-remember remove api
        }
    });
    // watch for style changes    
    //gulp.watch([sassGlob, cssGlob], 'styles'); // watch the same files in our styles task
    
 
});

gulp.task('build', function (){
    return gulp.src('src/*')
		.pipe(zip('archive.zip'))
		.pipe(gulp.dest('dist'));
});