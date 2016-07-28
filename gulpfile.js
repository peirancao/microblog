var gulp = require('gulp');
var htmlmin = require('gulp-htmlmin');
var jsmin = require('gulp-jsmin');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('default', ['script', 'minify'], function() {
  return gulp.src('./src/assets/**/*')
  .pipe(gulp.dest('dist/assets'));
});

gulp.task('script', ['clean'], function () {
    gulp.src(['src/assets/app.js', 'src/assets/main.js', 'src/assets/lodash.js'])
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/assets'));
});

gulp.task('minify', ['clean'], function() {
  var options = {
    removeComments: true,//清除HTML注释
    collapseWhitespace: true,//压缩HTML
    collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
    removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
    removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
    removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
    minifyJS: true,//压缩页面JS
    minifyCSS: true//压缩页面CSS
  };
  return gulp.src('src/index.html')
    .pipe(htmlmin(options))
    .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    return del(['dist']);
});