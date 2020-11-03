import fdfsClient from '../services/fastdfs/fdfsClient';

class UploadService {
  // 上传
  async upload(filePath) {
    try {
      const fileId = await fdfsClient.upload(filePath);
      return { code: 1, message: '上传成功', data: fileId };
    } catch (e) {
      return { code: 0, message: '上传失败', data: null };
    }
  }
  async download(fileId) {
    try {
      console.log(fileId);
      const file = await fdfsClient.download(fileId);
      return file;
    } catch (e) {
      return { code: 110, message: '下载失败' };
    }
  }
  async del(fileId) {
    try {
      const file = await fdfsClient.del(fileId);
      return { code: 1, data: file };
    } catch (e) {
      return { code: 110, message: '删除失败' };
    }
  }
}

export default new UploadService();
