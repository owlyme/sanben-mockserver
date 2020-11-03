import log4js from 'log4js';
const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { logConfig } = config;

log4js.configure(logConfig);
// 请求jave日志
const log = log4js.getLogger('app');
// 请求node日志
const httpLog = log4js.getLogger('http');
// 请求node错误日志
const errorLog = log4js.getLogger('errors');

//格式化响应日志
function formatRes(ctx, resTime) {
  let logText = '';
  //响应日志开始
  logText += '\n' + '*************** response log start ***************' + '\n';
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //响应状态码
  logText += 'response status: ' + ctx.status + '\n';
  //响应内容
  logText += 'response body: ' + '\n' + JSON.stringify(ctx.body) + '\n';
  //响应日志结束
  logText += '*************** response log end ***************' + '\n';
  return logText;
}

//格式化错误日志
function formatError(ctx, err, resTime) {
  let logText = '';
  //错误信息开始
  logText += '\n' + '*************** error log start ***************' + '\n';
  //添加请求日志
  logText += formatReqLog(ctx.request, resTime);
  //错误名称
  logText += 'err name: ' + err.name + '\n';
  //错误信息
  logText += 'err message: ' + err.message + '\n';
  //错误详情
  logText += 'err stack: ' + err.stack + '\n';

  //错误信息结束
  logText += '*************** error log end ***************' + '\n';

  return logText;
}

//格式化请求日志
function formatReqLog(req, resTime) {
  let logText = '';
  const method = req.method;
  //访问方法
  logText += 'request time stamp: ' + new Date().toLocaleString() + '\n';

  logText += 'request method: ' + method + '\n';

  //请求原始地址
  logText += 'request originalUrl:  ' + req.originalUrl + '\n';

  //客户端ip
  logText += 'request client ip:  ' + req.ip + '\n';

  //请求参数
  if (method === 'GET') {
    logText += 'request query:  ' + JSON.stringify(req.query) + '\n';
  } else {
    logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n';
  }
  //服务器响应时间
  logText += 'response time: ' + resTime + '\n';

  return logText;
}

export default {
  info(msg) {
    log.info(msg + '\n');
  },
  error(msg) {
    log.error(msg + '\n');
  },
  logError(ctx, error, resTime) {
    errorLog.error(formatError(ctx, error, resTime));
  },
  logResponse(ctx, resTime) {
    httpLog.info(formatRes(ctx, resTime));
  },
};
