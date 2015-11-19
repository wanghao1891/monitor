/*function sign_up(context) {
  return function(req, res, next) {
    controller.sign_up(req, res, next, context);
  };
 }*/

module.exports = function(context) {
  var user = require('../controllers');
  user.init(context);

  var app = context.app;

  app.post('/api/auth/signup', user.signup);
};
