'use strict';

var args = require('yargs').argv;
var gulp = require('gulp');
var sass = require('gulp-sass');
var header = require('gulp-header');
var footer = require('gulp-footer');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var cached = require('gulp-cached');
var remember = require('gulp-remember');
var rename = require('gulp-rename');
var merge = require('merge2');
var cleanCSS = require('gulp-clean-css');
var streamqueue = require('streamqueue');
var zip = require('gulp-zip');
var bump = require('gulp-bump');
var size = require('gulp-size');

// deploy
var $ = require('gulp-load-plugins')();
var changelog = require('conventional-changelog');
var exec = require('child_process').exec;
var fs = require('fs');
var pkg = require('./package.json');
var semver = require('semver');
var util = require('gulp-util');
var git = require('gulp-git');
var DEST = 'src/assets/';
var CSS_DEST = DEST + 'css/';
var JS_DEST = DEST + 'js/'
var scriptSrc = './dev/js/';
var scriptsGlob = 'dev/**/*.js';
var sassGlob = 'dev/sass/**/*.scss';
var cssGlob = 'dev/css/**/*.css';
var customSassGlob = 'dev/custom/**/*.scss';
var customCssGlob = 'dev/custom/**/*.css';

var buildTasks = ['customStyles', 'scripts'];
var finalBuildTasks = ['customStyles', 'scripts'];


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
    .pipe(gulp.dest(CSS_DEST));
});


gulp.task('customStyles', ['styles'], function () {
  return merge(
    gulp.src(customCssGlob),
    gulp.src(customSassGlob)
      .pipe(sass().on('error', sass.logError))
  )
    .pipe(cached('customStyles'))
    .pipe(remember('customStyles'))
    .pipe(concat('custom.css'))
    .pipe(cleanCSS())
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(CSS_DEST));
});

gulp.task('scripts', function () {
  // make sure the scripts get put into the correct order

  return streamqueue({ objectMode: true },
    gulp.src(scriptSrc + 'bootstrap.js'),
    gulp.src(scriptSrc + 'jquery.fitvids.js'),
    gulp.src(scriptSrc + 'prism.js'),
    gulp.src(scriptSrc + 'reading-time.js'),
    gulp.src(scriptSrc + 'cerkit-app.js'),
    gulp.src(scriptSrc + 'scroller.js'),
    gulp.src(scriptSrc + 'startup.js')
  )
    //return gulp.src(scriptsGlob)
    .pipe(cached('scripts'))        // only pass through changed files
    .pipe(jshint())                 // do special things to the changed files...
    .pipe(jshint.reporter(stylish))
    .pipe(remember('scripts'))      // add back all files to the stream
    .pipe(concat('app.js'))         // do things that require all files
    .pipe(uglify({ mangle: false, compress: false }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(JS_DEST));
});

//Watch tasks
gulp.task('watch', function () {
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

  var customStyleWatcher = gulp.watch([customSassGlob, customCssGlob], ['customStyles']); // watch the same files in our scripts task
  scriptWatcher.on('change', function (event) {
    if (event.type === 'deleted') {                   // if a file is deleted, forget about it
      delete cached.caches.styles[event.path];       // gulp-cached remove api
      remember.forget('styles', event.path);         // gulp-remember remove api
    }
  });
});

var updateFileVersion = function () {
  var versionArray = pkg.version.split('.');
  var minorVersion = versionArray[versionArray.length - 1];

};

gulp.task('default', ['watch']);

var getPackageJson = function () {
  return JSON.parse(fs.readFileSync('./package.json', 'utf8'));
};


/*****************************************************************************************
 * Standalone zip
 */
gulp.task('zip', buildTasks, function (done) {
  var fileName = $.util.env.name;
  if (!fileName) return done('--name is required (without .zip extension)');

  var zipFilename = fileName + '.zip';
  return gulp.src('src/**/*.*')
    .pipe(zip(zipFilename))
    .pipe(gulp.dest('dist'));
});

/*****************************************************************************************
 * Deploy
 */

var paths = gulp.paths;
var tagTypes = {
  patch: 'patch',
  feature: 'minor',
  release: 'major'
};
var version;


gulp.task('deploy:init', finalBuildTasks, function (done) {
  var tagType = tagTypes[$.util.env.tag];
  version = semver.inc(pkg.version, tagType);

  if (!$.util.env.tag) return done('--tag is required');
  if (!tagType) return done('--tag must be patch, feature or release');
  //if ($.util.env.f) return git.exec({ args: 'stash' });
  done();
});

gulp.task('deploy:zip', ['deploy:init'], function () {
  var zipFilename = 'ghost-cerkit-theme-distro.zip';
  return gulp.src('src/**/*.*')
    .pipe(zip(zipFilename))
    .pipe(gulp.dest('dist'));
});

/*
gulp.task('changelog', ['deploy:zip'] , function (done) {
  changelog({
    repository: pkg.repository.url.replace('git://', 'https://')
      .replace('.git', ''),
    version: version,
    file: 'CHANGELOG.md'
  }, function (err, log) {
    fs.writeFileSync('./CHANGELOG.md', log);
    done();
  });
});
*/

gulp.task('bump', function (done) {
  return gulp.src(['./package.json'])
    .pipe($.bump({ version: version }))
    .pipe(gulp.dest('./'))
    .pipe(size({ title: '/', showFiles: true }));
});

/*****************************************************************************************
 * Bump the Ghost theme package.json
 *
 */
gulp.task('bump-ghost-package', function (done) {
  return gulp.src(['./dev/package.json'])
    .pipe($.bump({ version: version }))
    .pipe(gulp.dest('./dev'))
    .pipe(gulp.dest('./src'))
    .pipe(size({ title: '/', showFiles: true }));
});


gulp.task('deploy:commit', ['deploy:init', 'bump', 'bump-ghost-package'], function () {
  return gulp.src(['./package.json', './dev/package.json', './src/package.json', './CHANGELOG.md', DEST + '**/*.*'])
    .pipe(git.add())
    .pipe(git.commit('release: version ' + version))
    .pipe(size({ title: '/', showFiles: true }));
});


gulp.task('deploy:tag', ['deploy:check-status'], function (done) {
  git.tag('v' + version, 'release: version ' + version, done);
});

gulp.task('deploy:check-status', ['deploy:commit'], function(don) {
  exec('git status -s', function (err, stdout, stderr) {
    if (err) return done(err);
    if (stdout.length) return done('Repository does not have a clean status');
    done();
  });
});

gulp.task('deploy:push', ['deploy:tag', 'deploy:zip'], function (done) {
  exec('git po', function (err, stdout, stderr) {
    if (err) return done(err);
    if(stdout) return done(stdout);
    //if (stdout.length) return done('Pushed to origin using current branch.');
    done();
  });

  //git.push('origin', 'master', { args: '--tags' }, done);
});

/*
gulp.task('deploy', ['deploy:init', 'bump', 'bump-ghost-package', 'deploy:commit', 'deploy:check-status', 'deploy:zip',
  'deploy:tag', 'deploy:push']);
*/

gulp.task('deploy', ['deploy:push']);
