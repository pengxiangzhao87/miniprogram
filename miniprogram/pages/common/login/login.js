var app = getApp();

Page({
  data:{

  },
  onLoad:function(){
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
              wx.getStorage({
                key: 'openid',
                success: function (res) {
                  db.collection("user_role").where({
                    '_openid': res.data
                  }).get({
                    success: res => {
                      wx.setStorage({
                        key: 'role',
                        data: res.data[0].role
                      })
                      wx.redirectTo({
                        url: '/pages/tabbar/tabbar',
                      })
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  userEnter:function(e){
    var role = e.target.dataset.role;
    var db = wx.cloud.database();
    db.collection("user_role").add({
      data: {
        role: role
      },
      success: res => {
        wx.setStorage({
          key: 'role',
          data: role,
        })
        wx.redirectTo({
          url: '/pages/tabbar/tabbar'
        })
      }
    })
  }

})