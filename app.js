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

//function notifyClient(channel, sockets, status) {
//
//    if(sockets.length > 0) {
//	sockets.forEach(function(socket){
//	    socket.emit('news', {
//		channel:channel,
//		status: status
//	    });
//	});
//    }
//}
//
//function sendQueringRequest(channels, sockets) {
//
//    channels.forEach(function(channel){
//
//	var url = config[operator] + channel.name + "/query";
//
//	console.log(queryChannel, url);
//	request(url, function (error, response, body) {
//	    if (!error && response.statusCode == 200) {
//
//		parseString(body, function (err, result) {
//		    console.dir(result);
//		    var status = "Bad";
//		    if(!!result && !!result.lms && !!result.lms.channel[0]) {
//			var status = result.lms.channel[0].stat[0];
//			console.log(queryChannel, status);
//		    }
//
//		    notifyClient(channel.name, sockets, status);
//		});
//	    }
//	});
//    });
//}
//
//function queryChannel(socket) {
//
//    var isSocketIOConnected = false;
//    var sockets = [];
//
//    setInterval(function(){
//	ChannelModel.find(function (err, channels) {
//	    if (err) {
//		return console.error(err);
//	    }
//
//	    sendQueringRequest(channels, sockets);
//	});
//    }, 1000);
//
//
//    // 订阅
//    emitter.on("connection", function (key, value) {
//
//	sockets.push(value);
//    });
//}
//
//queryChannel();
//
//io.on('connection', function (socket) {
//
//    // 发布
//    emitter.emit('connection', "socket", socket);
//
//    socket.on('my other event', function (data) {
//	console.log(data);
//    });
//});


process.on('uncaughtException', function (err) {
    console.error((new Date).toString() + " uncaughtException " + err + " " + err.stack +  "\n\n");
    //process.exit(1);
});
