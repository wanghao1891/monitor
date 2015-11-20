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
  var logger = env.context.logger;
  var util = env.context.util;

  var username = req.body.username;
  var password = req.body.password;

  logger.debug('username:', username, 'password:', password);

  var salt = util.get_uuid();

  password = util.encrypt(salt, password);

  user.create({
    username: username,
    password: password,
    salt: salt
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
