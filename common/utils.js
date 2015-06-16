var winston = require('winston');
var config = require('../config').config;
var moment = require('moment');
var fs = require('fs');

var log_path = '../logs';
if(! fs.existsSync(log_path)){
    fs.mkdirSync(log_path);
}

exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: config.log_dir.commonLoggerFileName, level: 'info',
            json: false,
            timestamp: function () {
                return moment().format("YYYY-MM-DD HH:mm")
            }
        }),
        new (winston.transports.File)({
            filename: config.log_dir.commonLoggerFileErrName, level: 'error',
            json: false,
            maxSize:1024*1024*50,
            timestamp: function () {
                return moment().format("YYYY-MM-DD HH:mm")
            }
        })
    ]
});

var api_logger = new (winston.Logger)({
    transports: [
        new (winston.transports.DailyRotateFile)({
            filename: config.log_dir.apiLoggerFileName, level: 'info',
            json: false,
            timestamp: function () {
                return moment().format("YYYY-MM-DD HH:mm")
            }
        })
    ]
});

exports.res_wrapper = function (req, res, resText) {

    var sversion = req.headers.sversion;
    var cversion = req.headers.cversion;
    var userAgent = req.headers['user-agent'];
    var imei = req.headers.imei;
    var platform = req.headers.platform;
    var opertaion = req.headers.opertaion;
    var deviceid = req.headers.deviceid;
    var timestamp = req.headers.timestamp;
    var network = req.headers.network;
    var userid = req.headers.userid;
    var channel = req.headers.channel;
    var udid = req.headers.udid;
    var body = (req.body ? JSON.stringify(req.body) : '');
    if(resText) resText.__SERVERTIME__ = new Date().getTime();
    var resp = (resText ? JSON.stringify(resText) : '');
    var time = new Date().getTime() - req.___starttime;

    var logText = new Date().getTime() + '<|>' + req.path + '<|>' + req.connection.remoteAddress + '<|>' + (req.headers['x-forwarded-for']||'-') + '<|>' + (req.headers['x_real_ip']||'-') + '<|>' +
            "head<|>" + (sversion||'-') + '<|>' + (cversion||'-') + '<|>' + (userAgent||'-') + '<|>' + (imei||'-') + '<|>' + (platform||'-') + '<|>' + (opertaion||'-') + '<|>' + (deviceid||'-') + '<|>' + (timestamp||'-') + '<|>' + (network||'-') + '<|>' + (userid||'-') + '<|>' + (channel||'-') + '<|>' + (udid||'-') + '<|>' +
            "req<|>" + (body.length||'0') + '<|>reqt<|>' + (body||'-') + '<|>' +
            "resp<|>" + (resp.length||'0') + '<|>respt<|>' + ((resp.length <= 512 ? resp : '-')) + '<|>' +
            "status<|>" + (resText ? resText.status : '-') + '<|>msg<|>' + (resText ? resText.msg : '-')  + '<|>' +
            "time<|>" + (time||'-') + '<|>perf<|>' + (time >= 100 ? '100' : (time >= 50 ? '50' : '0')) + '<|>';

//    redisConn.publish("art_channel", logText, function(err,result){
//        if(err || 0 == result){
//            logger.info("REDIS FAIL "+result+' '+(err?err.toString():""));
//        }else logger.info("REDIS OK "+result);
//    });

    api_logger.info(logText);

    res.send(resText);
};
