var channel = require('./controllers/channel');

module.exports = function(app) {

//    app.get('/', channel.get_index);

    app.get('/channels', channel.get_channels);

    app.post('/channel', channel.create_channel);
};
