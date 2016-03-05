'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodConfigurationSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String
  },
  user: {
    type: String,
    default: []
  },
  created: {
    type: Number,
    default: Date.now
  },
  updated: {
    type: Number,
    default: Date.now
  }
});

module.exports = mongoose.model('FoodConfiguration', FoodConfigurationSchema);
