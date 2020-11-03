// 移除get请求中的timestamp
export async function removeTimestamp(ctx, next) {
  const query = ctx.request.query;
  if (ctx.method === 'GET' && !ctx.url.includes('xkdata-web/wechatNotify')) {
    delete query.timestamp;
  }
  ctx.request.query = query;
  await next();
}
export function queryToString(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function(key) {
    let k = key.replace(/(\[\])$/, '');
    newArgs[k] = args[key];
  });
  let str = '?';
  for (let k in newArgs) {
    if (newArgs[k] !== null && newArgs[k] !== undefined) {
      str += k + '=' + newArgs[k] + '&';
    }
  }
  str = str.slice(0, -1);
  return str;
}
// 获取get或者post的请求参数并统一保存
export async function getRequestParams(ctx, next) {
  let requestParams = {};
  if (ctx.method === 'GET') {
    if (ctx.request.query.offset) {
      ctx.request.query.offset = parseInt(ctx.request.query.offset);
    }
    if (ctx.request.query.limit) {
      ctx.request.query.limit = parseInt(ctx.request.query.limit);
    }
    if (ctx.request.query.appAccountId) {
      ctx.request.query.appAccountId = parseInt(ctx.request.query.appAccountId);
    }
    requestParams = ctx.request.query;
  } else {
    requestParams = ctx.request.body;
  }
  ctx.requestParams = requestParams || {};
  await next();
}

// 设置sesssionId到请求参数中（使用在manage运营端）
export async function setSessionIdToRequestParams(ctx, next) {
  ctx.requestParams = {
    ...ctx.requestParams,
    // sessionId: ctx.sessionId,
  };
  await next();
}

// 有些接口不要sessionid
export async function removeSessionId(ctx, next) {
  // delete ctx.requestParams.sessionId;
  ctx.requestParams = {
    ...ctx.requestParams,
  };
  await next();
}
