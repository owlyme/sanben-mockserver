import Router from 'koa-router';
import wxArticle from './wxArticle';
const router = new Router();

// 微信相关接口
router.use('/api/wxArticle', wxArticle.routes(), wxArticle.allowedMethods());

export default function(app) {
  app.use(router.routes(), router.allowedMethods());
}
