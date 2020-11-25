import Router from 'koa-router';
import path from 'path'
import fs from 'fs'
const readdirp = require('readdirp');

function resolve(pathfile = '') {
  return path.join(__dirname, '../../../public/mockdata', pathfile)
} 
const router = new Router();

router.get('/project', async ctx => {
  let data = fs.readdirSync(resolve())
  return (ctx.body = {
    data
  });
});

router.get('/project/:project', async ctx => {
  // let data = fs.readdirSync(resolve())
  let pathes = []
  for await (const entry of readdirp(resolve(ctx.params.project))) {
    const {path} = entry;
    pathes.push(path.replace(/\\/, '/').replace(/\.json$/, ''))
  }
  return (ctx.body = {
    data: pathes
  });
});


export default router;
