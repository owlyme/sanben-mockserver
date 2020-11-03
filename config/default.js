const path = require('path');
module.exports = {
  NODE_ENV: 'development',

  logConfig: {
    appenders: {
      http: {
        type: 'dateFile',
        filename: 'logs/access.log',
        pattern: '-yyyy-MM-dd',
        category: 'http',
      },
      app: {
        type: 'file',
        filename: 'logs/app.log',
        maxLogSize: 10485760,
        numBackups: 3,
      },
      errorFile: {
        type: 'file',
        filename: 'logs/errors.log',
      },
      errors: {
        type: 'logLevelFilter',
        level: 'ERROR',
        appender: 'errorFile',
      },
    },
    categories: {
      default: {
        appenders: ['app', 'errors'],
        level: 'DEBUG',
      },
      http: {
        appenders: ['http'],
        level: 'DEBUG',
      },
    },
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    level: 'debug',
  },
  cachePath: path.resolve(__dirname, '../cacheFiles'),
  publicPath: path.resolve(__dirname, '../public'),
  // 本地mock接口列表
  mockList: [],
};
