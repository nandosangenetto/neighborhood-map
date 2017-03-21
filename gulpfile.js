// Importing the libraries required
const gulp = require('gulp'),
			colors = require('colors'),
			htmlmin = require('gulp-htmlmin'),
			cleanCSS = require('gulp-clean-css'),
			jsonminify = require('gulp-jsonminify'),
			uglify = require('gulp-uglify'),
			connect = require('gulp-connect'),
			concat = require('gulp-concat');

// Config variables
const srcPath = 'src',
			publicPath = 'dist',
			port = 8787;

gulp.task('default', ['serve']);

// Subtask to minify the CSS
gulp.task('minify-css', () => {
	console.log('Minifying CSS'.cyan);
	return gulp.src(srcPath + '/css/*.css')
    .pipe(cleanCSS())
    .pipe(gulp.dest(publicPath + '/css'));
});

// Subtask to minify the JavaScript
gulp.task('minify-js', () => {
	console.log('Minifying JavaScript'.cyan);
	return gulp.src(srcPath + '/js/*.js')
		.pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulp.dest(publicPath + '/js'));
});

// Subtask to minify the HTML
gulp.task('minify-html', () => {
	console.log('Minifying HTML'.cyan);
	return gulp.src(srcPath + '/*.html')
    .pipe(htmlmin({
    	collapseWhitespace: true,
    	minifyJS: true,
    	minifyCSS: true
    }))
    .pipe(gulp.dest(publicPath));
});

// Subtask to minify the JSON
gulp.task('minify-json', () => {
	console.log('Minifying JSON'.cyan);
	return gulp.src(srcPath + '/data/data.json')
    .pipe(jsonminify())
    .pipe(gulp.dest(publicPath + '/data'));
});

// Subtask to run the server
gulp.task('serve', ['minify-css', 'minify-js', 'minify-html', 'minify-json'], () => {
	console.log('Running server'.yellow);
  connect.server({
  	root: publicPath,
    livereload: false,
    port: port
  });
});