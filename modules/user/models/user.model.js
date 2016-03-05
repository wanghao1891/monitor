'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  first_name: {
    type: String,
    trim: true,
    default: ''
  },
  last_name: {
    type: String,
    trim: true,
    default: ''
  },
  display_name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    //unique: false,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    //unique: 'Username already exists',
    //required: 'Please fill in a username',
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    default: ''
  },
  salt: {
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

module.exports = mongoose.model('user', UserSchema);
