var config = {
  logger: {
    level: 'info',
    dirname: 'logs', // e.g. /mnt/wtlog/nodejs/web
    filename: 'monitor-info.log',
    errorFileName: 'monitor-error.log',
    maxsize: 1024 * 1024 * 10
  },
  modules: [
    'core',
    'user'
  ],
  db: {
    uri: 'mongodb://localhost/monitor',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || false
  },
  cache: {
    uri: 'redis://127.0.0.1:6379',
    options: {}
  }
};

if (process.argv.length >= 3 && process.argv[2].toLowerCase() == "live") {
  config.logger.filename = "";
  config.logger.errorFileName = "";
  config.logger.level = "debug";
  config.logger.db = false;
}

module.exports = config;