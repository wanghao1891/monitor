var User = require('../models/user.model');

var env = {
  init: init,
  signup: signup,
  logger: null,
  util: null,
  cache: null,
  db: null
};

function init(context) {
  this.logger = context.logger,
  this.util = context.util,
  this.cache = context.cache,
  this.db = context.db;
}

function signup(req, res, next) {
  var body = req.body,
      username = body.username,
      password = body.password,
      email = body.email;

  env.logger.debug('username:', username, 'password:', password);

  var salt = env.util.get_uuid();
  password = env.util.encrypt(salt, password);
  var data = {
    username: username,
    password: password,
    salt: salt,
    email: email
  };
  env.db.create(User, data, function(err, result) {
    if(err) {
      env.logger.error(err);
      return res.send({
        code: 500
      });
    }

    var sid = env.util.get_uuid();
    var client_cache = env.cache.get_client();
    return client_cache.set(sid, JSON.stringify(result), function(err) {
      if(err) {
        env.logger.error(err);
        res.send({
          code: 500
        });
      } else {
        env.logger.debug('sid:', sid);
        res.send({
          code: 200
        });
      }
    });
  });
}

function signin(req, res, next) {

}

module.exports = env;
