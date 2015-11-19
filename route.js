exports = module.exports = function (context) {
  var config = context.config;

  config.modules.forEach(function(module) {
    var path = './modules/' + module + '/routes';
    require(path)(context);
  });
};

/*var controller = require("./controller"),
    api = require("./api"),
    core = require("./core"),
    permission = api.permission,
    handler = require('./handler');

exports = module.exports = function (app, config) {
  app.use(handler.log_request);

  app.get('/error', controller.site_error);
  app.get('/not-found', controller.site_not_found);

  if (config.env != 'development') {
    app.get('*', permission.user.check_auth, controller.home.index);
  }

  // Error handler
  app.use(handler.error);
};*/
