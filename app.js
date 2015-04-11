var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var parseString = require('xml2js').parseString;
var bodyParser = require('body-parser');
var multer = require('multer');
var mongoose = require('mongoose');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/monitor');

var Schema = mongoose.Schema;
var liveChannelSchema = new Schema({
    name: String,
    bitrate: String
});
var LiveChannel = mongoose.model('LiveChannel', liveChannelSchema);

server.listen(8080);

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(multer()); // for parsing multipart/form-data

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/channels', function (req, res) {
    console.log("req", req);

    LiveChannel.find(function (err, liveChannels) {
	if (err) {
	    return console.error(err);
	}

	res.send(liveChannels);
    });

//    res.send({message: 'hey'});
});

app.post('/channel', function (req, res) {
//    console.log("req", req);
//    console.log("res", res);
    
    console.log(req.body);
    var _channel = new LiveChannel(req.body);//{name:'001', bitrate:'227.0.0.1:10000'});
    _channel.save(function (err) {
	if (err) // ...
	    console.log('meow');
    });
    console.log(typeof req.body);
    res.send({ message: 'hey' });
});

io.on('connection', function (socket) {
    request('http://172.17.128.81/channel/cns/1000000000000002/query', function (error, response, body) {
	if (!error && response.statusCode == 200) {
	    console.log(body) // Show the HTML for the Google homepage.
	    parseString(body, function (err, result) {
		console.dir(result);
		console.log(result.lms.channel);
		socket.emit('news', { hello: result.lms.channel[0].stat[0] });
	    });
	}
    })
//    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
	console.log(data);
    });
});

/*var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var Cat = mongoose.model('Cat', { name: String });

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
  if (err) // ...
  console.log('meow');
});*/
