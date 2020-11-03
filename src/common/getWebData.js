const http = require('http');
const https = require('https');

class GetWebData {
  getFdfsImg(fileId) {
    // fdfs 静态资源地址http://192.168.0.244:8888/
    return new Promise((reslove, reject) => {
      try {
        http.get('http://192.168.0.244:8888/' + fileId, function(_res) {
          var chunks = [];
          var size = 0;
          _res.on('data', function(chunk) {
            chunks.push(chunk);
            size += chunk.length;
          });
          _res.on('end', function(err) {
            if (err) reject(err);
            var data = Buffer.concat(chunks, size);

            reslove(data);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  httpGet(path) {
    return new Promise((reslove, reject) => {
      try {
        if (!path) throw '路径错误';
        http.get(path, function(_res) {
          var chunks = [];
          var size = 0;
          _res.on('data', function(chunk) {
            chunks.push(chunk);
            size += chunk.length;
          });
          _res.on('end', function(err) {
            if (err) throw err;
            var data = Buffer.concat(chunks, size);
            reslove(data);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
  httpsGet(path) {
    return new Promise((reslove, reject) => {
      try {
        if (!path) throw '路径错误';
        https.get(path, function(_res) {
          var chunks = [];
          var size = 0;
          _res.on('data', function(chunk) {
            chunks.push(chunk);
            size += chunk.length;
          });
          _res.on('end', function(err) {
            if (err) throw err;
            var data = Buffer.concat(chunks, size);
            // var base64Img = data.toString("base64");
            reslove(data);
          });
        });
      } catch (err) {
        reject(err);
      }
    });
  }
}

export default new GetWebData();
