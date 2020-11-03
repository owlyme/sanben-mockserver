const crypto = require('crypto');
const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { wx } = config;
// 随机字符串
var createNonceStr = function() {
  return Math.random()
    .toString(36)
    .substr(2, 15);
};

// 时间戳
var createTimestamp = function() {
  return parseInt(new Date().getTime() / 1000) + '';
};

// json转字符串
var raw = function(args) {
  var keys = Object.keys(args);
  keys = keys.sort();
  var newArgs = {};
  keys.forEach(function(key) {
    newArgs[key] = args[key];
  });

  var string = '';
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k];
  }
  string = string.substr(1);
  return string;
};

/**
 * @synopsis 签名算法
 *
 * @param jsapi_ticket 用于签名的 jsapi_ticket
 * @param url 用于签名的 url ，注意必须动态获取，不能 hardcode
 *
 * @returns
 */
var sign = function(prepay_id) {
  var ret = {
    appId: wx.appId,
    nonceStr: createNonceStr(),
    timeStamp: createTimestamp(),
    signType: 'MD5',
    package: 'prepay_id=' + prepay_id,
  };
  var string = raw(ret) + '&key=' + wx.paySecret;
  const md5 = crypto.createHash('md5');
  md5.update(string);
  ret.paySign = md5.digest('hex').toUpperCase();
  return ret;
};

module.exports = sign;
