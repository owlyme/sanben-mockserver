import Router from 'koa-router';
import proxyService from '../../common/proxyService';

const router = new Router();

router.get('/getArticleInfo', async ctx => {
  const response = await proxyService.postProxy(ctx, getArticleInfo);
  return (ctx.body = response);
});

export default router;
