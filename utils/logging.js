var winston = require('winston');
var config = require('../config').config;
var moment = require('moment');
var fs = require('fs');

var log_path = '../logs';
if(! fs.existsSync(log_path)){
    fs.mkdirSync(log_path);
}

var logger = new (winston.Logger)({
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

module.exports = logger;
