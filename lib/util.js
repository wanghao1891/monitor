var uuid = require('node-uuid'),
    moment = require('moment'),
    crypto = require('crypto');

function get_uuid() {
  var str = uuid.v4();

  var regex = new RegExp('-', 'g');
  str = str.replace(regex, '');
  return str;
}

function get_now(formart) {
  var now = moment();
  if (formart) {
    return now.format(formart);
  }
  return now.toString();
}

function get_hash(data) {
  var hash = crypto.createHash('sha256').update(data).digest('hex');

  return hash;
}

function encrypt(salt, data) {
  return get_hash(salt + data);
}

module.exports = {
  get_uuid: get_uuid,
  get_now: get_now,
  get_hash: get_hash,
  encrypt: encrypt
};
