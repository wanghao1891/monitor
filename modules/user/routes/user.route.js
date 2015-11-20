module.exports = function(context) {
  var user_controller = require('../controllers/user.controller');
  user_controller.init(context);

  var app = context.app;

  app.post('/api/auth/signup', user_controller.signup);
};
