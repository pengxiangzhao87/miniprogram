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
    this.setData({
      search: this.search.bind(this)
    })
    var db = wx.cloud.database();
    var _this = this;
    db.collection('user_info').where({
      role: '1'
    }).get({
      success: function(res) {
        _this.setData({
          merchantInfo: res.data
        })
      }
    })
  },
  /**
   * 组件的初始数据
   */
  data: {
    merchantInfo: [],
    i: 0
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
    search: function(value) {
      return new Promise((resolve, reject) => {
        if (this.data.i % 2 === 0) {
          setTimeout(() => {
            resolve([{
              text: '搜索结果',
              value: 1
            }, {
              text: '搜索结果2',
              value: 2
            }, {
              text: '搜索结果3',
              value: 3
            }])
          }, 200)
        } else {
          setTimeout(() => {
            resolve([])
          }, 200)

        }
        this.setData({
          i: this.data.i + 1
        })
      })
    },
    selectResult: function(e) {
      console.log('select result', e.detail)
    },
  }
})