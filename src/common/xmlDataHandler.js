import logger from '../utils/logUtil';
const json_xml = require('json_xml');
class XmlDataHandler {
  async getXmlData(ctx, type) {
    return new Promise(resolve => {
      let buf = '';
      // ctx.req.setEncoding('utf8');
      ctx.req.on('data', chunk => {
        buf += chunk;
      });
      ctx.req.on('end', () => {
        logger.info(`WECHAT->NODE >>>>>> ${ctx.url} response data:${buf}`); // 响应日志
        if (type === 'xml') {
          resolve(buf);
        } else {
          resolve(json_xml.xml2json(buf).xml);
        }
      });
    });
  }

  postXmlData(data) {
    // ctx.res.setHeader('Content-Type', 'application/xml');
    const xmlData = json_xml.json2xml({
      xml: data,
    });
    return xmlData;
    // ctx.res.end(xmlData)
  }
}
export default new XmlDataHandler();
