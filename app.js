var express = require('express'),
    path = require('path'),
    cookie_parser = require('cookie-parser'),
    body_parser = require('body-parser'),
    compression = require("compression"),
    app = express(),
    route = require("./route"),
    package_json = require('./package.json'),
    config = require('./config'),
    core = require('./core'),
    logger = core.logger;

app.use(compression());

// parse application/x-www-form-urlencoded
app.use(body_parser.urlencoded({extended: false}));

// parse application/json
app.use(body_parser.json({limit: "10mb"}));
app.use(cookie_parser());

// Indicates the app is behind a front-facing proxy, and to use the X-Forwarded-* headers to determine the connection and the IP address of the client. NOTE: X-Forwarded-* headers are easily spoofed and the detected IP addresses are unreliable.
//
// trust proxy is disabled by default. When enabled, Express attempts to determine the IP address of the client connected through the front-facing proxy, or series of proxies. The req.ips property, then, contains an array of IP addresses the client is connected through. To enable it, use the values described in the trust proxy options table.
//
// The trust proxy setting is implemented using the proxy-addr package. For more information, see its documentation.
app.disable("x-powered-by");

// Enables the "X-Powered-By: Express" HTTP header.
// The default is true.
app.enable('trust proxy');

config.version = package_json.version;
app.locals.config = config;
route(app, config);

if (config.env !== "test") {
    app.set('port', process.env.PORT || 8100);
    app.listen(app.get('port'), '0.0.0.0', function () {
        logger.info('Server listening on port', app.get('port'));
    });
}
if (config.env === 'production') {
    process.on("uncaughtException", function (err) {
        setTimeout(function () {
            process.exit();
        }, 1000);
        logger.error(err, "process uncaughtException");
    });
} else {
    app.set('json spaces', 2);
}

module.exports = exports = app;
