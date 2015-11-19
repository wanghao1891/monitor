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
  ]
};

if (process.argv.length >= 3 && process.argv[2].toLowerCase() == "live") {
  config.logger.filename = "";
  config.logger.errorFileName = "";
  config.logger.level = "debug";
  config.logger.db = false;
}

module.exports = config;
