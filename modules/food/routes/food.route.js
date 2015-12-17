module.exports = function(context) {
  var food_controller = require('../controllers/food.controller');
  food_controller.init(context);

  var app = context.app;

  app.post('/api/food', food_controller.create);
};
