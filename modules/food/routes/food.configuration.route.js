module.exports = function(context) {
  var food_configuration_controller = require('../controllers/food.configuration.controller');
  food_configuration_controller.init(context);

  var app = context.app;

  app.route('/api/food/configuration/:id')
    .delete(food_configuration_controller.delete_one)
    .put(food_configuration_controller.update_one);

  app.route('/api/food/configuration/:type?')
    .post(food_configuration_controller.create)
    .get(food_configuration_controller.read_more)
    .delete(food_configuration_controller.delete_more);
};