import Router from "koa-router";
import path from "path";
const formidable = require("formidable");
const fs = require("fs-extra");
const router = new Router();
const uploadDir = filename =>
  path.join(__dirname, "../../../public/upload", `${filename}`);
function resolve(filename) {
  return path.join(__dirname, "../../../public/mockdata", `${filename}.json`);
}

router.post("/create", async ctx => {
  let { api, mockData } = ctx.requestParams;
  let filePath = resolve(api);
  let res = fs.ensureFileSync(filePath);
  res = await fs.writeJson(filePath, mockData);
  return (ctx.body = res);
});

router.get("/modify", async ctx => {
  return (ctx.body = response);
});

const form = formidable({
  multiples: true,
  uploadDir: uploadDir("/")
});

function savefile(ctx) {
  return new Promise(resolve => {
    fs.ensureDirSync(uploadDir("/"));
    form.parse(ctx.req, (err, fields, files) => {
      if (err) {
        resolve({
          code: 0,
          err
        });
      }
      const { name, path } = files.file;

      try {
        fs.moveSync(path, uploadDir(name), { overwrite: true });
        resolve({
          code: 200,
          path: `/public/upload/${name}`
        });
      } catch (e) {
        resolve({
          code: 0,
          path: e.message
        });
      }
    });
  });
}

function removeFile() {
  try {
    fs.removeSync(uploadDir(""));
  } catch (e) {
    console.log(e);
  }
}

function timingClearUpload() {
  setTimeout(() => {
    let h = new Date().getHours();
    if (h >= 2 && h <= 5) {
      removeFile();
    }
    timingClearUpload();
  }, 1 * 60 * 60 * 1000);
}

timingClearUpload();

router.post("/upload", async ctx => {
  try {
    let res = await savefile(ctx);

    return (ctx.body = res);
  } catch (e) {
    return (ctx.body = e.message);
  }
});

export default router;
