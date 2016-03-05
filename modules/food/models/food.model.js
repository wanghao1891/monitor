'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var FoodSchema = new Schema({
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
    type: String,
    trim: true,
    default: ''
  },
  category: {
    type: String
//    trim: true,
//    default: ''
  },
  location: {
    type: String
//    trim: true,
//    default: ''
  },
  manufacture_date: {
    type: Number
  },
  purchase_date: {
    type: Number
  },
  expiration_date: {
    type: Number
  },
  status: {
    type: Number,
    default: 1 //0, deleted; 1, ok
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

module.exports = mongoose.model('food', FoodSchema);
