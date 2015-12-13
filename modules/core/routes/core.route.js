module.exports = function(context) {
  var app = context.app;
  var config = context.config;

  app.get('/', function(req, res, next) {
    res.send('Home page');
  });

  /*if(config.env != 'development') {
    app.get('*', function(req, res, next) {
      res.send('Welcome!');
    });
  }*/
};
