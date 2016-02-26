var Food = require('../models/food.model');

var env = {
  init: init,
  create: create,
  read_more: read_more,
  delete_one: delete_one,
  update_one: update_one,
  delete_more: delete_more,
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
      uid: req.session._id,
      status: {
        $ne: 0
      }
    },
    fields: '',
    options: {
      sort: {
        updated: -1
      }
    }
  };

  var type = req.params.type;
  var time = req.params.time || 60 * 60 * 24 * 1000;

  switch(type) {
  case 'expiring':
    data.query.expiration_date = {
      $lte: new Date().getTime() + time,
      $gt: new Date().getTime()
    };
    break;

  case 'expired':
    data.query.expiration_date = {
      $lte: new Date().getTime()
    };
    break;

  case 'normal':
    data.query.expiration_date = {
      $gt: new Date().getTime() + time
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

function delete_one(req, res, next) {
  var data = {
    model: Food,
    query: {
      _id: req.params.food_id
    }
  };

  env.db.delete_one(data, function(err) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: 200
      });
    }
  });
}

function update_one(req, res, next) {
  var data = {
    model: Food,
    query: {
      _id: req.params.food_id
    },
    setter: req.body
  };

  env.db.update_one(data, function(err) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: 200
      });
    }
  });
}

function delete_more(req, res, next) {
  var data = {
    model: Food,
    query: {
      _id: {
        $in: req.body.food_id_list
      }
    }
  };

  env.logger.debug('data:', JSON.stringify(data, null, 2));
  env.db.delete_one(data, function(err) {
    if(err) {
      next(err);
    } else {
      res.send({
        code: 200
      });
    }
  });
}

module.exports = env;
