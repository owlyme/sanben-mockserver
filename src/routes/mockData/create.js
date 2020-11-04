import Router from 'koa-router';
import path from 'path'
import createfile from '../../utils/createfile'
const fs = require('fs-extra')
const router = new Router();

function resolve(filename) {
  return path.join(__dirname, '../../../public/mockdata', `${filename}.json`)
} 

router.post('/create', async ctx => {
  console.log(ctx.requestParams)
  let {api, mockData}  = ctx.requestParams
  // let res = await createfile(resolve(api), mockData)
  let filePath = resolve(api)
  let res = fs.ensureFileSync(filePath)
  res = await fs.writeJson(filePath, mockData)
  return (ctx.body = {
    code: 1
  });
});

router.get('/modify', async ctx => {
  
  return (ctx.body = response);
});



export default router;
