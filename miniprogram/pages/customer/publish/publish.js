var util = require('../../../utils/util.js')
Component({

  data: {
    //接受商品分类信息
    orderType: {},
    imagesList: [],
    //当前选择的生鲜类型
    currentType: {},
    typeNames: [],
    currentIndex:0 ,
    list:[]
  },
  pageLifetimes: {
    show() {
      if (typeof this.getTabBar === 'function' && this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0
        })
      }
      // 获得dialog组件
      this.userInfo = this.selectComponent("#getUserInfo");
    },

  },
  ready: function() {
    var _this = this;
    var db = wx.cloud.database();
    db.collection("order_type").get({
      success: function(res) {
        var _typeNmes = [];
        for (var i = 0; i < res.data.length; i++) {
          _typeNmes.push(res.data[i].type_name)
        }
        _this.setData({
          typeNames: _typeNmes,
          list:res.data
        })

      }
    })
  },

  methods: {
    bindCountryChange: function(e) {
      this.setData({
        currentIndex: e.detail.value
      })
    },
    reachBottom:function(){},
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
      wx.previewImage({
        current: imagesList[index], //当前预览的图片
        urls: imagesList, //所有要预览的图片
      })
    },

    //表单提交
    formSubmit: function(e) {

      var list = this.data.list;
      var index = this.data.currentIndex;
      var goodsinfo = e.detail.value;
      var db = wx.cloud.database();
      wx.getStorage({
        key: 'openid',
        complete: res => {
          var openid = res.data;
          // 上传图片
          var imagesList = this.data.imagesList
          var fileID = '';
          var timestamp = Date.parse(new Date());
          var flag = 0;
          for (var index in imagesList) {
            wx.cloud.uploadFile({
              cloudPath: openid + "/" + timestamp + '_' + index,
              filePath: imagesList[index],
              success: res => {
                fileID += res.fileID + ',';
              },
              fail: e => {
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                  duration: 1000
                })
              },
              complete: () => {
                //都上传完以后，新增订单
                if (flag == imagesList.length - 1) {
                  db.collection('cust_order').add({
                    data: {
                      create_date: util.formatTime(new Date()),
                      express_type: goodsinfo.radio,
                      order_content: goodsinfo.content,
                      order_type: list[index]._id,
                      name: goodsinfo.name,
                      price: goodsinfo.price,
                      state: 0,
                      fileID: fileID.substring(0, fileID.length - 1)
                    },
                    success: res => {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success'
                      })
                    },fail: e => {
                      wx.showToast({
                        icon: 'none',
                        title: '上传失败'
                      })
                    }
                  })
                } else {
                  ++flag;
                }
              }
            })
          }
        }
      })
 
    }
  }

})