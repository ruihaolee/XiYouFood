var gulp = require('gulp'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css');

gulp.task('taskLess', function() {
	gulp.src('src/less/*.less')
		.pipe(less())
		.pipe(minifycss())
		.pipe(gulp.dest('src/css'));
});

gulp.task('taskWatch', function(){
	gulp.watch('src/less/*.less', ['taskLess']);
});