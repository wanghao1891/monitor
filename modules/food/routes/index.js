'use strict';

module.exports = function(context) {
  require('./food.route')(context);
  require('./food.type.route')(context);
};
