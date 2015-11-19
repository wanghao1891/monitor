module.exports = function(context) {
  var user = require('../controllers');
  user.init(context);

  var app = context.app;

  app.post('/api/auth/signup', user.signup);
};
