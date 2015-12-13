module.exports = function(context) {
  var user_controller = require('../controllers/user.controller');
  user_controller.init(context);

  var app = context.app;

  app.post('/api/auth/signup', user_controller.signup);
  app.post('/api/auth/signin', user_controller.signin);
  app.post('/api/auth/signout', user_controller.authenticate, user_controller.signout);
  app.get('/cookie/:action/:sid', function(req, res, next) {
    var action = req.params.action;
    var sid = req.params.sid;
    console.log('cookie action: %s, sid: %s', action, sid);

    if(action === 'set') {
      res.cookie('sid', sid);
    } else if(action === 'clear'){
      res.clearCookie('sid', sid);
    }

    res.send('ok');
  });
};
