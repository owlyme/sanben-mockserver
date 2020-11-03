const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '../api');

function fileList(dir) {
  return fs.readdirSync(dir).reduce((list, file) => {
    if ('index.js' === file) {
      return list;
    }
    let name = path.join(dir, file);
    let isDir = fs.statSync(name).isDirectory();
    return list.concat(isDir ? fileList(name) : [name]);
  }, []);
}

function getFilesContent(filePath) {
  return require(filePath);
}

function merge() {
  return fileList(API_DIR).reduce(
    (calc, path) => ({
      ...calc,
      [path]: getFilesContent(path),
    }),
    {}
  );
}
function mapApis(uri, apis) {
  return Object.keys(apis).reduce((calc, apiKey) => {
    if (typeof apis[apiKey] === 'object') {
      let mapModule = mapApis(uri, apis[apiKey]);
      return Object.keys(mapModule).length
        ? {
            ...calc,
            [apiKey]: mapModule,
          }
        : calc;
    } else {
      return apiKey.includes(uri)
        ? {
            ...calc,
            [apiKey]: apis[apiKey],
          }
        : calc;
    }
  }, {});
}
export default {
  apis: merge(),
  mapApis(uri) {
    return JSON.stringify(mapApis(uri, this.apis), null, 4);
  },
};
