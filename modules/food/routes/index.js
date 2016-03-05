'use strict';

module.exports = function(context) {
  require('./food.configuration.route')(context);
  require('./food.route')(context);
  require('./food.type.route')(context);
};
