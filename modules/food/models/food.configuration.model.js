'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodConfigurationSchema = new Schema({
  uid: {
    type: String,
    trim: true,
    default: ''
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  type: {
    type: String
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

module.exports = mongoose.model('food_configuration', FoodConfigurationSchema);
