//app.js
App({
  globalData:{
    isMerchant:false,
    nickName:"",
    avatarUrl:""
  },
  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'ourcity-develop-f6gqc',
        traceUser: true,
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
                key: 'openid',
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
  },

  onShow:function(){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          var db = wx.cloud.database();
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.info("onshow")
              wx.getStorage({
                key: 'openid',
                success: function (res) {
                  db.collection("user_info").where({
                      openid: res.data
                  }).get({
                    success:res=>{
                      if(res.data.isMerchant=='0'){
                        wx.switchTab({
                          url: '/pages/publish/publish',
                        })
                      }else{
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        } else {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
  }
})
