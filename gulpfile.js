const gulp = require('gulp'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	clean = require('gulp-clean'),
	browserSync = require('browser-sync').create(),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	concatCss = require('gulp-concat-css'),
	cleanCSS = require('gulp-clean-css'),
	sourcemaps = require('gulp-sourcemaps'),
	babel = require('gulp-babel'),
	concat = require('gulp-concat'),
	minifyHTML = require('gulp-minify-html'),
	gulpHandlebars = require('gulp-compile-handlebars')

const templateData = {},
	options = {
		batch: ['./templates/partials'],
	}

gulp.task('serve', ['sass', 'html'], function() {
	browserSync.init({
		server: 'src/',
	})

	gulp.watch('src/sass/*.sass', ['sass'])
	gulp.watch('src/js/*.js', ['js'])
	gulp.watch('templates/**/*.hbs', ['html'])
	gulp.watch('src/css/*.css').on('change', browserSync.reload)
})

gulp.task('js', function() {
	return gulp
		.src('src/js/*.js')
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['env'],
			}),
		)
		.pipe(concat('main.js'))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('src/js'))
		.pipe(browserSync.stream())
})

gulp.task('sass', function() {
	return gulp
		.src('src/sass/*.sass')
		.pipe(sass().on('error', sass.logError))
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions'],
				cascade: false,
			}),
		)
		.pipe(concatCss('style.css'))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.stream())
})

gulp.task('html', function() {
	return gulp
		.src('templates/*.hbs')
		.pipe(gulpHandlebars(templateData, options))
		.pipe(rename({ ext: '.html' }))
		.pipe(gulp.dest('src'))
		.pipe(browserSync.stream())
})

gulp.task('css:build', function() {
	return gulp
		.src('src/css/*.css')
		.pipe(rename({ suffix: '.min' }))
		.pipe(cleanCSS())
		.pipe(gulp.dest('dist/css'))
})

gulp.task('js:build', function() {
	return gulp
		.src('src/js/*.js')
		.pipe(
			babel({
				presets: ['env'],
			}),
		)
		.pipe(concat('all.js'))
		.pipe(rename({ suffix: '.min' }))
		.pipe(uglify())
		.pipe(gulp.dest('dist/js'))
})

gulp.task('html:build', function() {
	return gulp
		.src('templates/*.hbs')
		.pipe(gulpHandlebars(templateData, options))
		.pipe(rename({ ext: '.html' }))
		.pipe(minifyHTML())
		.pipe(gulp.dest('dist'))
})

gulp.task('build', ['js:build', 'html:build', 'css:build'], function() {
	return gulp.src('src/vendors/**/*').pipe(gulp.dest('dist/vendors'))
})

gulp.task('clean', function() {
	return gulp.src(['dist/*'], { read: false }).pipe(clean())
})

gulp.task('default', ['serve'])
