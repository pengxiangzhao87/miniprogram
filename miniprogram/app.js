//app.js
App({
  globalData: {
    authorization:false,
    nickName:"",
    avatarUrl:""
  },
  onLaunch: function () {
    wx.authorize({
      scope: 'scope.userInfo'
    })
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'ourcity-develop-f6gqc',
        traceUser: true
      })
    }
    //获取用户唯一ID
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session',
            data: {
              //填上自己的小程序唯一标识
              appid: 'wx73415b963d21e2f4',
              //填上自己的小程序的 app secret
              secret: 'df90ec682c87d13f532c4479bf95eee8',
              grant_type: 'authorization_code',
              js_code: res.code
            },
            method: 'GET',
            header: { 'content-type': 'application/json' },
            success: function (openIdRes) {
              wx.setStorage({
                key: 'openId',
                data: openIdRes.data.openid,
              })
            },
            fail: function (error) {
              console.error("获取用户openId失败");
              console.error(error);
            }
          })
        }
      }
    })


    // wx.getSetting({
    //   success: (res) => { //箭头函数为了处理this的指向问题 
    //     //是否授权
    //     if (res.authSetting["scope.userInfo"]) {
    //       // 获取用户信息
    //       wx.getUserInfo({
    //         success: (res) => { //箭头函数为了处理this的指向问题
    //           this.globalData.isok = true
    //           var that = this
    //           console.log(res.userInfo); //用户信息结果
    //           wx.getStorage({
    //             key: 'unionid',
    //             success(res) {
    //               that.globalData.unionid = res.data
    //             }
    //           })
    //           this.globalData.userInfo = res.userInfo;
    //           if (this.userInfoReadyCallback) { //当index.js获取到了globalData就不需要回调函数了，所以回调函数需要做做一个判断，如果app.js中有和这个回调函数，那么就对这个函数进行调用，并将请求到的结果传到index.js中
    //             this.userInfoReadyCallback(res.userInfo);
    //           }
    //         }
    //       })
    //     }else {
    //       wx.removeStorage({
    //         key: 'unionId'
    //       })
    //     }
    //   }
    // })
  }
})
