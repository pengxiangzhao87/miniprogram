var util = require('../../../utils/util.js')
var db = wx.cloud.database();

Page({
  data: {
    contactList: {},
    pic:'[图片]',
    pageNum:1,
    pageSize:10
  },
  onLoad: function (e) {
    var that = this;
    var pageNum = that.data.pageNum;
    var pageSize = that.data.pageSize;
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        var openid = res.data;
        console.info(e.id)
        //用户订单、用户信息连表查询
        wx.cloud.callFunction({
          name: 'custContact',
          data: { orderid: e.id, pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
          success: res => {
            var result = res.result.list;
            console.info('aa',result)
            that.setData({
              contactList: result
            }) 
          },
          fail: err => { }
        })
      }
    })
  },
  toRoom:function(e){
    var groupid = e.currentTarget.dataset.groupid;
    wx.navigateTo({
      url: '/pages/common/room/room?groupid=' + groupid
    })
  }
})