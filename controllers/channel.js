var utils = require('../common/utils');
var logger = utils.logger;
var constants = require('../common/constants').constants;
var request = require('request');
var parseString = require('xml2js').parseString;
var model = require('../models/index');
var ChannelModel = model.ChannelModel;
var res_wrapper = utils.res_wrapper;

exports.get_channels = function(req, res, next) {

    ChannelModel.find(function (err, channels) {
        if (err) {
            logger.error(err);
            return res_wrapper(req, res, constants.ERROR_CODE.SERVER_ERROR);
        }

        res_wrapper(req, res, channels);
    });
};

exports.create_channel = function(req, res, next) {

    var channelName = req.body.name;
    var bitrate = req.body.bitrate;
    var url = "http://192.168.56.3:8080/channel/trial/" + channelName  + "/start?source=udp://" + bitrate  + ":864000&recording=no&record_d=/tmp";

    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {

            parseString(body, function (err, result) {
                console.dir(result);
            });
        }
    });

    var _channel = new ChannelModel(req.body);
    _channel.save(function (err) {
        if (err) // ...
            console.log('meow');
    });

    res.send({ message: 'hey' });
};
