let app = getApp()
var db = wx.cloud.database();
Page({
  data: {
    dialogHidden:true,
    role:0,
    currentTab: 0,
    merchant: [
      {
        "pagePath": "/pages/merchant/news/news",
        "text": "消息",
        "iconPath": "/images/plaza.png",
        "selectedIconPath": "/images/selected_plaza.png"
      },
      {
        "pagePath": "/pages/merchant/active/active",
        "text": "发布",
        "iconPath": "/images/publish.png",
        "selectedIconPath": "/images/publish.png"
      },
      {
        "pagePath": "/pages/merchant/plaza/plaza",
        "text": "广场",
        "iconPath": "/images/publish.png",
        "selectedIconPath": "/images/publish.png"
      },
      {
        "pagePath": "/pages/merchant/store/store",
        "text": "店铺",
        "iconPath": "/images/publish.png",
        "selectedIconPath": "/images/publish.png"
      }
    ],
    customer:[
      {
        "pagePath": "/pages/customer/home/home",
        "text": "首页",
        "iconPath": "/images/publish.png",
        "selectedIconPath": "/images/publish.png"
      },
      {
        "pagePath": "/pages/customer/discover/discover",
        "text": "发现",
        "iconPath": "/images/plaza.png",
        "selectedIconPath": "/images/selected_plaza.png"
      },
      {
        "pagePath": "/pages/customer/orders/orders",
        "text": "订单",
        "iconPath": "/images/my.png",
        "selectedIconPath": "/images/selected_my.png"
      },
      {
        "pagePath": "/pages/customer/my/my",
        "text": "我的",
        "iconPath": "/images/my.png",
        "selectedIconPath": "/images/selected_my.png"
      }

    ]
  },
  onLoad:function(e){
    var that = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getStorage({
            key: 'openid',
            success:res=>{
              wx.getStorage({
                key: 'role',
                success:res=>{
                  that.setData({
                    role:res.data
                  })
                  if(res.data==1){
                    wx.getStorage({
                      key: 'ordertype',
                      fail: function (res) {
                        wx.showModal({
                          title: '警告',
                          content: '授权失效，请重新登陆',
                          showCancel: false,
                          confirmText: '返回授权',
                          success: function (res) {
                            that.setData({
                              dialogHidden: false
                            })
                          }
                        })
                      }
                    })
                  }
                },
                fail: function(res) {
                  wx.showModal({
                    title: '警告',
                    content: '授权失效，请重新登陆',
                    showCancel: false,
                    confirmText: '返回授权',
                    success: function (res) {
                      that.setData({
                        dialogHidden: false
                      })
                    }
                  })
                }
              })
            },
            fail:res=>{
              wx.showModal({
                title: '警告',
                content: '授权失效，请重新登陆',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                  that.setData({
                    dialogHidden: false
                  })
                }
              })
            }
          })
        }else{
          that.setData({
            dialogHidden: false
          })
        }
      }
    })
    if(e.currentTab!=undefined){
      that.setData({
        currentTab:2
      })
    }
  },

  onShow:function(e){
    wx.hideHomeButton();
  },
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  onReachBottom: function () {
    var selectComponent = null;
   
    if(this.data.role==0){
      selectComponent = this.data.currentTab == 0 ? '.component_index' : (this.data.currentTab == 1 ? '.component_discover' : (this.data.currentTab == 2 ? '.component_orders' : ''));
    }else{
      selectComponent = this.data.currentTab == 0 ? '.component_news' : (this.data.currentTab == 1 ? '.component_active' : (this.data.currentTab == 2 ? '.component_plaza' :''));
    }
    if (selectComponent!=''){
      this.selectComponent(selectComponent).reachBottom();
    }
  }
})
