const gulp = require('gulp');
const tasks = {}
const actions = ['build', 'clean', 'minify', 'transpile', 'watch']
const targets = ['scripts', 'styles', 'views'];

actions.forEach(action => {
  tasks[action] = [];
  targets.forEach(target => {
    try {
      const taskName = `${action}:${target}`;
      const fn = require(`./build/${target}/${action}`);
      tasks[action].push(taskName);
      gulp.task(taskName, fn);
    } catch (error) {
      return false;
    }
  });
});

gulp.task('build', gulp.parallel(tasks.build));
gulp.task('clean', gulp.parallel(tasks.clean));
gulp.task('watch', gulp.parallel(tasks.watch));
gulp.task('default', gulp.series('clean', 'build'));

