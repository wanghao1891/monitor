module.exports = function(context) {
  var food_controller = require('../controllers/food.controller');
  food_controller.init(context);

  var app = context.app;

  app.route('/api/food')
    .post(food_controller.create)
    .get(food_controller.read_more);
};
