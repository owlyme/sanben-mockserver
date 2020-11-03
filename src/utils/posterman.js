const request = require('request');
const sessionId = 'L1dPDNYKXNsYebPO4YVTwczTJUMgCJj3';

//get角色数据option
let roleOptions = {
  method: 'post',
  url: 'https://apitest.xingke100.com/apimanage/auth/queryAuthRole',
  form: {
    offset: 0,
    limit: 100,
    subSystem: 'PC_WEB_ADMIN_2',
    busiType: 'XDS',
    sessionId: sessionId,
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

//get菜单数据option
let menuOptions = {
  method: 'post',
  url: 'https://apitest.xingke100.com/apimanage/auth/queryAuthMenuTreeBySubSystemAndBusiType',
  form: {
    subSystem: 'PC_WEB_ADMIN_2',
    busiType: 'XDS',
    sessionId: sessionId,
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

//get权限数据option
let authOptions = {
  method: 'post',
  url: 'https://apitest.xingke100.com/apimanage/auth/queryAuthItem',
  form: {
    offset: 0,
    limit: 100,
    subSystem: 'PC_WEB_ADMIN_2',
    sessionId: sessionId,
  },
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

//角色数据
let promiseRole = new Promise((resolve, reject) => {
  request(roleOptions, function(err, res, body) {
    if (err) {
      reject(err);
    } else {
      //  格式
      //   [{
      //     roleId: 1298,
      //     roleName: '我的服务',
      //     groupName: '概况',
      //     ...
      //   }]
      //
      resolve(JSON.parse(body).data.records);
    }
  });
});
//菜单数据
let promiseMenu = new Promise((resolve, reject) => {
  request(menuOptions, function(err, res, body) {
    if (err) {
      reject(err);
    } else {
      // 格式
      // [{
      //     menuId: 10425,
      //     menuName: '我的服务',
      //     menuLevel: 2,
      //     subMenu:[]
      //     ...
      // }]
      resolve(JSON.parse(body).data);
    }
  });
});
//权限数据
let promiseAuth = new Promise((resolve, reject) => {
  request(authOptions, function(err, res, body) {
    if (err) {
      reject(err);
    } else {
      // 格式
      // [{
      //   itemId: 10831,
      //   itemName: '收款配置-企业设置',
      //   uri: '',
      //   subSystem: 11,
      //   itemDesc: '',
      //   showUri: 'T',
      //   showInMenu: 'T',
      //   itemOrder: 0,
      //   itemPosition: ''
      // }]
      resolve(JSON.parse(body).data.records);
    }
  });
});

/***************数据处理*************************/

Promise.all([promiseMenu, promiseAuth, promiseRole]).then(res => {
  let authMap = {};
  res[1].forEach(item => {
    authMap[item.itemName.trim()] = item.itemId;
  });
  //给菜单加权限
  let menuArr = res[0];
  recursive(authMap, menuArr);

  //给角色加权限
  doAddRoleAuth(authMap, res[2]);
});

/**
 * 递归处理菜单
 */
function recursive(authMap, menuArr, from = '') {
  menuArr.forEach(v => {
    let authId;
    if (v.menuLevel === 1) {
      from = v.menuName;
      authId = authMap[v.menuName.trim()];
    } else {
      authId = authMap[v.menuName.trim() + '-' + from];
    }
    let menuId = v.menuId;
    doAddMenuAuth(authId, menuId);
    v.subMenu && Array.isArray(v.subMenu) && recursive(authMap, v.subMenu, from);
  });
}

/**
 * 给菜单加权限
 */
function doAddMenuAuth(authId, menuId) {
  let options = {
    method: 'post',
    url: 'https://apitest.xingke100.com/apimanage/auth/saveAuthMenuItem',
    form: {
      itemIds: [authId],
      menuId: menuId,
      sessionId: sessionId,
    },
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };

  request(options, function(err, res, body) {
    if (err) {
      console.log(err);
    } else {
      console.log(body);
    }
  });
}

/**
 * 给角色添加权限
 */
function doAddRoleAuth(authMap, roleArr) {
  roleArr.forEach(function(item) {
    let authId = authMap[item.roleName + '-' + item.groupName]
      ? authMap[item.roleName + '-' + item.groupName]
      : authMap[item.roleName];
    let options = {
      method: 'post',
      url: 'https://apitest.xingke100.com/apimanage/auth/saveOrUpdateAuthRoleItem',
      form: {
        itemIds: [authId],
        roleId: item.roleId,
        sessionId: sessionId,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    request(options, function(err, res, body) {
      if (err) {
        console.log(err);
      } else {
        console.log(body);
      }
    });
  });
}
