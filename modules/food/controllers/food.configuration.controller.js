var FoodConfiguration = require('../models/food.configuration.model');

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
  data.uid = req.session._id;
  //console.log('data:', data);
  env.db.create(FoodConfiguration, data, function(err, food) {
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
    model: FoodConfiguration,
    query: {
      uid: req.session._id
    },
    fields: 'name type',
    options: {
      sort: {
        updated: -1
      }
    }
  };

  var type = req.params.type;
  if(type) {
    data.query.type = type;
  }

  env.logger.debug('data:',
                   {
                     query: data.query,
                     field: data.field,
                     options: data.options
                   });
  env.logger.debug('data:',
                   JSON.stringify({
                     query: data.query,
                     field: data.field,
                     options: data.options}, null, 2)
                  );
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
