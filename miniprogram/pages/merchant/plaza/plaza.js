// pages/merchant/plaza/plaza.js
var app = getApp()
var startX, endX;
var moveFlag = true;// 判断执行滑动事件
var db = wx.cloud.database();
Component({
  /**
    * 组件的初始数据
    */
  data: {
    page: 1,
    ani1: '',
    ani2: '',
    myList: [],
    newsList: [],
    pageNum1: 1,
    pageSize1: 10,
    pageNum2: 1,
    pageSize2: 10
  },

  pageLifetimes: {
    show() {
      var that = this;
      if (typeof that.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      wx.getStorage({
        key: 'openid',
        success: function(res) {
          var openid = res.data;
          var pageNum = that.data.pageNum1;
          var pageSize = that.data.pageSize1;
          wx.cloud.callFunction({
            name: 'merchantOrder',
            data: { openid: openid,pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
            success: res => {
              var result = res.result.list;
              for (var index in result) {
                result[index].images = result[index].fileID.split(',');
                
              }
              that.setData({
                myList: result
              })
            },
            fail: err => { }
          })
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toCustContact:function(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/merchant/custContact/custContact?id=' + id
      })

    },
    toMerchantOrderDetail:function(e){
      var index = e.currentTarget.dataset.index
      var detail = this.data.newsList[index];
      wx.navigateTo({
        url: '/pages/merchant/merchantOrderDetail/merchantOrderDetail?detail=' + JSON.stringify(detail)
      })
    },
    reachBottom: function (e) {
      var that = this;
      if (that.data.page == 1) {
        var num = that.data.pageNum1 + 1;
        that.setData({
          pageNum1: num
        })
        var pageSize = that.data.pageSize1;
        //用户订单、用户信息连表查询
        wx.getStorage({
          key: 'openid',
          success: function (res) {
            var openid = res.data;
            wx.cloud.callFunction({
              name: 'merchantOrder',
              data: { openid: openid, pageNum: (num - 1) * pageSize, pageSize: pageSize },
              success: res => {
                var result = res.result.list;
                for (var index in result) {
                  result[index].images = result[index].fileID.split(',');
                }
                var resultList = that.data.myList.concat(result);
                that.setData({
                  myList: resultList
                })
              },
              fail: err => { }
            })
          }
        })
      } else {

      }

    },
    getNewsList:function(){
      var that = this;
      var pageNum = that.data.pageNum2;
      var pageSize = that.data.pageSize2;
      wx.cloud.callFunction({
        name: 'merchantOrder',
        data: {pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
        success: res => {
          var result = res.result.list;
          for (var index in result) {
            result[index].images = result[index].fileID.split(',');

          }
          that.setData({
            newsList: result
          })
        },
        fail: err => { }
      })
    },
    getMyList:function(){
      var that = this;
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          var openid = res.data;
          var pageNum = that.data.pageNum1;
          var pageSize = that.data.pageSize1;
          wx.cloud.callFunction({
            name: 'merchantOrder',
            data: { openid: openid, pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
            success: res => {
              var result = res.result.list;
              for (var index in result) {
                result[index].images = result[index].fileID.split(',');

              }
              that.setData({
                myList: result
              })
            },
            fail: err => { }
          })
        }
      })
    },
    touchStart: function (e) {
      startX = e.touches[0].pageX; // 获取触摸时的原点
      moveFlag = true;
    },
    // 触摸移动事件
    touchMove: function (e) {
      endX = e.touches[0].pageX; // 获取触摸时的原点
      if (moveFlag) {
        if (endX - startX > 50) {
          this.move2right();
          moveFlag = false;
        }
        if (startX - endX > 50) {
          this.move2left();
          moveFlag = false;
        }
      }
    },

    // 触摸结束事件
    touchEnd: function (e) {
      moveFlag = true; // 回复滑动事件
    },

    //向左滑动操作
    move2left() {
      var that = this;
      var page = that.data.page;
      if (page == 2) {
        return
      }else{
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
          delay: 100
        });
        animation.opacity(0.2).translate(-500, 0).step()
        //获取最新数据
        if(that.data.newsList.length==0){
          that.getNewsList();
        }
        that.setData({
          ani1: animation.export()
        })
        setTimeout(function () {
          that.setData({
            page: page + 1,
            ani2: ''
          });
        }, 800)       
      }

    },

    //向右滑动操作
    move2right() {
      var that = this;
      var page = that.data.page;
      if ( page== 1) {
        return
      }else{
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
          delay: 100
        });
        animation.opacity(0.2).translate(500, 0).step()
        if(that.data.newsList.length==0){
          that.getMyList();
        }
        that.setData({
          ani2: animation.export()
        })
        setTimeout(function () {
          that.setData({
            page: page-1,
            ani1: ''
          });
        }, 800)  
      }
    }
  },

    /**
   * 组件的属性列表
   */
  properties: {

  }

})
