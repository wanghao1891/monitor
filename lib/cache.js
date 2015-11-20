var redis = require('redis');
var config = require('../config');

var env = {
  client: null,
  get_client: get_client,
  create_client: create_client,
  set: set
};

function create_client(uri, options) {
  return redis.createClient(uri, options);
}

function get_client() {
  if(!env.client) {
    return create_client(config.cache.uri);
  } else {
    return env.client;
  }
}

function set(client, key, value, callback) {
  client.set(key, value, callback);
}

module.exports = env;
