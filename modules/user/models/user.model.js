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
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    unique: 'Username already exists',
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
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

var User = mongoose.model('User', UserSchema);

function create_user(info, callback) {
  var username = info.username;
  var password = info.password;

  var user = new User({
    username: username,
    password: password
  });

  user.save(function(err) {
    callback(err);
  });
}

module.exports = {
  create_user: create_user
};
