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
    page: 2,
    ani1: '',
    ani2: '',
    ani3: '',
    myList: [],
    newsList: [],
    contactList: []
   
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
      db.collection('merchant_order').where({
        state: '0'
      }).orderBy('create_date', 'desc').get({
        success: function (res) {
          that.setData({
            newsList: res.data
          })
        }
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toMerchantOrderDetail:function(e){
      var id = e.currentTarget.dataset.id
      wx.navigateTo({
        url: '/pages/merchant/merchantOrderDetail/merchantOrderDetail?id=' + id,
      })
    },
    getNewsList:function(){
      var that = this;
      db.collection('merchant_order').where({
        state: '0'
      }).orderBy('create_date', 'desc').get({
        success: function (res) {
          that.setData({
            newsList: res.data
          })
        }
      })
    },
    getMyList:function(){
      var that = this;
      wx.getStorage({
        key: 'openid',
        complete: function (res) {
          db.collection('merchant_order').where({
            _openid: res.data,
            state: '0'
          }).orderBy('create_date', 'desc').get({
            success: function (res) {
              that.setData({
                myList: res.data
              })
            }
          })
        }
      })
    },
    getContactList:function(){
      var that = this;
      wx.getStorage({
        key: 'openid',
        complete: function (res) {
          db.collection('merchant_order').where({
            _openid: res.data,
            state: '0'
          }).orderBy('create_date', 'desc').get({
            success: function (res) {
              that.setData({
                contactList: res.data
              })
            }
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
      if (page == 3) {
        return
      }else{
        var animation = wx.createAnimation({
          duration: 1000,
          timingFunction: 'ease',
          delay: 100
        });
        animation.opacity(0.2).translate(-500, 0).step()
        if(page == 1){
          //获取最新数据
          this.getNewsList();
          that.setData({
            ani1: animation.export()
          })
          setTimeout(function () {
            that.setData({
              page: page + 1,
              ani2: ''
            });
          }, 800)
        }else{
          //广场获取所有新消息
          this.getContactList();
          that.setData({
            ani2: animation.export()
          })
          setTimeout(function () {
            that.setData({
              page: page + 1,
              ani3: ''
            });
          }, 800)
        }
        
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
        if(page == 2){
          this.getMyList();
          this.setData({
            ani2: animation.export()
          })
          setTimeout(function () {
            that.setData({
              page: page-1,
              ani1: ''
            });
          }, 800)
        }else{
          this.getNewsList();
          this.setData({
            ani3: animation.export()
          })
          setTimeout(function () {
            that.setData({
              page: page-1,
              ani2: ''
            });
          }, 800)
        }     
      }
    }
  },

    /**
   * 组件的属性列表
   */
  properties: {

  }

})
