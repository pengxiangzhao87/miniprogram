var util = require('../../../utils/util.js')
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
      wx.hideHomeButton();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    userInfo:{},
    orderTypeList: [],
    hiddenFlag:false,
    checkBox:[],
    role:null,
    authHidden:false,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    checkboxChange:function(e){
      this.setData({
        checkBox:e.detail.value
      })
    },

    chooseClassify:function(){
      var that = this;
      var orderType = '';
      var checkbox = this.data.checkBox;
      if (checkbox.length==0){
        wx.showToast({
          title: '请选择至少一项',
          duration: 1000
        })
      }
      for (var index in checkbox){
        orderType += checkbox[index]+',';
      }
      orderType = orderType.substr(0, orderType.length - 1);
      // 已经授权
      var userInfo = that.data.userInfo;
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          db.collection("user_info").where({
            _openid: res.data
          }).get({
            success: res => {
              console.info('length',res)
              if (res.data.length == 0) {
                //增加用户信息
                db.collection("user_info").add({
                  data: {
                    nickName: userInfo.nickName,
                    gender: userInfo.gender,
                    province: userInfo.province,
                    city: userInfo.city,
                    avatarUrl: userInfo.avatarUrl,
                    role: that.data.role,
                    order_type: orderType
                  },
                  success: res => {

                    wx.setStorage({
                      key: 'role',
                      data: role,
                    })
                    
                  }
                })
              } else {
                db.collection("user_info").doc(res.data[0]._id).update({
                  data: {
                    nickName: userInfo.nickName,
                    gender: userInfo.gender,
                    province: userInfo.province,
                    city: userInfo.city,
                    avatarUrl: userInfo.avatarUrl,
                    role: that.data.role,
                    order_type: orderType
                  }, success: res => {
                  }
                })
              }
              wx.setStorage({
                key: 'ordertype',
                data: orderType
              })
              that.triggerEvent('callSomeFun')
              that.setData({
                authHidden: true
              })
              wx.redirectTo({
                url: "/pages/tabbar/tabbar"
              })
            }
          })
        }
      })
    },
    mearchEnter:function(e){
      var that = this;
      var role = e.target.dataset.role;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                var userInfo = res.userInfo;
                db.collection('order_type').get({
                  success: function (res) {
                    that.setData({
                      orderTypeList: res.data,
                      role: role,
                      userInfo: userInfo,
                      hiddenFlag: true
                    })
                    wx.setStorage({
                      key: 'role',
                      data: e.target.dataset.role
                    })
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
    },
    userEnter: function (e) {
      var that = this;
      var role = e.target.dataset.role;
      // 获取用户信息
      wx.getSetting({
        success: res => {
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: res => {
                var userInfo = res.userInfo;
                wx.getStorage({
                  key: 'openid',
                  success: function (res) {
                    db.collection("user_info").where({
                      _openid: res.data
                    }).get({
                      success: res => {
                        if (res.data.length == 0) {
                          //增加用户信息
                          db.collection("user_info").add({
                            data: {
                              nickName: userInfo.nickName,
                              gender: userInfo.gender,
                              province: userInfo.province,
                              city: userInfo.city,
                              avatarUrl: userInfo.avatarUrl,
                              role: role
                            },
                            success: res => {}
                          })
                        } else {
                          db.collection("user_info").doc(res.data[0]._id).update({
                            data: {
                              gender: userInfo.gender,
                              province: userInfo.province,
                              city: userInfo.city,
                              role: role
                            }, success: res => {}
                          })
                        }
                        wx.setStorage({
                          key: 'role',
                          data: e.target.dataset.role
                        })
                        that.triggerEvent('callSomeFun')
                        that.setData({
                          authHidden: true
                        })
                        wx.redirectTo({
                          url: "/pages/tabbar/tabbar"
                        })
                      }, fail: res => {
                        console.info('fail', res)
                      }
                    })
                  }
                })
              }
            })  
          }else{
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