// pages/costomer/discover.js
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      this.initData()
    },

  },
  
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    page: 0,
    pageNum1: 1,
    pageSize1: 10,
    newsList: [],
    contactList: []
  },

  /**
   * 组件的方法列表
   */
  methods: {

    /**
     * 页面滑动处理
     */
    scrollPage: function(event) {
      if (event.detail.source == "touch") {
        this.setData({
          page: event.detail.current
        })
      }
    },
    /**
     * 获取数据
     */
    initData: function() {
      var pageNum = this.data.pageNum1;
      var pageSize = this.data.pageSize1;
      //用户订单、用户信息连表查询
      wx.cloud.callFunction({
        name: 'merchantOrder',
        data: {
          pageNum: 1,
          pageSize: 10
        },
        success: res => {
          console.log("res = " + JSON.stringify(res))
          var result = res.result.list;
          for (var index in result) {
            result[index].images = result[index].fileID.split(',');
          }
          this.setData({
            newsList: result
          })
        },
        fail: err => {
          console.log("err = " + JSON.stringify(err))
        }
      })
    },
      //跳转详情
      toOrderDetail:function(e){
        var index = e.currentTarget.dataset.index
        var detail = {};
        if (this.data.page == 0) {
          detail = this.data.newsList[index];
        } else {
          detail = this.data.contactList[index];
        }
        wx.navigateTo({
          url: '/pages/merchant/orderDetail/orderDetail?detail=' + JSON.stringify(detail)
        })
      },
      
  }
})