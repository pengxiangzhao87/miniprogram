Page({
  data: {
    merchantInfo:[]
  },
  onReady: function (e) {
  
    var db = wx.cloud.database();
    var _this = this;
    db.collection('merchant_info').get({
      success:function(res){
        console.log("res = "+ res.data[0].address)
        _this.setData({
          merchantInfo:res.data
        })
      }
    })
  },


  // 获取当前定位信息
  getLocation: function () {
    wx.getLocation({
      altitude: 'altitude',
      complete: (res) => {
        console.log("complete res ="+ JSON.stringify(res))
      },
      fail: (res) => {
        console.log("fail res = "+ JSON.stringify(res))
      },
      highAccuracyExpireTime: 0,
      isHighAccuracy: true,
      success: (result) => {
        console.log("success result = "+ JSON.stringify(result))
      },
      type: 'type',
    })
  
  },
  getCenterLocation: function () {
    this.mapCtx.getCenterLocation({
      success: function (res) {
        console.log(res.longitude)
        console.log(res.latitude)
      }
    })
  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 1,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },

  onLoad() {
    this.setData({
      search: this.search.bind(this)
    })
  },

  search: function (value) {
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
  selectResult: function (e) {
    console.log('select result', e.detail)
  },
})