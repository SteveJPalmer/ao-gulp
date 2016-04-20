/* AudioOrange.com */
/* ao prjs gulpfile.js */

/*  task overview
    ====+========
    build       - (default) clears, minifies js & cs, concatinates css
    serialisation v3:run-sequence, v4:series() method
    uglify      - minify javascript files
    mincss      - minify css files
    ---------
    less        - compiles less files
    cssprefix   - add vendor prefixes to css
    watch       - fires less compilation task
    lessreload  - compiles less files & livereload browser
    watchreload - fires less compilation task & starts livereload server
    ---------
    clean       - cleans up previous build files/folders
    concat      - concat & rename files
    rename      - rename files                                     */

var gulp   = require('gulp'),
    uglify = require('gulp-uglify'),              //minify js
    cssmin = require('gulp-cssmin'),              //minify css
    less   = require('gulp-less'),                //compile css
    gulpprefixer = require('gulp-autoprefixer'),  //add vendor prefixes
    autoprefixer = require('autoprefixer'),       //underlying prefix module (used by gulp-autoprefixer)
    //utils
    rename = require('gulp-rename'),              //rename piped file
    concat = require('gulp-concat'),              //concatenate src files
    del = require('del'),                         //remove files/dirs (rm -rf)
    runSequence = require('run-sequence'),        //run tasks in series
    //browser
    livereload = require('gulp-livereload');      //browser live reloading

//======================================================================
/* default task - run with $gulp */
// dependencies in array - watch multiple run in parallel (until v4) */
gulp.task('default', ['build']);

/* main build task - runs multiple tasks in series */
gulp.task('build', function () {
  //runs tasks in series
  //ensure tasks return a stream - add return gulp.src();
  runSequence('clean', ['uglify', 'mincss'], 'concat');    //can add array to introduce parallel
});

//gulp v4 - gulp.series() & gulp.parallel() available
/*
 gulp.task('build', gulp.series('clean','uglify','mincss','concat', function(done) {
 console.log('gulp v4 series build...')
 done();
 }));
 */


//======================================================================
/* task - minify js file */
gulp.task('uglify', function () {
  console.log('running minify task');

  return gulp.src('lib/DBServices.js')
    .pipe(uglify())
    .pipe(gulp.dest('build/js'));
});


/* task - minify css file */
gulp.task('mincss', function () {
  return gulp.src('css/style.css')
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('build/css'));
});


/* task - concat & rename examples */
//concat & rename (via string)
gulp.task('concat', function () {
  return gulp.src(['build/css/style.min.css', 'css/style.css'])
    .pipe(concat('concat.css'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename('all.css'))		        //rename via string or object components
    .pipe(gulp.dest('build/css'));
});

//alternative rename - via object components (good for adding prefix/suffix)
gulp.task('rename', function () {
  gulp.src('build/css/all.css')
    .pipe(rename({
      dirname: "dist",
      basename: "CSSFile",
      prefix: "prod-",
      suffix: "-min",
      extname: ".css"
    }))
    .pipe(gulp.dest('build/css'));
});


/* task clean (npm helper module) */
gulp.task('clean', function () {
  //deletes array of files or folders
  return del(['build/css/dist/*.css', 'build/css/*.css', 'build/css']);    // rm -rf
});


//======================================================================
// css magic - compilers & vendor prefixes
//======================================================================
/* task - less compiler */
gulp.task('less', function () {
  gulp.src('css/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'));
});

/* task - watch & compile less files */
gulp.task('watch', function () {
  //files to watch, followed by what task to run
  gulp.watch('css/*.less', ['less']);
});

/* task - vendor prefixes */
gulp.task('cssprefix', function () {
  gulp.src('css/prefix-animations.css')
    .pipe(gulpprefixer({
      browsers: ['> 1%']
      // browsers: ['last 4 version', 'safari 5','ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
    }))
    .pipe(gulp.dest('build/css'));

  //check which browsers selected & which properties will be prefixed:
  var info = autoprefixer({
    browsers: ['> 1%']
    // browsers: ['last 4 version', 'safari 5','ie 7', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']
  }).info();
  console.log(info);
});


//======================================================================
// browser - live reloading
//======================================================================
/* task - less compiler with livereload */
gulp.task('lessreload', function() {
  gulp.src('css/*.less')
    .pipe(less())
    .pipe(gulp.dest('css'))
    .pipe(livereload());
});

/* task - start livereload server */
gulp.task('watchreload', function() {
  //start livereload server
  livereload.listen();        //can pass option obj for host, port, page
  //files to watch, followed by what task to run
  gulp.watch('css/*.less', ['lessreload']);
});

