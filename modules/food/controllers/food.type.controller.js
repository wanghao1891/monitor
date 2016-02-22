var FoodType = require('../models/food.type.model');

var env = {
  init: init,
  create: create,
  read_more: read_more,
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
  var data = req.body;
  data.users = [req.session._id];
  //console.log('data:', data);
  env.db.create(FoodType, data, function(err, food) {
    if(err) {
      return next(err);
    }

    return res.send({
      code: env.config.status.ok
    });
  });
}

function read_more(req, res, next) {
  var data = {
    model: FoodType,
    query: {
      users: req.session._id
    },
    fields: '',
    options: {
      sort: {
        updated: -1
      }
    }
  };

  env.logger.debug('data:', data);
  env.db.read_more(data, function(err, docs) {
    if(err) {
      return next(err);
    }

    return res.send({
      data: docs
    });
  });
}

module.exports = env;
