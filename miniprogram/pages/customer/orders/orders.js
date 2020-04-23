// pages/customer/orders/orders.js
var db = wx.cloud.database();

Component({
  pageLifetimes: {
    show() {
      var that = this;
      if (typeof that.getTabBar === 'function' &&
        that.getTabBar()) {
        that.getTabBar().setData({
          selected: 0
        })
      }
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          var openid = res.data;
          var pageNum = that.data.pageNum;
          var pageSize = that.data.pageSize;
          db.collection('cust_order').where({
            _openid:openid
          }).skip(pageNum).limit(pageSize).get({
            success:res=>{
              that.setData({
                order: res.data
              })
            }
          })
        }
      })
    }
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
    order: [],
    pageNum: 1,
    pageSize: 5
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toOrderDetail:function(e){
      var index = e.currentTarget.dataset.index
      var detail = this.data.order[index];
      wx.navigateTo({
        url: '/pages/customer/orders/detail/detail?detail=' + JSON.stringify(detail)
      })
    },
    reachBottom: function (e) {
      var that = this;
      var num = that.data.pageNum + 1;
      that.setData({
        pageNum: num
      })
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          var openid = res.data;
          var pageNum = that.data.pageNum;
          var pageSize = that.data.pageSize;
          db.collection('cust_order').where({
            _openid: openid
          }).skip((num - 1) * pageSize).limit(pageSize).get({
            success: res => {
              var order = that.data.order.concat(res.data);
              that.setData({
                order: order
              })
            }
          })
        }
      })
    }


  }
})
