let app = getApp()

Page({
  data: {
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
        "pagePath": "/pages/customer/index/index",
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
        "pagePath": "/pages/customer/social/social",
        "text": "朋友",
        "iconPath": "/images/my.png",
        "selectedIconPath": "/images/selected_my.png"
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
  onShow:function(e){
    var that = this;
    role:wx.getStorage({
      key: 'role',
      success: function(res) {
        that.setData({
          role:res.data
        })
      },
    })
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
  onLoad: function (option) {

  }
})
