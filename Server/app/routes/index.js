
const taskRouter = require("./task.route");
const authRouter = require("./auth.route");
// const wallpaperRouter = require("./wallpaper.route");

function route(app) {
  app.use('/api/v1/auth', authRouter);
  app.use('/api/v1/task', taskRouter);
  // app.use('/api/v1/wallpaper', wallpaperRouter);
  app.use('/', () => {
    console.log('/');
  })
}

module.exports = route;