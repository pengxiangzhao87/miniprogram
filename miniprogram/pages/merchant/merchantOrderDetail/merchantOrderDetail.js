var db = wx.cloud.database();

Page({
  data: {
    detail: {}
  },
  onLoad: function (e) {
    var detail = JSON.parse(e.detail);
    this.setData({
      detail : detail
    })
  }
})