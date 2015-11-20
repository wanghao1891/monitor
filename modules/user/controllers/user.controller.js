var User = require('../models/user.model');

var env = {
  init: init,
  signup: signup,
  context: null
};

function init(context) {
  this.context = context;
}

function signup(req, res, next) {
  var context = env.context,
      logger = context.logger,
      util = context.util,
      cache = context.cache,
      db = context.db;

  var body = req.body,
      username = body.username,
      password = body.password,
      email = body.email;

  logger.debug('username:', username, 'password:', password, 'cache:', cache);

  var salt = util.get_uuid();

  password = util.encrypt(salt, password);

  var data = {
    username: username,
    password: password,
    salt: salt,
    email: email
  };
  db.create(User, data, function(err, result) {
    if(err) {
      logger.error(err);
      res.send({
        code: 500
      });
    } else {
      var sid = util.get_uuid();

      var client_cache = cache.get_client();
      logger.debug('sid:', sid);
      client_cache.set(sid, JSON.stringify(result), function(err) {
        if(err) {
          logger.error(err);
          res.send({
            code: 500
          });
        } else {
          res.send({
            code: 200
          });
        }
      });
    }
  });
}

module.exports = env;
