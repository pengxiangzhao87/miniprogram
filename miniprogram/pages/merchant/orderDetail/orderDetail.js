var util = require('../../../utils/util.js')
var db = wx.cloud.database();

Page({
  data: {
    detail:{}
  },
  onLoad:function(e){
    var detail = JSON.parse(e.detail);
    this.setData({
      detail:detail
    })
  },
  toRoom:function(){
    var detail = this.data.detail;
    //更新商家端，消息-联系，最后聊天时间1
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        db.collection('user_info').where({
          _openid: res.data
        }).get({
          success: res => {
            var userInfo = res.data[0];
            db.collection('merchant_cust_contact').where({
              _openid: detail.userInfo[0]._openid,
              orderid: detail._id
            }).update({
              data: {
                createDate: util.formatTime(new Date()),
                avatarUrl: userInfo.avatarUrl,
                name: userInfo.name
              },
              success: res => {
                if (res.stats.updated == 0) {
                  db.collection('merchant_cust_contact').add({
                    data: {
                      orderid: detail._id,
                      createDate: util.formatTime(new Date()),
                      avatarUrl: userInfo.avatarUrl,
                      name: userInfo.name
                    }
                  })
                              
                }
              }
            })
          }
        })
      }
    })
    wx.navigateTo({
      url: '/pages/common/room/room?groupid='+detail._openid+'__'+detail.userInfo[0]._openid+'__'+detail._id
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