var config = {
  operator: 'dongfong',
  cns: {
    lms: 'http://172.17.128.93/channel/cns/',
    mongodb: 'mongodb://192.168.56.3:27017/monitor'
  },
  trial: {
    lms: 'http://192.168.56.3:8080/channel/trial/',
    mongodb: 'mongodb://192.168.56.3:27017/monitor'
  },
  dongfong: {
    lms: 'http://116.50.32.212:8080/channel/dongfong/',
    mongodb: 'mongodb://192.168.56.3:27017/monitor'
  },
  port: 80,
  log_dir: {
    logDir: __dirname + '/'+ 'logs/api.log',
    elogDir: __dirname + '/'+  'logs/excption.log',
    commonLoggerFileName: __dirname + '/'+  'logs/monitor.log',
    commonLoggerFileErrName: __dirname + '/'+  'logs/monitor_error.log',
    accessLoggerFileName: __dirname + '/'+  'logs/monitor_access.log',
    requestLoggerFileName: __dirname + '/'+  'logs/monitor_request.log',
    responseLoggerFileName: __dirname + '/'+  'logs/monitor_response.log',
    apiLoggerFileName: __dirname + '/'+  'logs/monitor_api.log',
    performanceLoggerFileName: __dirname + '/'+   'logs/performance.log',
    performanceErrLoggerFileErrName: __dirname + '/'+  'logs/performance_error.log'
  }
};

exports.config = config;
