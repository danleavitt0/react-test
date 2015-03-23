var gulp = require('gulp');

var browserifyTask = require('gulp-browserify-bundle-task');
var serverTask = require('gulp-server-task');
var linkTasks = require('gulp-link-tasks');
var reactify = require('reactify'); 
var link = linkTasks.link;
var unlink = linkTasks.unlink;
var rmdir = linkTasks.rmdir;
var mkdir = linkTasks.mkdir;

var PRODUCTION = process.env.NODE_ENV === "production";

/**
 * Tasks
 */

gulp.task('unlink', unlink('lib').from('node_modules'));
gulp.task('link', link('lib').to('node_modules'));


// create public dir
gulp.task('rimraf-public', rmdir('public'));
gulp.task('public', ['rimraf-public'], mkdir('public'));

// Dev

gulp.task('browserify', ['public', 'link'], browserifyTask({devMode: !PRODUCTION, entry: './lib/main.js', transform:reactify}));

gulp.task('build', ['browserify']);
gulp.task('dev', ['build'], serverTask('app.js'));
