var db = wx.cloud.database();

Page({
  data: {
    custOrder:{},
    userInfo:{}
  },
  onLoad:function(e){
    var that = this;
    db.collection('cust_order').where({
      _id:e.id
    }).get({
      success: res => {
        that.setData({
          custOrder:res.data[0]
        })
        db.collection('user_info').where({
          _openid:res._openid
        }).get({
          success: res => {
            that.setData({
              userInfo:res.data[0]
            })
          }
        })
      }
    })
  }
})