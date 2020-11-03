const crawler = require('./index');

async function getMpWXArticle(uri) {
  if (!uri) {
    return {
      code: 0,
      message: 'url不能为空',
    };
  }

  let res = await crawler({
    uri: uri,
  });

  if (res.code === 1) {
    let $ = res.crawler.$;
    try {
      return {
        code: 1,
        data: {
          title: ($('h2#activity-name').text() || '').trim().replace(/\n/g, ''),
          author: ($('#js_name').text() || '').trim().replace(/\n/g, ''),
          contentText: ($('#js_content').text() || '').trim().replace(/\n/g, ''),
          contentHtml: ($('#js_content').html() || '')
            .replace(/\n/g, '')
            .replace(/data-src/g, 'src'),
        },
        message: '获取成功',
      };
    } catch (err) {
      return {
        code: 0,
        error: err,
        message: '获取失败',
      };
    }
  } else {
    return {
      code: 0,
      error: res.err,
      message: '获取失败',
    };
  }
}
// getMpWXArticle();
module.exports = getMpWXArticle;
