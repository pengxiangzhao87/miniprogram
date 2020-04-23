// pages/customer/orders/detail/detail.js
var db = wx.cloud.database();

Page({
  data: {
    detail: [],
    pageNum: 1,
    pageSize: 10,
    pic:'[图片]',
    name:'',
    pageNum:1,
    pageSize:10
  },
  onLoad: function (e) {
    var that = this;
    var detail = JSON.parse(e.detail);
    var pageNum = that.data.pageNum;
    var pageSize = that.data.pageSize;
    wx.cloud.callFunction({
      name: 'order',
      data: { orderid: detail._id,pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
      success: res => {
        var result = res.result.list;
        that.setData({
          name: detail.name,
          detail: result
        })
      },
      fail: err => { }
    })
    
  },
  toRoom: function (e) {
    var index = e.currentTarget.dataset.index;
    var detail = this.data.detail[index];
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        wx.navigateTo({
          url: '/pages/common/room/room?groupid=' + res.data + '__' + detail._openid + '__' + detail.orderid+"&orderid="+detail.orderid
        })
      }
    })
  }
})
