var mongoose = require('mongoose'),
    config = require('../config'),
    logger = require('./logger');

function connect(callback) {
  mongoose.connect(config.db.uri, config.db.options, function(err) {
    if(err) {
      logger.error('Connect mongodb', config.db.uri, err);
    } else {
      logger.info('Connect mongodb', config.db.uri, 'successfully.');
    }

    if(callback) {
      callback(err);
    }
  });
}

function create(Model, data, callback) {
  var model = new Model(data);

  model.save(function(err, result) {
    callback(err, result);
  });
}

function read_one(Model, query, callback) {
  Model.findOne(query, callback);
}

function read_more(Model, query, callback) {
  Model.find(query, callback);
}

module.exports = {
  connect: connect,
  create: create,
  read_one: read_one,
  read_more: read_more
};
