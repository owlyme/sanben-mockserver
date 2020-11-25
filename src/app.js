import Koa from 'koa';
import cors from 'koa-cors';
import onerror from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import json from 'koa-json';
import path from 'path';
import logger from 'koa-logger'; // 代替console
import convert from 'koa-convert';
import compress from 'koa-compress';
import logUtil from './utils/logUtil';
import fs from 'fs';
import {getRequestParams} from './middlewares'
// 接口服务
import mockData from './routes/mockData';

// 缓存文件
const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { cachePath, publicPath } = config;
// 项目目录初始化
if (!fs.existsSync(cachePath)) {
  fs.mkdirSync(cachePath);
}
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath);
}

const app = new Koa();
// error handler
onerror(app);

// middlewares
app.use(
  convert(
    cors({
      origin: '*',
      exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
      maxAge: 2592000000, // 30天
      credentials: true,
      allowMethods: ['GET', 'POST', 'DELETE'],
      allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
    })
  )
);
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
);

app.use(json());
app.use(convert(logger()));
app.use(require('koa-static')(path.resolve(__dirname, '../public')));
app.use(require('koa-favicon')(path.resolve(__dirname, '../public/favicon.ico')));
app.use(
  compress({
    filter: function(content_type) {
      return /json/i.test(content_type);
    },
    threshold: 2048, // 大于2kb
    flush: require('zlib').Z_SYNC_FLUSH,
  })
);

// 监听日志
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  try {
    // 记录请求响应日志
    logUtil.logResponse(ctx, ms);
  } catch (error) {
    // 记录异常日志
    logUtil.logError(ctx, error, ms);
  }
});
// 自定义中间件
app.use(getRequestParams);
mockData(app)

// error-handling
app.on('error', (err, ctx) => {
  console.log(err)
  // logger.error('server error', err, ctx);
});

module.exports = app;
