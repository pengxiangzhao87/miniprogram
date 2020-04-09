var db = wx.cloud.database();
Component({
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
     
  },
  pageLifetimes: {
    show() {
      
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    orderTypeList: [],
    userInfoId: null,
    hiddenFlag:false,
    checkBox:[],
    authHidden:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    userEnter:function(e){
      var that = this;
      db.collection('order_type').get({
        success: function (res) {
          console.info(res)
          that.setData({
            orderTypeList: res.data,
            hiddenFlag: true
          })
        }
      })
    },
    checkboxChange:function(e){
      this.setData({
        checkBox:e.detail.value
      })
    },

    chooseClassify:function(){
      var orderType = '';
      var checkbox = this.data.checkBox;
      for (var index in checkbox){
        orderType += checkbox[index]+',';
      }
      db.collection("user_info").doc(this.data.userInfoId).update({
        data:{
          order_type: orderType.substr(0,orderType.length-1)
        },success:res=>{
          this.setData({
            authHidden:true
          })
        }
      })


    },
    cancelClassify:function(){

    },
    userEnter: function (e) {
      var that = this;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                var role = e.target.dataset.role;
                //增加用户信息
                db.collection("user_info").add({
                  data: {
                    nickName: res.userInfo.nickName,
                    gender: res.userInfo.gender,
                    province: res.userInfo.province,
                    city: res.userInfo.city,
                    avatarUrl: res.userInfo.avatarUrl,
                    role: role
                  },
                  success: res => {
                    var userInfoId = res._id;
                    wx.setStorage({
                      key: 'role',
                      data: role,
                    })
                    db.collection('order_type').get({
                      success: function (res) {
                        that.setData({
                          orderTypeList: res.data,
                          hiddenFlag: true,
                          userInfoId: userInfoId
                        })
                      }
                    })
                  }
                })
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
              }
            })
          } else {
            wx.showModal({
              title: '警告',
              content: '您拒绝授权，无法进入小程序',
              showCancel: false,
              confirmText: '返回授权',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击了“返回授权”')
                }
              }
            })
          }
        }
      })

    }
  }
})