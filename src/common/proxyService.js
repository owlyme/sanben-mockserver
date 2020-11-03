import request from '../utils/request';
import logger from '../utils/logUtil';
import Mock from 'mockjs';

const config = require('config-lite')({
  filename: 'default',
  config_basedir: __dirname,
  config_dir: 'config',
});
const { BASE_URL, Mock_URL, mockList, CRAWLER_URL } = config;

class ProxyService {
  /**
   * @param  {Object} ctx 请求上下文
   * @param  {String} url 请求地址
   * @param  {Object} options 请求可选项
   */
  async postProxy(
    ctx,
    url,
    options = {
      origin: 'MOBILE',
    }
  ) {
    options.params = options.params || ctx.requestParams || {};
    options.origin = options.origin || 'MOBILE';
    let isMock = mockList.includes(url);
    if (!url.includes('http://') && !url.includes('https://')) {
      url = isMock ? `${Mock_URL}${url}` : `${BASE_URL}${url}`;
    }

    logger.info(
      `web->${options.origin} >>>>>> ${url} request params: ${JSON.stringify(options.params)}`
    ); // 请求日志

    try {
      const response = await request.post(url, options.params).then(res => res.data);

      logger.info(
        `java->${options.origin} >>>>>> ${url} response data:${JSON.stringify(response)}`
      ); // 响应日志
      return response;
    } catch (error) {
      logger.error(`java->${options.origin} >>>>>> ${url} response data:${JSON.stringify(error)}`); // 响应日志
      return {
        code: 110,
        message: '操作错误',
      };
    }
  }
  async getProxy(ctx, url, options) {
    options.params = options.params || ctx.request.query || {};
    options.origin = options.origin || 'MOBILE';
    options.isMock = options.isMock || false;
    if (!url.includes('http://') && !url.includes('https://')) {
      url = options.isMock ? `${Mock_URL}${url}` : `${BASE_URL}${url}`;
    }
    logger.info(
      `web->${options.origin} >>>>>> ${url} request params: ${JSON.stringify(options.params)}`
    ); // 请求日志
    try {
      const response = await request
        .get(url, {
          params: options.params,
        })
        .then(res => res.data);
      logger.info(
        `java->${options.origin} >>>>>> ${url} response data:${JSON.stringify(response)}`
      ); // 响应日志
      return response;
    } catch (error) {
      logger.error(`java->${options.origin} >>>>>> ${url} response data:${JSON.stringify(error)}`); // 响应日志
      return {
        code: 110,
        message: '操作错误',
      };
    }
  }

  async postCrawlerProxy(ctx, url) {
    let crawlerUrl = `${CRAWLER_URL}${url}`;
    let params = ctx.requestParams || {};
    logger.info(`web-> carwler >>>>>> ${crawlerUrl} request params: ${JSON.stringify(params)}`); // 请求日志
    //
    try {
      const response = await request.post(crawlerUrl, params).then(res => res.data);
      logger.info(`java->carwler >>>>>> ${crawlerUrl}$ response data:${JSON.stringify(response)}`); // 响应日志
      return response;
    } catch (error) {
      logger.error(`java->carwler >>>>>> ${crawlerUrl} response data:${JSON.stringify(error)}`); // 响应日志
      return {
        code: 110,
        message: '操作错误',
      };
    }
  }

  async mockData(mockData) {
    return new Promise(resolve => {
      let data = Mock.mock({
        code: 1,
        message: 'mock data success',
        data: {
          'records|10': [
            {
              'id|+1': 1,
            },
          ],
        },
        ...mockData,
      });
      resolve(data);
    });
  }
}
export default new ProxyService();
