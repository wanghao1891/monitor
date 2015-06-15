var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var parseString = require('xml2js').parseString;
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var config = require("./config.js").config;
var events = require("events");
var routes = require('./routes.js');
var ChannelModel = require('./models').ChannelModel;
var emitter = new events.EventEmitter();
var port = config.port;

//console.log(process.argv[2]);

var operator = process.argv[2] || "trial";

//mongoose.connect('mongodb://localhost/monitor');

//catch the error of connneting mongodb.
//var db = mongoose.connection;
//db.on('error', console.error.bind(console, 'connection error:'));

//var Schema = mongoose.Schema;
//var liveChannelSchema = new Schema({
//    name: String,
//    bitrate: String
//});
//var LiveChannel = mongoose.model('LiveChannel', liveChannelSchema);

server.listen(port);

console.log("Server running at http://0.0.0.0/");

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

routes(app);

//app.get('/', function (req, res) {
//    res.sendFile(__dirname + '/index.html');
//});
//
//app.get('/channels', function (req, res) {
//    //console.log("req", req);
//
//    LiveChannel.find(function (err, liveChannels) {
//	if (err) {
//	    return console.error(err);
//	}
//
//	res.send(liveChannels);
//    });
//
////    res.send({message: 'hey'});
//});
//
//app.post('/channel', function (req, res) {
////    console.log("req", req);
////    console.log("res", res);
//    
//    console.log(req.body);
//
//    var channelName = req.body.name;
//    var bitrate = req.body.bitrate;
//    var url = "http://192.168.56.3:8080/channel/trial/" + channelName  + "/start?source=udp://" + bitrate  + ":864000&recording=no&record_d=/tmp"
//    console.log(url);
//
//    request(url, function (error, response, body) {
//	if (!error && response.statusCode == 200) {
//	    //		    console.log(body) // Show the HTML for the Google homepage.
//	    parseString(body, function (err, result) {
//		console.dir(result);
//	    });
//	}
//    });
//
//    var _channel = new LiveChannel(req.body);//{name:'001', bitrate:'227.0.0.1:10000'});
//    _channel.save(function (err) {
//	if (err) // ...
//	    console.log('meow');
//    });
//    console.log(typeof req.body);
//    res.send({ message: 'hey' });
//});

function notifyClient(channel, sockets, status) {
    
    if(sockets.length > 0) {
	sockets.forEach(function(socket){
	    socket.emit('news', {
		channel:channel,
		status: status
	    });
	});
    }
}

function sendQueringRequest(channels, sockets) {
//    setInterval(function(){

	channels.forEach(function(channel){
	    
	    var url = config[operator] + channel.name + "/query";
	    
	    console.log(queryChannel, url);
	    request(url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		    //		    console.log(body) // Show the HTML for the Google homepage.
		    parseString(body, function (err, result) {
			console.dir(result);
			var status = "Bad";
			if(!!result && !!result.lms && !!result.lms.channel[0]) {
			    var status = result.lms.channel[0].stat[0];
			    console.log(queryChannel, status);
			}

			notifyClient(channel.name, sockets, status);
		    });
		}
	    });
	});
//    },10000);
}

function queryChannel(socket) {

//    var channels = [1000000000000001];
    var isSocketIOConnected = false;
    //var channels = config.channels;
    var sockets = [];

    setInterval(function(){
	ChannelModel.find(function (err, channels) {
	    if (err) {
		return console.error(err);
	    }

	    sendQueringRequest(channels, sockets);

//	emitter.emit("channels", "channels", channels);
	});
    }, 1000);

    //console.log(channels);

    // 订阅
    emitter.on("connection", function (key, value) {
//	console.log(queryChannel, "client connect the server.", value);
	sockets.push(value);
    });

/*    emitter.on("channels", function(key, value) {

	setInterval(function(){

	    value.forEach(function(channel){
		
		var url = config[operator] + channel.name + "/query";
		
		console.log(queryChannel, url);
		request(url, function (error, response, body) {
		    if (!error && response.statusCode == 200) {
			//		    console.log(body) // Show the HTML for the Google homepage.
			parseString(body, function (err, result) {
			    console.dir(result);
			    var status = "Bad";
			    if(!!result && !!result.lms && !!result.lms.channel[0]) {
				var status = result.lms.channel[0].stat[0];
				console.log(queryChannel, status);
			    }

			    notifyClient(channel.name, sockets, status);
			});
		    }
		});
	    });
	},10000);
    });*/
}

queryChannel();

io.on('connection', function (socket) {

    // 发布
//    console.log("socket.io", socket);
    emitter.emit('connection', "socket", socket);

    socket.on('my other event', function (data) {
	console.log(data);
    });
});


process.on('uncaughtException', function (err) {
    console.error((new Date).toString() + " uncaughtException " + err + " " + err.stack +  "\n\n");
    //process.exit(1);
});
