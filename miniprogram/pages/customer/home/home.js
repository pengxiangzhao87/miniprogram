var db = wx.cloud.database();
Component({
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' &&
        this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
    }
  },
  /**
   * 组件的属性列表
   */
  properties: {},
  ready: function() {
    var that = this;
    var pageNum = that.data.pageNum;
    var pageSize = that.data.pageSize;
    db.collection('user_info').where({
      role: '1'
    }).skip((pageNum-1)*pageSize).limit(pageSize).get({
      success: function(res) {
        var result = res.data;
        for (var index in result) {
          result[index].images = result[index].image_url.split(',');

        }
        that.setData({
          merchantInfo: result
        })
      }
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    merchantInfo: [],
    pageNum: 1,
    pageSize: 1,
    text:'搜索',
    value:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //发布数据
    onPublish: function() {
      wx.navigateTo({
        url: '../../pages/customer/publish/publish',
      })
    },
    getSearchValue: function(e) {
      this.setData({
        value:e.detail.value
      })
    },
    toShop:function(e){
      var index = e.currentTarget.dataset.index
      var detail = this.data.merchantInfo[index];
      wx.navigateTo({
        url: '/pages/customer/home/shopname/shopname?detail=' + JSON.stringify(detail)
      })
    },
    bindconfirm: function(e) {
      var that = this;
      var value = that.data.value;
      var text = that.data.text;
      if (value==''){
        return;
      }
      if (text=='搜索'){
        db.collection('user_info').where({
          role: '1',
          content: new db.RegExp({
            regexp: value,
            //从搜索栏中获取的value作为规则进行匹配。
            options: 'i',
            //大小写不区分
          })
        }).get({
          success: function (res) {
            console.info(res)
            that.setData({
              merchantInfo: res.data,
              text: '搜索' ? '取消' : '搜索'
            })
          }
        })
      }else{
        var pageNum = that.data.pageNum;
        var pageSize = that.data.pageSize;
        db.collection('user_info').where({
          role: '1'
        }).skip((pageNum - 1) * pageSize).limit(pageSize).get({
          success: function (res) {
            that.setData({
              merchantInfo: res.data,
              text: '取消' ? '搜索' : '取消',
              value:''
            })
          }
        })
      }
    },
    reachBottom: function (e) {
      var that = this;
      var num = that.data.pageNum + 1;
      that.setData({
        pageNum: num
      })
      var pageSize = that.data.pageSize;
      //用户订单、用户信息连表查询
      db.collection('user_info').where({
        role: '1'
      }).skip((num - 1) * pageSize).limit(pageSize).get({
        success: function (res) {
          var result = res.data;
          for (var index in result) {
            result[index].images = result[index].image_url.split(',');
          }
          var resultList = that.data.merchantInfo.concat(result);
          that.setData({
            merchantInfo: resultList
          })
        }
      })
    }
  }
})