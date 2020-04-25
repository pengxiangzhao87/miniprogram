var util = require('../../../../utils/util.js')
var db = wx.cloud.database();

Page({
  data: {
    detail: {}
  },
  onLoad: function (e) {
    var detail = JSON.parse(e.detail);
    this.setData({
      detail: detail,
    })
  },
  toRoom: function () {
    var detail = this.data.detail;
    //更新商家端，消息-联系，最后聊天时间1
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        wx.navigateTo({
          url: '/pages/common/room/room?groupid=' + openid + '__' + detail._openid
        })
      }
    })
  },
  enlargeImg: function (e) {
    var index = e.target.dataset.index
    var detail = this.data.detail
    wx.previewImage({
      current: detail.images[index],  //当前预览的图片
      urls: detail.images  //所有要预览的图片
    })
  },
})