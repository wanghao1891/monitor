'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodTypeSchema = new Schema({
  name: {
    type: String,
    trim: true,
    default: ''
  },
  users: {
    type: Array,
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

module.exports = mongoose.model('FoodType', FoodTypeSchema);
