"use strict";

var winston = require("winston"),
    config = require("../config");

var logger = new (winston.Logger)({}),
    error_logger = new (winston.Logger)({});

if (config.logger.filename) {
    logger.add(winston.transports.File, {
        level   : config.logger.level,
        filename: config.logger.filename,
        dirname : config.logger.dirname,
        maxsize : config.logger.maxsize
    });
} else {
    logger.add(winston.transports.Console, {level: config.logger.level});
}

if (config.logger.errorFileName) {
    error_logger.add(winston.transports.File, {
        level   : "warn",
        filename: config.logger.errorFileName,
        dirname : config.logger.dirname,
        maxsize : config.logger.maxsize
    });
}else {
    error_logger.add(winston.transports.Console, {level: "warn"});
}

function process_stack() {
    var args = Array.prototype.slice.call(arguments);

    var _args = [
        __stack[2].getFunctionName()
            + ':'
            + __stack[2].getLineNumber()
    ];

    args = _args.concat(args);

    args.push(__stack[2].getFileName());

    return args;
}

function log(logger, type) {
    return function() {
        var args = process_stack.apply(null, arguments);
        logger[type].apply(logger, args);
    };
}

module.exports = {
    log: log(logger, 'log'),
    info: log(logger, 'info'),
    debug: log(logger, 'debug'),
    warn: log(error_logger, 'warn'),
    error: log(error_logger, 'error')
};
