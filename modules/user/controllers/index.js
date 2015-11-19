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

  res.send('Ok!');
}

module.exports = env;
