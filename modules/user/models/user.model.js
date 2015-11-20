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
    unique: false,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: false,
    //unique: 'Username already exists',
    required: 'Please fill in a username',
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
    type: Date
  }
});

module.exports = mongoose.model('User', UserSchema);

/*
function create(data, callback) {
  var user = new User(data);

  user.save(function(err, result) {
    callback(err, result);
   });
}

module.exports = {
  create: create
};
*/
