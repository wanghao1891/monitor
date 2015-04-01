var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var request = require('request');
var parseString = require('xml2js').parseString;

server.listen(8080);

app.use(express.static('public'));
app.use(express.static('bower_components'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.post('/channel', function (req, res) {
    console.log("req", req);
    console.log("res", res);
    console.log(req.body);
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
