module.exports = function(context) {
  var food_type_controller = require('../controllers/food.type.controller');
  food_type_controller.init(context);

  var app = context.app;

  app.route('/api/food-type')
    .post(food_type_controller.create)
    .get(food_type_controller.read_more);
};
