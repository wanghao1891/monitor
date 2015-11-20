exports = module.exports = function (context) {
  var config = context.config;

  config.modules.forEach(function(module) {
    var path = './modules/' + module + '/routes/' + module + '.route';
    require(path)(context);
  });
};
