import http from 'http';
import https from 'https';
import Request from 'request';
import json_xml from 'json_xml';
import logger from '../utils/logUtil';
// 用于http发送xml数据
const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { BASE_IP, PORT, NODE_ENV } = config;

function finalHttp(NODE_ENV) {
  if (NODE_ENV === 'testing') {
    return https;
  } else {
    return http;
  }
}

console.log(`To java server ip:${BASE_IP}, port: ${PORT}`);
class HttpsXMLService {
  async post(url, options) {
    logger.info(
      'NODE->JAVA >>>>>> ' + BASE_IP + PORT + '   ' + url + ' request params: ' + options.data
    );
    let _options = Object.assign(
      {
        host: BASE_IP,
        port: PORT,
        path: url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml; charset=UTF-8',
        },
      },
      options
    );
    return new Promise(function(resolve) {
      try {
        const req = finalHttp(NODE_ENV).request(_options, res => {
          res.on('data', d => {
            let buf = '' + d;
            if (buf.includes('<xml>')) {
              logger.info('JAVA-> NODE >>>>>> ' + url + ' response data: ' + buf);
              resolve(json_xml.xml2json(buf).xml);
            } else {
              logger.info('JAVA-> NODE >>>>>> ' + url + ' response data: ' + buf);
              resolve(buf);
            }
          });
        });
        req.on('error', e => {
          console.error(e);
        });
        req.write(options.data);
        req.end();
      } catch (error) {
        logger.error(`java-> NODE >>>>>> ${url} response data:${error}`);
        resolve({
          code: 110,
          data: error,
        });
      }
    });
  }
  async get(ctx, url) {
    logger.info('NODE->JAVA >>>>>> http://' + BASE_IP + PORT + '   ' + url + ' request params: ');
    return new Promise(function(resolve) {
      try {
        Request.get(
          {
            url: `http://${BASE_IP}:${PORT}${url}`,
            headers: ctx.req.headers,
          },
          (err, _res, body) => {
            if (!err && _res.statusCode == 200) {
              resolve(body);
            } else {
              logger.err(url + ' request error: ' + JSON.stringify(err));
            }
          }
        );
      } catch (error) {
        logger.error(`java->NODE >>>>>> ${url} response data:${error}`);
        resolve({
          code: 110,
          data: error,
        });
      }
    });
  }
}

export default new HttpsXMLService();
