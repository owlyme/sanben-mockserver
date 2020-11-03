import Router from 'koa-router';
import path from 'path'
import fs from 'fs-extra'

function resolve(filename) {
  return path.join(__dirname, '../../../public/mockdata', `${filename}.json`)
} 
const router = new Router();

function createJson(array) {
  return array.reduce((acc, data) => 
  {   
      let value = null;
      if ( data.data_type_value === "object") {
          value = createJson(data.value)
      } else if (data.data_type_value === "array") {
          value = data.value.map(arr_item => createJson(arr_item))
      } else {
          value = data.value
      }

      return {
          ...acc, 
          [data.key]: value,
          // data_type_value: data.data_type_value
      }
  }, {})
}

router.post('/*', async ctx => {
 
});

router.get('/*', async ctx => {
  let relativePath = ctx.url.replace(/\/api-mock\//, '')
  // let filePath = relativePath.replace(/\//g, '_')
  let filePath =resolve(relativePath)
  const {type, data} = await fs.readJson(filePath)
  let mockdata = null
  if (type === "JSON") {
    mockdata= createJson(data[0])
  } else {
    mockdata= data.map(createJson)
  }
 
  return (ctx.body = {
    code: 1,
    data: mockdata
  });
});




export default router;