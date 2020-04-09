
Component({
  data:{
    orderTypeList:[],
    options: {
      addGlobalClass: true,
    }
  },
  pageLifetimes: {
    show() {
      var _this = this;
      var db = wx.cloud.database();
      db.collection('order_type').get({
        success:function(res){
          _this.setData({
            orderTypeList:res.data
          })
        }
      })
    }
  },
  methods: {
    clickRow:function(e){
      var _this = this;
      var index = e.currentTarget.dataset.index;
      var orderType = _this.data.orderTypeList[index]
      //获取上一级页面
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2];
      // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
      prevPage.setData({ 
        orderType: orderType
      })
      wx.navigateBack({
        delta: 1  // 返回上一级页面。
      })
    }
  }
})