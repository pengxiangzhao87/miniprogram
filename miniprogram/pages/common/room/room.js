var util = require('../../../utils/util.js')
const app = getApp()
var db = wx.cloud.database();

Page({
  data: {
    avatarUrl: '/images/my.png',
    userInfo: null,
    logged: false,
    takeSession: false,
    requestResult: '',
    // chatRoomEnvId: 'release-f8415a',
    chatRoomCollection: 'chatroom',
    chatRoomGroupId: '',
    chatRoomGroupName: '聊天室',

    // functions for used in chatroom components
    onGetUserInfo: null,
    getOpenID: null,
  },

  onLoad: function(e) {
    //用户openid,加两个下划线，加商家openid,加两个下划线,加订单ID，作为聊天室唯一groupid
    this.setData({
      chatRoomGroupId: e.groupid
    })
    //更新商家端，消息-联系，最后聊天时间
    db.collection('merchant_cust_contact').where({
      _openid: e.groupid.split('__')[1],
      orderid: e.groupid.split('__')[2]
    }).update({
      data:{
        createDate: util.formatTime(new Date())
      },
      success:res=>{
        if(res.stats.updated==0){
          db.collection('merchant_cust_contact').add({
            data: {
              orderid: e.groupid.split('__')[2],
              createDate: util.formatTime(new Date())
            }
          })
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

    this.setData({
      onGetUserInfo: this.onGetUserInfo,
      getOpenID: this.getOpenID,
    })

    wx.getSystemInfo({
      success: res => {
        console.log('system info', res)
        if (res.safeArea) {
          const { top, bottom } = res.safeArea
          this.setData({
            containerStyle: `padding-top: ${(/ios/i.test(res.system) ? 10 : 20) + top}px; padding-bottom: ${20 + res.windowHeight - bottom}px`,
          })
        }
      },
    })
  },

  getOpenID: async function() {
    if (this.openid) {
      return this.openid
    }

    const { result } = await wx.cloud.callFunction({
      name: 'login',
    })

    return result.openid
  },

  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onShareAppMessage() {
    return {
      title: '即时通信 Demo',
      path: '/pages/im/room/room',
    }
  },
})
