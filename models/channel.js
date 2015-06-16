var mongoose = require('mongoose');
var SchemaExt = require('./schemaext').SchemaExt;

var ChannelSchema = SchemaExt({
    name: String,
    bitrate: String
}, {
    read: 'secondary'
});

mongoose.model('Channel', ChannelSchema);
