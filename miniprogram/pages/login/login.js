
Page({
  data:{

  },
  userEnter:function(e){
    var flag = e.target.dataset.flag;
    var db = wx.cloud.database();
    wx.getStorage({
      key: 'openid',
      success: function (res) { 
        db.collection("user_info").add({
          data: {
            openid:res.data,
            isMemchant:flag
          },
          success: res => {
            if (flag == '0') {
              wx.switchTab({
                url: '/pages/publish/publish',
              })
            } else {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          }
        })
      }
    })
  }
})