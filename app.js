var express = require('express'),
    path = require('path'),
    cookie_parser = require('cookie-parser'),
    body_parser = require('body-parser'),
    compression = require("compression"),
    FileStreamRotator = require('file-stream-rotator'),
    fs = require('fs'),
    morgan = require('morgan'),
    app = express(),
    route = require("./route"),
    package_json = require('./package.json'),
    config = require('./config'),
    lib = require('./lib'),
    logger = lib.logger,
    util = lib.util;

var log_directory = __dirname + '/logs';

// ensure log directory exists
fs.existsSync(log_directory) || fs.mkdirSync(log_directory);


// create a rotating write stream
var access_log_stream = FileStreamRotator.getStream({
  filename: log_directory + '/access-%DATE%.log',
  frequency: 'daily',
  verbose: false,
  date_format: "YYYY-MM-DD"
});

// Define your morgan logger to log JSON to your client
// The object here takes your keys and strings that use
// the morgan token format
app.use(morgan(
  format({
  response_time: ':response-time',
  remote_addr: ':remote-addr',
  remote_user: ':remote-user',
  status: ':status',
  url: ':url'
  // etc.; any non-standard tokens you would have to implement
  }),
  {stream: access_log_stream}
));

function format(obj) {
  var keys = Object.keys(obj);
  var token = /^:([-\w]{2,})(?:\[([^\]]+)\])?$/;
  return function (tokens, req, res) {
    var data = {};
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var val = token.exec(obj[key]);
      data[key] = val !== null
        ? tokens[val[1]](req, res, val[2])
        : obj[key];
    }
    console.log(JSON.stringify(data, null, 4));
  };
}

// setup the logger
//app.use(morgan('combined', {stream: access_log_stream}));

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
app.logger = logger;

var context = {
  app: app,
  config: config,
  logger: logger,
  util: util
};

route(context);

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
