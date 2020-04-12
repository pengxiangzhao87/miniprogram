// pages/merchant/active/active.js
var util = require('../../../utils/util.js')
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
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    imagesList:[]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //上传图片
    uploader: function () {
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
        success: function (res) {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 500
          })
          if (res.tempFiles.length > maxLength) {
            wx.showModal({
              content: '最多能上传3张图片',
              showCancel: false,
              success: function (res) { }
            })
          }

          for (var i = 0; i < res.tempFilePaths.length; i++) {
            imageList[imageLength + i] = res.tempFilePaths[i];
            if (res.tempFiles[i].size > maxSize) {
              flag = false;
              wx.showModal({
                content: '图片太大，不允许上传',
                showCancel: false,
                success: function (res) { }
              });
            }

          }
          if (flag == true && res.tempFiles.length <= maxLength) {
            that.setData({
              imagesList: imageList
            })
          }
        },
        fail: function (res) {
          console.log(res);
        }
      })
    },

    //删除图片
    deleteImg: function (e) {
      var imagesList = this.data.imagesList;
      var index = e.currentTarget.dataset.index;
      imagesList.splice(index, 1);
      this.setData({
        imagesList: imagesList
      });
    },

    //预览图片
    enlargeImg: function (e) {
      var index = e.target.dataset.index
      var imagesList = this.data.imagesList
      wx.previewImage({
        current: imagesList[index],  //当前预览的图片
        urls: imagesList  //所有要预览的图片
      })
    },

    formSubmit:function(e){   
      //上传图片
      wx.getStorage({
        key: 'openid',
        complete: res => {
          var openid = res.data;
          // 上传图片
          var imagesList = this.data.imagesList
          var fileID ='';
          var timestamp = Date.parse(new Date());
          var flag = 0;
          for (var index in imagesList) {
            wx.cloud.uploadFile({
              cloudPath: openid + "/" + timestamp+'_'+index,
              filePath: imagesList[index],
              success: res => {
                fileID += res.fileID +',';
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
                if (flag == imagesList.length-1){ 
                  db.collection('merchant_order').add({
                    data: {
                      create_date: util.formatTime(new Date()),
                      orderContent: e.detail.value.orderContent,
                      state: '0',
                      fileID: fileID.substring(0,fileID.length-1)
                    },
                    success: res => {
                      wx.showToast({
                        title: '发布成功',
                        icon: 'success',
                        duration: 1000,
                        success: res => {
                          setTimeout(function () {
                            //要延时执行的代码
                            //跳转到广场
                            wx.redirectTo({
                              url: '/pages/tabbar/tabbar?currentTab=2'
                            })
                          }, 1000) //延迟时间 
                        }
                      })
                    }
                  })
                }else{
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
