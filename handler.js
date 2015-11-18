var core = require('./core');
var util = core.util;

function log_request(req, res, next) {
    req.context = {
        oid: util.guid()
    };

    var now_date = util.get_now('YYYY-MM-DD HH:ss:mm');

    var client = req.team_cookies;
    if (!client) {
        client = req.get('app_key');
        if (!client) {
            client = 'unknown';
        }
        else {
            client = 'app_key=' + client;
        }
    }
    else {
        client = 'cookies=' + JSON.stringify(client);
    }

    var referer = req.get('Referer');
    if (!referer) {
        referer = 'unknown';
    }

    var ua = req.get('User-Agent');
    if (!ua) {
        ua = 'unknown';
    }
    var req_info = {
        date      : now_date,
        method    : req.method,
        url       : req.url,
        ip        : req.ip,
        referer   : referer,
        oid       : req.context.oid,
        client    : client,
        ua        : ua
    };

    req_info.uid = req.user ? req.user.uid : '';

    core.logger.info(req.url, req_info);

    next();
};

function error(error, req, res, next) {
    console.log(error);
    return res.send({code: 500});
};

module.exports = {
    log_request: log_request,
    error: error
};
