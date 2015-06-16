var mongoose = require('mongoose');
var config = require('../config').config;
var logger = require('../common/utils').logger;

var operator = config.operator || 'trial';

var options = {
  replset: {
    rs_name: 'monitor'
  },
  user: '',
  pass: '',
  server: {
    poolSize: 50
  },
  connectTimeoutMS: 20000
};

var op_mongodb = config[operator].mongodb;

mongoose.connect(op_mongodb, options, function (err) {

  if (err) {
    logger.log('error', 'connect to mongodb replicaset error: ', err.message, '', {}, function(){
      process.exit(1);
    });
  } else {
    logger.info('connect to mongodb replicaset success');
  }
});

// models
require('./channel');

exports.ChannelModel = mongoose.model('Channel');
