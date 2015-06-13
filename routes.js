var channel = require('./controllers/channel');

module.exports = function(app) {

    app.get('/', channel.getIndex);

    app.get('/channels', channel.getChannels);

    app.post('/channel', channel.createChannel);
};
