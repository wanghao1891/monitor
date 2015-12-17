var Food = require('../models/food.model');

var env = {
  init: init,
  create: create,
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

function create(req, res, next) {
  var body = req.body;
  var data = {
    name: body.name,
    type: body.type,
    location: body.location
  };

  env.db.create(Food, data, function(err, food) {
    if(err) {
      return next(err);
    }

    return res.send({
      code: env.config.status.ok
    });
  });
}

module.exports = env;
