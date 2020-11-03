import https from 'https';
import json_xml from 'json_xml';
import logger from '../utils/logUtil';
// 用于https发送xml数据
class HttpsXMLService {
  async post(data, options) {
    logger.info('web->WECHAT >>>>>> ' + '/pay/unifiedorder' + ' request params: ' + data);
    let _options = Object.assign(
      {
        host: 'api.mch.weixin.qq.com',
        path: '/pay/unifiedorder',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      },
      options
    );
    return new Promise(function(resolve) {
      const req = https.request(_options, res => {
        res.on('data', d => {
          let buf = '' + d;
          if (buf.includes('<xml>')) {
            logger.info('WECHAT->MOBILE >>>>>> ' + ' response data: ' + buf);
            resolve(json_xml.xml2json(buf).xml);
          } else {
            logger.info('WECHAT->MOBILE >>>>>> ' + ' response data: ' + buf);
            resolve(buf);
          }
        });
      });
      req.on('error', e => {
        console.error(e);
      });
      req.write(data);
      req.end();
    });
  }
}

export default new HttpsXMLService();
