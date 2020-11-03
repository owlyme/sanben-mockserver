module.exports = {
  NODE_ENV: 'development',

  // log4js相关配置
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
        level: 'DEBUG',
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
    level: 'deug',
  },
};
