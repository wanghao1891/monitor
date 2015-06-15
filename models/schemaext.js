var mongoose = require('mongoose');
var Schema = mongoose.Schema;

exports.SchemaExt = function(obj, options) {
    if (!options || !options.read) {
        if (options) {
            options.read = 'secondary';
        } else {
            options = {read:'secondary'};
        }
    }
    return new Schema(obj, options);
};
