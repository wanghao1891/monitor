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

module.exports = {
  connect: connect
};
