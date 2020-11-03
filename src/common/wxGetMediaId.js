import fs from 'fs';
import request from 'request';
import logger from '../utils/logUtil';
import proxyService from '../common/proxyService';

export default async function wxUpload(filePath, type, ctx, params, origin) {
  origin = origin || 'admin';
  const uploadUrlMap = {
    admin: '/cos/getWXUploadUrl',
    webchat: '/xds/chat/getWXUploadUrl',
  };
  const getUploadUrl = uploadUrlMap[origin];
  const form = {
    //构造表单
    media: fs.createReadStream(filePath),
  };

  if (type === 'video') {
    let description = {
      introduction: params.desc,
      title: params.title,
    };
    form.description = JSON.stringify(description);
  }

  const newParams = {
    appAccountId: params.appAccountId,
    sessionId: params.sessionId,
    cosServiceType: type,
    groupType: params.groupType || 0,
  };
  const url = await proxyService
    .postProxy(ctx, getUploadUrl, { params: newParams })
    .then(data => data.data);
  // const url = `https://api.weixin.qq.com/cgi-bin/material/add_material?access_token=${accessToken}&type=${type}`;
  return new Promise(resolve => {
    logger.info(
      `web->微信素材库 get media id >>>>> ${url} request params: ${JSON.stringify({ url, type })}`
    ); // 请求日志
    try {
      request.post({ url: url, formData: form }, function(err, httpResponse, body) {
        // 异步删除文件
        fs.unlink(filePath, err => {
          console.log(err);
        });
        if (err) {
          logger.error(
            `微信素材库1 get media id ->node >>>>>> ${url} response data:${JSON.stringify(
              err.message
            )}`
          ); // 响应日志
          resolve({ code: 0 });
        } else {
          if (body.errcode) {
            logger.error(
              `微信素材库2 get media id ->node >>>>>> ${url} response data:${JSON.stringify(body)}`
            ); // 响应日志
            resolve({ code: 0 });
          } else {
            logger.info(
              `微信素材库3 get media id ->node >>>>>> ${url} response data:${JSON.stringify(body)}`
            ); // 响应日志
            const newRes = JSON.parse(body);
            resolve({ code: 1, wxUrl: newRes['url'], mediaId: newRes['media_id'] });
          }
        }
      });
    } catch (error) {
      logger.error(
        `微信素材库4 get media id ->node >>>>>> ${url} response data:${JSON.stringify(error)}`
      ); // 响应日志
      resolve({ code: 0 });
    }
  });
}
