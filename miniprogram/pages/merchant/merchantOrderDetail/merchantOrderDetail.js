var db = wx.cloud.database();

Page({
  data: {
    merchantOrder: {},
    merchantInfo: {}
  },
  onPullDownRefresh: function () {
    console.info("aaa")
  },
  onReachBottom: function () {
    console.info("onReachBottom")
  },
  onLoad: function (e) {
    var that = this;
    db.collection('merchant_order').where({
      _id: e.id
    }).get({
      success: res => {
        that.setData({
          merchantOrder: res.data[0]
        })
        db.collection('merchant_info').where({
          _openid: res.data[0]._openid
        }).get({
          success: res => {            
            that.setData({
              merchantInfo: res.data[0]
            })
          }
        })
      }
    })
  }
})