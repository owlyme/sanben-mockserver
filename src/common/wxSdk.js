import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import fetch from '../utils/request';
const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { wx } = config;

class SDK {
  constructor(appId, appSecret) {
    this.appId = appId;
    this.appSecret = appSecret;
  }
  async getSignPackage(url) {
    const instance = this;
    const jsApiTicket = await this.getJsApiTicket();
    const nonceStr = this.createNonceStr();
    const timestamp = Math.round(Date.now() / 1000);
    // 生成签名
    const rawJson = {
      jsapi_ticket: jsApiTicket,
      noncestr: nonceStr,
      timestamp: timestamp,
      url: url,
    };
    const rawString = this.raw(rawJson);
    const hash = crypto.createHash('sha1');
    const signature = hash.update(rawString).digest('hex');
    return {
      timestamp,
      url,
      signature,
      nonceStr,
      appId: instance.appId,
    };
  }
  async getJsApiTicket() {
    const cacheFile = '.jsapiticket.json';
    const instance = this;
    let data = instance.readCacheFile(cacheFile);
    const time = Math.round(Date.now() / 1000);
    if (typeof data.expireTime === 'undefined' || data.expireTime < time) {
      const accessToken = await instance.getAccessToken();
      const url = `https://api.weixin.qq.com/cgi-bin/ticket/getticket?type=jsapi&access_token=${accessToken}`;
      const ticket = await fetch
        .get(url)
        .then(response => response.data)
        .catch(error => {
          if (error.code) {
            return error;
          }
          return error;
        });
      try {
        data = ticket;
        instance.writeCacheFile(cacheFile, {
          expireTime: Math.round(Date.now() / 1000) + 7200 * 0.9,
          jsApiTicket: data.ticket,
        });
        return data.ticket;
      } catch (e) {
        return null;
      }
    } else {
      return data.jsApiTicket;
    }
  }
  async getAccessToken() {
    const cacheFile = '.accesstoken.json';
    const intance = this;
    let data = intance.readCacheFile(cacheFile);
    const time = Math.round(Date.now() / 1000);
    if (typeof data.expireTime === 'undefined' || data.expireTime < time) {
      const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${
        this.appId
      }&secret=${this.appSecret}`;
      const res = await fetch
        .get(url)
        .then(response => response.data)
        .catch(error => {
          console.log(error);
          if (error.code) {
            return error;
          }
          return error;
        });
      try {
        data = res;
        intance.writeCacheFile(cacheFile, {
          expireTime: Math.round(Date.now() / 1000) + 7200 * 0.9,
          accessToken: data.access_token,
        });
        return data.access_token;
      } catch (e) {
        return null;
      }
    } else {
      return data.accessToken;
    }
  }
  createNonceStr() {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let str = '';
    for (let i = 0; i < chars.length; i += 1) {
      str += chars.substr(Math.round(Math.random() * chars.length), 1);
    }
    return str;
  }
  // 从文件里面读取缓存
  readCacheFile(filename) {
    try {
      const data = fs.readFileSync(path.resolve(__dirname, `../../cacheFiles/${filename}`));
      return JSON.parse(data);
    } catch (e) {
      return {};
    }
  }
  // 往文件里面写缓存
  writeCacheFile(filename, data) {
    const file = path.resolve(__dirname, `../../cacheFiles/${filename}`);
    return fs.writeFileSync(file, JSON.stringify(data));
  }
  // 将json生成排序字符串
  raw(args) {
    var keys = Object.keys(args);
    keys = keys.sort();
    var newArgs = {};
    keys.forEach(function(key) {
      newArgs[key.toLowerCase()] = args[key];
    });

    var string = '';
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k];
    }
    string = string.substr(1);
    return string;
  }
}

module.exports = new SDK(wx.appId, wx.secret);
