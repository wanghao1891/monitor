var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require("./config.js").config;
var routes = require('./routes.js');
var socket_manager = require('./controllers/socket').socket_manager(io, config);
var port = config.port;

server.listen(port);

console.log("Server running at http://0.0.0.0/");

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

routes(app);

socket_manager.init();
socket_manager.query_channel();

process.on('uncaughtException', function (err) {
  console.error((new Date).toString() + " uncaughtException " + err + " " + err.stack +  "\n\n");
  //process.exit(1);
});
