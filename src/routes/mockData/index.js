import Router from 'koa-router';
import create from './create';
import getMock from './getMock';
import mockPage from './mockPage';
const router = new Router();

router.use('/api', create.routes(), create.allowedMethods());
router.use('/api-mock', getMock.routes(), getMock.allowedMethods());
router.use('/mock', mockPage.routes(), mockPage.allowedMethods());
export default function(app) {
  app.use(router.routes(), router.allowedMethods());
}
