var util = require('../../../../utils/util.js')
var db = wx.cloud.database();

Page({
  data: {
    detail: {},
    flag:3
  },
  onLoad: function (e) {
    var detail = JSON.parse(e.detail);
    this.setData({
      detail: detail,
      flag:e.flag
    })
  },
  toRoom: function () {
    var detail = this.data.detail;
    var flag = this.data.flag;
    //更新商家端，消息-联系，最后聊天时间1
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        var openid = res.data;
        db.collection('cust_merchant_order').where({
          _openid: openid,
          orderid: flag == 0 ? detail._id : detail.orderid
        }).update({
          data: {
            createDate: util.formatTime(new Date()),
            avatarUrl: flag==0?detail.userInfo[0].avatarUrl:detail.avatarUrl,
            name: flag==0?detail.userInfo[0].name:detail.name
          },
          success: res => {
            if (res.stats.updated == 0) {
              db.collection('cust_merchant_order').add({
                data: {
                  orderid: flag == 0 ? detail._id:detail.orderid,
                  createDate: util.formatTime(new Date()),
                  avatarUrl: flag == 0 ? detail.userInfo[0].avatarUrl : detail.avatarUrl,
                  name: flag == 0 ? detail.userInfo[0].name : detail.name
                }
              })

            }
          }
        })
        var mercantOpenid = flag == 0 ? detail.userInfo[0]._openid:detail.merchant[0]._openid;
        var orderid = flag == 0 ? detail._id:detail.orderid;
        wx.navigateTo({
          url: '/pages/common/room/room?groupid=' + openid + '__' + mercantOpenid + '__' + orderid + "&orderid=" + orderid
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