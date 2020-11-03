// 生成随机数
export function genUUID(len) {
  len = len || 6;
  len = parseInt(len, 10);
  len = isNaN(len) ? 6 : len;
  var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ';
  var seedLen = seed.length - 1;
  var uuid = '';
  while (len--) {
    uuid += seed[Math.round(Math.random() * seedLen)];
  }
  return uuid;
}
// 数据转换
export function transformData(obj, rules = {}, reverse, subobj) {
  /**
   * obj: 数据 object / array 类型
   * rules：需要将相关将属性转换的规则；{ 当前属性名：改变后属性名}
   * subobj： 树的子节点属性名
   * reverse: 翻转将属性转换的规则
   */

  // obj 非Object、Array直接返回
  if (typeof obj !== 'object') {
    return obj;
  }

  // obj 为Object、Array的情况下
  const reverseRules = {};
  if (reverse) {
    Object.entries(rules).forEach(item => {
      reverseRules[item[1]] = item[0];
    });
    rules = reverseRules;
  }
  const transform = function(_obj, _rules, _subobj) {
    const temp = {};
    Object.entries(_rules).forEach(item => {
      const key = item[0];
      const value = item[1];
      if (key === _subobj && _obj[key]) {
        if (Array.isArray(_obj[key])) {
          temp[value] = [];
          _obj[key].forEach(_item => {
            temp[_rules[key]].push(transform(_item, _rules, _subobj));
          });
        } else {
          temp[_rules[key]] = transform(_obj[key], _rules, _subobj);
        }
      } else {
        temp[value] = _obj[key];
      }
    });
    return temp;
  };
  if (Array.isArray(obj)) {
    return obj.map(item => transform(item, rules, subobj));
  }
  return transform(obj, rules, subobj);
}

// 将base64格式的图片转化成buffer
export function base64String(base64String) {
  let src_str = base64String,
    base64 = src_str.replace(
      /^data:image\/png;base64,|^data:image\/jpg;base64,|^data:image\/jpg;base64,|^data:image\/bmp;base64,/,
      ''
    ),
    byteLength = Buffer.byteLength(base64, 'base64'),
    buf = Buffer.alloc(byteLength, base64, 'base64');

  return buf;
}
