var user = require('../models/user.model');

var env = {
  init: init,
  signup: signup,
  context: null
};

function init(context) {
  this.context = context;
}

function signup(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;

  var logger = env.context.logger;

  logger.debug('username:', username, 'password:', password);

  user.create_user({
    username: username,
    password: password
  }, function(err) {
    if(err) {
      logger.error(err);
      res.send({
        state: 500
      });
    } else {
      res.send({
        state: 200
      });
    }
  });
}

module.exports = env;
