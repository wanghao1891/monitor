var uuid = require('node-uuid'),
    moment = require('moment');

function guid() {
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

module.exports = {
    guid: guid,
    get_now: get_now
};
