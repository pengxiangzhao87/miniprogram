Component({

  data: {
    //接受商品分类信息
    orderType: {},
    imagesList: [],
    //当前选择的生鲜类型
    currentType: {},
    typeNames: [],
    currentIndex: 0
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        console.info("pub")
        this.getTabBar().setData({
          selected: 0
        })
      }
      // 获得dialog组件
      this.userInfo = this.selectComponent("#getUserInfo");

      console.log("show = " + JSON.stringify(this.options))
    },
    onLoad: function(options) {
      console.log("1e = " + e)
    },
  },
  onLoad: function(options) {
    console.log("2e = " + e)
  },
  ready: function() {
    console.log("ready = " + JSON.stringify(this.options))
    wx.setNavigationBarTitle({
      title: "发布",
    });
    var _this = this;
    var db = wx.cloud.database();
    db.collection("order_type").get({
      success: function(res) {
        console.log("res = " + JSON.stringify(res))
        var _typeNmes = [];
        for (var i = 0; i < res.data.length; i++) {
          _typeNmes.push(res.data[i].type_name)
        }
        _this.setData({
          typeNames: _typeNmes
        })
        console.log("list = " + JSON.stringify(list))
      }
    })
  },
  attached: function() {
    console.log("attached = " + JSON.stringify(this.options))
  },

  methods: {
    bindCountryChange: function(e) {
      this.setData({
        currentIndex: e.detail.value
      })
    },

    uploader: function() {
      var that = this;
      var imageList = that.data.imagesList;
      var imagesList = [];
      var maxSize = 1024 * 1024 * 10;
      var imageLength = imageList.length;
      var maxLength = 3 - imageLength;
      var flag = true;

      wx.chooseImage({
        count: maxLength, //最多可以选择的图片总数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function(res) {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 500
          })
          if (res.tempFiles.length > maxLength) {
            wx.showModal({
              content: '最多能上传' + maxLength + '张图片',
              showCancel: false,
              success: function(res) {}
            })
          }

          for (var i = 0; i < res.tempFilePaths.length; i++) {
            imageList[imageLength + i] = res.tempFilePaths[i];
            if (res.tempFiles[i].size > maxSize) {
              flag = false;
              wx.showModal({
                content: '图片太大，不允许上传',
                showCancel: false,
                success: function(res) {}
              });
            }

          }
          if (flag == true && res.tempFiles.length <= maxLength) {
            that.setData({
              imagesList: imageList
            })
          }
        },
        fail: function(res) {
          console.log(res);
        }
      })
    },

    //删除图片
    deleteImg: function(e) {
      var imagesList = this.data.imagesList;
      var index = e.currentTarget.dataset.index;
      imagesList.splice(index, 1);
      this.setData({
        imagesList: imagesList
      });
    },

    //预览图片
    enlargeImg: function(e) {
      var index = e.target.dataset.index
      var imagesList = this.data.imagesList
      console.info(imagesList)
      wx.previewImage({
        current: imagesList[index], //当前预览的图片
        urls: imagesList, //所有要预览的图片
      })
    },

    //表单提交
    formSubmit: function(e) {
      // wx.hideLoading()
      var goodsinfo = e.detail.value;
      var db = wx.cloud.database();
      db.collection('cust_order').add({
        data: {
          create_date: new Date(),
          customer_id: "aa",
          express_type: goodsinfo.expressType,
          order_content: goodsinfo.orderContent
        },
        success: res => {
          // 上传图片
          var imagesList = this.data.imagesList
          for (var index in imagesList) {
            wx.cloud.uploadFile({
              cloudPath: "openId/" + index,
              filePath: imagesList[index],
              success: res => {
                //跳转到消息tbar页
                wx.switchTab({
                  url: '/pages/index/index',
                  success: res => {
                    wx.showToast({
                      icon: 'none',
                      title: '上传成功'
                    })
                  }
                })
              },
              fail: e => {
                wx.showToast({
                  icon: 'none',
                  title: '上传失败'
                })
              },
              complete: () => {}
            })
          }
        }
      })
    }
  }

})