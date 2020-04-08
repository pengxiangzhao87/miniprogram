Page({
  data: {
    id:'',
    merchantInfo:{},
    info:''
  },
  onReady: function () {
    console.log("shopname onReady")
  },
  onLoad(options) {
    this.getMerchantInfo(options.id)
  },
  
  // 获取店铺信息
  getMerchantInfo:function(Id){
    var db = wx.cloud.database();
    var _this = this;
    db.collection('user_info').where({
      _id:Id
    }).get({
      success:function(res){
        console.log("res = "+JSON.stringify(res))
        wx.setNavigationBarTitle({
          title: res.data[0].name,
        })
        _this.setData({
          merchantInfo:res.data[0],
          info:JSON.stringify(res)
        })
      }
    })
  },
  //点击关注
  onAttention:function(){
    wx.showToast({
      title: '关注成功',
      icon:'none'
    })
  },
   //查看更多
   onSeeMore:function(){
    wx.showToast({
      title: '查看更多',
      icon:'none'
    })
  }
})
