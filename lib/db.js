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

function read_more(data, callback) {
  var Model = data.model;
  var query = data.query;
  var fields = data.fields || '';
  var options = data.options || {};

  Model.find(query, fields, options, callback);
}

function delete_one(data, callback) {
  data.setter = {
    $set: {
      status: 0
    }
  };

  update_one(data, callback);
}

function update_one(data, callback) {
  var Model = data.model;
  var query = data.query;
  var setter = data.setter;
  var options = {
    new: true,
    multi: true
  };

  Model.update(query, setter, options, callback);
}

module.exports = {
  connect: connect,
  create: create,
  read_one: read_one,
  read_more: read_more,
  delete_one: delete_one,
  update_one: update_one
};
