const path = require('path');
const fs = require('fs');
const request = require('request');
const _filePath = path.resolve(__dirname, '../../public');

export async function downloadNetSource(url) {
  return new Promise(resolve => {
    try {
      const filename = url.split('/').pop();
      const writeStream = fs.createWriteStream(path.resolve(__dirname, '../../public', filename));
      fs.exists(_filePath, function(exists) {
        if (exists) {
          request(url).pipe(writeStream);
        } else {
          fs.mkdir(_filePath, function() {
            request(url).pipe(writeStream);
          });
        }
      });
      writeStream.on('finish', () => {
        resolve(path.resolve(__dirname, '../../public', filename));
      });
    } catch (err) {
      resolve({ code: 0, message: err });
    }
  });
}
