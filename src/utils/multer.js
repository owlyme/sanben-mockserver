import multer from 'koa-multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.resolve(__dirname, '../../cacheFiles'));
  },
  filename: function(ctx, file, cb) {
    // const fileFormat = file.originalname.split('.');
    cb(null, file.originalname);
  },
});
// 设置有存储路径的上传中间件
export default multer({ storage: storage });
