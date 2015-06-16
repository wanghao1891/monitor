var events = require("events");
var emitter = new events.EventEmitter();
var ChannelModel = require('../models').ChannelModel;
var request = require('request');
var parseString = require('xml2js').parseString;
var operator = process.argv[2] || "trial";

exports.socket_manager = socket_manager;

function socket_manager(io, config) {
  if(!(this instanceof socket_manager)) {
    return new socket_manager(io, config);
  }

  this.io = io;
  this.config = config;
  this.sockets = [];
}

socket_manager.prototype.init = function() {
  this.io.on('connection', function (socket) {

    // 发布
    emitter.emit('connection', "socket", socket);

    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
};

socket_manager.prototype.notify_client = function(channel, status) {

  if(this.sockets.length > 0) {
    this.sockets.forEach(function(socket){
      socket.emit('news', {
        channel:channel,
        status: status
      });
    });
  }
};

socket_manager.prototype.send_quering_request = function(channels) {

  var self = this;

  channels.forEach(function(channel){

    var url = self.config[operator].lms + channel.name + "/query";

    console.log(self.send_quering_request, url);
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {

        parseString(body, function (err, result) {
          console.dir(result);
          var status = "Bad";
          if(!!result && !!result.lms && !!result.lms.channel[0]) {
            var status = result.lms.channel[0].stat[0];
            console.log(self.send_quering_request, status);
          }

          self.notify_client(channel.name, status);
        });
      }
    });
  });
};

socket_manager.prototype.query_channel = function(socket) {

  var self = this;

  setInterval(function(){
    ChannelModel.find(function (err, channels) {
      if (err) {
        return console.error(err);
      }

      self.send_quering_request(channels);
    });
  }, 1000);

  // 订阅
  emitter.on("connection", function (key, value) {

    self.sockets.push(value);
  });
};
