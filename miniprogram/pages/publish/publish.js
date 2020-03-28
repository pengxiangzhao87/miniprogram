var app = getApp();

Page({
  data: {

  },
  onLoad: function () {
    
  },
  onReady: function () {
    wx.getSetting({
      success: (res) => {
        //是否授权
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: (res) => {
              app.globalData.authorization = true;
              app.globalData.nickName = res.userInfo.nickName;
              app.globalData.avatarUrl = res.userInfo.avatarUrl;
            }
          })
        } else {
          console.info("a")
          wx.removeStorage({
            key: 'unionId'
          })
          // 获得dialog组件
          this.userInfo = this.selectComponent("#getUserInfo");
          this.userInfo.show()
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
    //           // this.globalData.isok = true
    //           // var that = this
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
          
    //     }
    //   }
    // })
  }


})