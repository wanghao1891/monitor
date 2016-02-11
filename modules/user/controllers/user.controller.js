var User = require('../models/user.model');
var async = require('async');
var user_config = require('../config');
var _ = require('lodash');

var env = {
  init: init,
  signup: signup,
  signin: signin,
  authenticate: authenticate,
  signout: signout,
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

function delete_session(sid) {
  return function(callback) {
    var client_cache = env.cache.get_client();
    return client_cache.del(sid, function(err) {
      if(err) {
        env.logger.error(err);
        return callback(err);
      } else {
        env.logger.debug('sid:', sid);
        return callback(null);
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

    callback(null, sid);
  };
}

function clear_cookie(sid, res) {
  return function(callback) {
    res.clearCookie('sid', sid);

    callback(null);
  };
}

function signup(req, res, next) {
  var body = req.body;
  var username = body.username;
  var password = body.password;
  var email = body.email;

  env.logger.debug('username:', username, 'password:', password);

  var tasks = [
    create_user(body),
    save_session(),
    set_cookie(res)
  ];

  async.waterfall(tasks, function(err, sid) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: env.config.status.ok,
        sid: sid
      });
    }
  });
}

function get_user(name, callback) {
  return function(callback) {
    var query = {
      //is_deleted: false
    };

    if(name.match(user_config.user.name_regex)) {
      query.username = name.toLowerCase();
    } else {
      query.email = name.toLowerCase();
    }

    env.db.read_one(User, query, function(err, user) {
      if(err) {
        callback(err);
      } else if(!user) {
        callback('no user');
      } else {
        callback(null, user);
      }
    });
  };
}

function signin(req, res, next) {
  var body = req.body;

  if(_.isEmpty(body)) {
    return res.send({
      code: env.config.status.invalid_input
    });
  }

  var name = body.name;
  if(!name.match(user_config.user.name_regex)
     && !name.match(user_config.user.email_regex)) {
    return res.send({
      code: env.config.status.invalid_input
    });
  }

  var password = body.password;
  if(_.isEmpty(password)) {
    return res.send({
      code: env.config.status.invalid_input
    });
  }

  var tasks = [
    get_user(name),
    save_session(),
    set_cookie(res)
  ];

  return async.waterfall(tasks, function(err, sid) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: env.config.status.ok,
        sid: sid
      });
    }
  });
}

function check_mobile(req, callback) {

}

function get_session(sid, callback) {
  var client_cache = env.cache.get_client();
  client_cache.get(sid, function(err, session) {
    if(err) {
      return callback(err);
    } else if(session) {
      return callback(null, JSON.parse(session));
    } else {
      return callback('no session');
    }
  });
}

function check_web(req, callback) {
  var err_info;

  var cookies = req.cookies;
//  if(!cookies) {
//    err_info = 'no cookie';
//    env.logger.error(err_info);
//    return callback(err_info);
//  }

  var sid = cookies.sid || req.headers.sid;

  if(!sid) {
    err_info = 'no session id';
    env.logger.error(err_info);
    return callback(err_info);
  }

  return get_session(sid, function(err, session) {
    if(err) {
      env.logger.error(err);
      return callback(err);
    }

    if(!session) {
      err_info = 'signout failed, can not found user.';
      env.logger.error(err_info);
      return callback(err_info);
    }

    return callback(null, {
      session: session
    });
  });
}

function check_client(req, callback) {
  var err_info = null;

  var headers = req.headers;
  if(!headers) {
    err_info = 'no headers';
    env.logger.error(err_info);
    return callback(err_info);
  }

  var app_key = headers[user_config.auth.app_key];

  if (app_key) {//mobile phone
    return check_mobile({
      app_key: app_key,
      req: req
    }, callback);
  } else {//web
    return check_web(req, callback);
  }
}

function authenticate(req, res, next) {
  var err_info;

  if(!req) {
    err_info = 'no req';
    env.logger.error(err_info);
    return next(new Error(err_info));
  }

  return check_client(req, function(err, result) {
    if(err) {
      return next(new Error(err));
    }

    req.session = result.session;

    env.logger.debug('session:', result.session);

    return next();
  });
}

function signout(req, res, next) {
  var sid = req.cookies.sid;

  var tasks = [
    delete_session(sid),
    clear_cookie(sid, res)
  ];

  return async.waterfall(tasks, function(err) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: env.config.status.ok
      });
    }
  });
}

module.exports = env;
