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
  var query = {
    uid: req.session._id
  };

  env.db.read_more(Food, query, function(err, foods) {
    if(err) {
      return next(err);
    }

    return res.send({
      data: foods
    });
  });
}

module.exports = env;
