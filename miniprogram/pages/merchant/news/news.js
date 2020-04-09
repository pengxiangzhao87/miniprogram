// pages/merchant/news/news.js

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
    newsList:[],
    contactList:[],
    pageNum1:1,
    pageSize1:2,
    pageNum2:1,
    pageSize2:2
  },
  pageLifetimes: {
    show() {
      var that = this;
      if (typeof that.getTabBar === 'function' &&
        that.getTabBar()) {
        that.getTabBar().setData({
          selected: 0
        })
      }
      var pageNum = that.data.pageNum1;
      var pageSize = that.data.pageSize1;
      //用户订单、用户信息连表查询
      wx.cloud.callFunction({
        name: 'cusOrder',
        data: { pageNum: (pageNum - 1) * pageSize, pageSize: pageSize},
        success: res => {
          var result = res.result.list;
          for(var index in result){
            var fileID = result[index].fileID;
            if(fileID!=undefined){
              var images = [];
              var split = fileID.split(',');
              for (var dex in split) {
                images[dex] = split[dex]
              }
              result[index].images = images;
            }
          }
          that.setData({
            newsList: result
          })
        }, 
        fail: err => {}
      })
    }
  },
 
  /**
   * 组件的方法列表
   */
  methods: {
    //上拉获取数据，在父节点tabbar触发
    reachBottom:function(e){
      var that = this;
      if(this.data.page==1){
        var num = that.data.pageNum1 + 1;
        that.setData({
          pageNum1: num
        })
        var pageSize = that.data.pageSize1;
        //用户订单、用户信息连表查询
        wx.cloud.callFunction({
          name: 'cusOrder',
          data: { pageNum: (num - 1) * pageSize, pageSize: pageSize },
          success: res => {
            var result = res.result.list;
            for (var index in result) {
              var fileID = result[index].fileID;
              if (fileID != undefined) {
                var images = [];
                var split = fileID.split(',');
                for (var dex in split) {
                  images[dex] = split[dex]
                }
                result[index].images = images;
              }
            }
            var resultList = that.data.newsList.concat(result);
            console.info(resultList)
            that.setData({
              newsList: resultList
            })
          },
          fail: err => { }
        })
      }else{

      }
      
    },
    //预览图片
    enlargeImg: function (e) {
      var index = e.target.dataset.index
      var dex = e.target.dataset.dex
      var newsList = this.data.newsList
      wx.previewImage({
        current: newsList[index].images[dex],  //当前预览的图片
        urls: newsList[index].images  //所有要预览的图片
      })
    },
    //跳转详情
    toOrderDetail:function(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/merchant/orderDetail/orderDetail?id='+id,
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
      if (that.data.page == 2) {
        return
      }
      if (that.data.contactList.length==0){
        var pageNum = that.data.pageNum2;
        var pageSize = that.data.pageSize2;
        wx.getStorage({
          key: 'openid',
          complete: res => {
            var openid = res.data;
            wx.cloud.callFunction({
              name: 'merchantContact',
              data: { openid: openid, pageNum: (pageNum - 1) * pageSize, pageSize: pageSize },
              success: res => {
                var result = res.result.list;
                var orderList = [];
                for(var index in result){
                  var custOrder = result[index].custOrder[0];
                  var fileID = custOrder.fileID;
                  if (fileID != undefined) {
                    var images = [];
                    var split = fileID.split(',');
                    for (var dex in split) {
                      images[dex] = split[dex]
                    }
                    custOrder.images = images;
                  }
                  orderList[index]=custOrder;
                }
                that.setData({
                  contactList: orderList
                })
              },
              fail: err => { }
            })
          }
        })
      }
    
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 100
      });

      animation.opacity(0.2).translate(-500, 0).step()
      this.setData({
        ani1: animation.export()
      })

      setTimeout(function () {
        that.setData({
          page: 2,
          ani2: ''
        });
      }, 800)
    },

    //向右滑动操作
    move2right() {
      var that = this;
      if (that.data.page == 1) {
        return
      }
      var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
        delay: 100
      });

      animation.opacity(0.2).translate(500, 0).step()
      that.setData({
        ani2: animation.export()
      })

      setTimeout(function () {
        that.setData({
          page: 1,
          ani1: ''
        });
      }, 800)

    }
  },
  /**
 * 组件的属性列表
 */
  properties: {

  }
})
