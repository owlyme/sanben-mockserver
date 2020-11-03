var Crawler = require('crawler');
var fs = require('fs');
var c = new Crawler({
  encoding: null,
  jQuery: {
    name: 'cheerio',
    options: {
      normalizeWhitespace: true,
      xmlMode: true,
      decodeEntities: false,
    },
  },
  callback: function(err, res, done) {
    if (err) {
      console.error(err.stack);
      res.options.crawlerOK({
        code: 0,
        err,
      });
    } else {
      res.options.crawlerOK({
        code: 1,
        crawler: res,
      });
      fs.createWriteStream(__dirname + '/filename.html').write(res.body);
    }

    done();
  },
});

function crawler(arg = {}) {
  return new Promise(resolve => {
    c.queue({
      ...arg,
      async crawlerOK($) {
        resolve($);
      },
    });
  });
}

module.exports = crawler;

// fs.writeFileSync(
//   res.options.filename,
//   JSON.stringify({
//     title: $('h2#activity-name').text(),
//     author: $('#js_name').text(),
//     content: $('#js_content').html(),
//   })
// );

// fs.createWriteStream(res.options.filename1).write(res.body);
