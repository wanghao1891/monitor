module.exports = function(context) {
  var food_controller = require('../controllers/food.controller');
  food_controller.init(context);

  var app = context.app;

  app.route('/api/food/:type?/:time?')
    .post(food_controller.create)
    .get(food_controller.read_more)
    .delete(food_controller.delete_more);

  app.route('/api/food/:food_id')
    .delete(food_controller.delete_one)
    .put(food_controller.update_one);
};
