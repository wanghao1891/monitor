var User = require('../models/user.model');
var async = require('async');

var env = {
  init: init,
  signup: signup,
  logger: null,
  util: null,
  cache: null,
  db: null,
  config: null
};

function init(context) {
  this.logger = context.logger;
  this.util = context.util;
  this.cache = context.cache;
  this.db = context.db;
  this.config = context.config;
}

function create_user(info) {
  return function(callback) {
    var salt = env.util.get_uuid();
    var password = env.util.encrypt(salt, info.password);
    var data = {
      username: info.username,
      password: password,
      salt: salt,
      email: info.email
    };

    env.db.create(User, data, function(err, user) {
      if(err) {
        env.logger.error(err);
        callback(err);
      } else if(!user) {
        env.logger.error('no user');
        callback('no user');
      } else {
        callback(null, user);
      }
    });
  };
}

function save_session() {
  return function(user, callback) {
    var sid = env.util.get_uuid();
    var client_cache = env.cache.get_client();
    return client_cache.set(sid, JSON.stringify(user), function(err) {
      if(err) {
        env.logger.error(err);
        return callback(err);
      } else {
        env.logger.debug('sid:', sid);
        return callback(null, sid);
      }
    });
  };
}

function set_cookie(res) {
  return function(sid, callback) {
    res.cookie('sid', sid, {
      expires : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      httpOnly: false,
      domain  : env.config.domain,
      path    : '/'
    });

    callback(null);
  };
}

function signup(req, res, next) {
  var body = req.body,
      username = body.username,
      password = body.password,
      email = body.email;

  env.logger.debug('username:', username, 'password:', password);

  var tasks = [
    create_user(body),
    save_session(),
    set_cookie(res)
  ];

  async.waterfall(tasks, function(err) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: env.config.status.ok
      });
    }
  });
}

function signin(req, res, next) {

}

module.exports = env;
