import Router from 'koa-router';
import create from './create';
import getMock from './getMock';
const router = new Router();

// 微信相关接口
router.use('/api', create.routes(), create.allowedMethods());
router.use('/api-mock', getMock.routes(), getMock.allowedMethods());
export default function(app) {
  app.use(router.routes(), router.allowedMethods());
}
