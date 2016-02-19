var Food = require('../models/food.model');

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
  var body = req.body;
//  var data = {
//    uid: req.session._id,
//    name: body.name,
//    type: body.type,
//    location: body.location
//  };

  var data = req.body;
  data.uid = req.session._id;
  //console.log('data:', data);
  env.db.create(Food, data, function(err, food) {
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
    model: Food,
    query: {
      uid: req.session._id
    },
    fields: '',
    options: {
      sort: {
        updated: -1
      }
    }
  };

  var type = req.params.type;

  switch(type) {
  case 'expiring':
    var time = req.params.time || 60 * 60 * 24 * 1000;
    data.query.expiration_date = {
      $lte: new Date().getTime() + time,
      $gte: new Date().getTime()
    };
    break;
  case 'expired':
    data.query.expiration_date = {
      $lt: new Date().getTime()
    };
    break;
  }
  env.logger.debug('data:', data);
  env.db.read_more(data, function(err, foods) {
    if(err) {
      return next(err);
    }

    return res.send({
      data: foods
    });
  });
}

module.exports = env;
