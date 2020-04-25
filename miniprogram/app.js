//app.js
App({
  globalData:{
    isMerchant:false,
    nickName:"",
    avatarUrl:"",
    list: []  //存放tabBar的数据 
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
        env: 'findgoods-ox7sn',
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
              appid: 'wxc155e0cb5efbf766',
              //填上自己的小程序的 app secret
              secret: '5f04e2a6ba7c110b30986d3aeb9ba0ac',
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
  }
   
})
