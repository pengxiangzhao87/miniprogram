// pages/merchant/store/store.js
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
      if(that.data.userInfo._openid==undefined){
        wx.getStorage({
          key: 'openid',
          success: function (res) {
            db.collection('user_info').where({
              _openid: res.data
            }).get({
              success: res => {
                if (res.data[0].image_url!=undefined){
                  var imageUrl = res.data[0].image_url.split(',');
                  res.data[0].fileID = imageUrl;
                }
                that.setData({
                  userInfo: res.data[0]
                })
              }
            })
          }
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
    userInfo:{},
    disabled:true,
    textWord:'编辑'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    save:function(e){
      var that = this;
      var disabled = that.data.disabled;
      var textWord = that.data.textWord;
      if (textWord=='保存'){
        var userInfo = that.data.userInfo;
        if(userInfo.fileID==undefined){
          wx.showToast({
            title: '请添加图片',
            icon: 'none',
            duration: 1000
          })
          return;
        }
        var timestamp = Date.parse(new Date());
        wx.getStorage({
          key: 'openid',
          complete: res => {
            var openid = res.data;
            db.collection('user_info').where({
              _openid: openid
            }).get({
              success: res => {
                var deleteImage = [];
                var uploadImage = [];
                if (res.data[0].image_url!=undefined){
                  deleteImage = res.data[0].image_url.split(',');
                }
                var keepImage = '';
                for (var index in userInfo.fileID) {
                  var image = userInfo.fileID[index];
                  var dex = deleteImage.indexOf(image);
                  if (image.indexOf('cloud') == 0) {
                    keepImage += image + ',';
                    if (dex > -1) {
                      deleteImage.splice(dex, 1);
                    }
                  } else {
                    uploadImage[uploadImage.length] = image;
                  }
                }
                if (deleteImage.length > 0) {
                  //删除旧图片
                  wx.cloud.deleteFile({
                    fileList: deleteImage,
                    complete: res => {
                    }
                  })
                }
                //上传店铺图片
                var fileID = userInfo.fileID;
                var count = 0;
                var imageUrl = '';
                if (uploadImage.length>0){
                  for (var index in uploadImage) {
                    wx.cloud.uploadFile({
                      cloudPath: openid + "/" + timestamp + '_' + index,
                      filePath: uploadImage[index],
                      success: res => {
                        imageUrl += res.fileID + ',';
                        count++;
                      },
                      complete: res => {
                        if (count == uploadImage.length) {
                          var uplodPic = keepImage + imageUrl;;
                          uplodPic = uplodPic.substring(0, uplodPic.length - 1)
                          db.collection('user_info').doc(userInfo._id).update({
                            data: {
                              avatarUrl: userInfo.avatarUrl,
                              address: e.detail.value.address,
                              business_hours: e.detail.value.business_hours,
                              number: e.detail.value.number,
                              content: e.detail.value.content,
                              image_url: uplodPic,
                              name: e.detail.value.name
                            }, success: res => {
                              wx.showToast({
                                title: '修改成功',
                                duration: 1000
                              })
                            }
                          })
                        }
                      }
                    })
                  }
                }else{
                  db.collection('user_info').doc(userInfo._id).update({
                    data: {
                      avatarUrl: userInfo.avatarUrl,
                      address: e.detail.value.address,
                      business_hours: e.detail.value.business_hours,
                      number: e.detail.value.number,
                      content: e.detail.value.content,
                      name: e.detail.value.name
                    }, success: res => {
                      wx.showToast({
                        title: '修改成功',
                        duration: 1000
                      })
                    }
                  })
                }
              }
            })
          }
        })
      }
      that.setData({
        disabled: !disabled,
        textWord: !disabled?'编辑':'保存'
      })
    },
    cancel:function(){
      var that = this;
      var disabled = that.data.disabled;
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          db.collection('user_info').where({
            _openid: res.data
          }).get({
            success: res => {
              if (res.data[0].image_url!=undefined){
                var imageUrl = res.data[0].image_url.split(',');
                res.data[0].fileID = imageUrl;
              }
              that.setData({
                userInfo: res.data[0],
                disabled: !disabled,
                textWord: '编辑' 
              })
            }
          })
        }
      })
    },
    uploader: function () {
      var that = this;
      if(that.data.disabled){
        return;
      }
      wx.chooseImage({
        count: 1, //最多可以选择的图片总数
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          wx.showToast({
            title: '正在上传...',
            icon: 'loading',
            mask: true,
            duration: 500
          })
          if (res.tempFiles.length > 1) {
            wx.showModal({
              content: '最多能上传1张图片',
              showCancel: false,
              success: function (res) { }
            })
          }
          var avatarUrl =  res.tempFilePaths[0];
          var userInfo = that.data.userInfo;
          userInfo.avatarUrl = avatarUrl;
          that.setData({
            userInfo:userInfo
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    },

    //删除图片
    deleteImg: function (e) {
      var that = this;
      var userInfo = that.data.userInfo;
      var fileID = userInfo.fileID;
      var index = e.currentTarget.dataset.index;
      fileID.splice(index, 1);
      that.setData({
        userInfo: userInfo
      });
    },

    uploader2: function () {
      var that = this;
      if (that.data.disabled) {
        return;
      }
      var userInfo = that.data.userInfo;
      var imageLength = 0;
      var imageList = [];
      if (userInfo.fileID!=undefined){
        imageList = userInfo.fileID
        imageLength = imageList.length;
      }
      var maxLength = 6 - imageLength;
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
              content: '最多能上传6张图片',
              showCancel: false,
              success: function (res) { }
            })
            return;
          }
          for (var i = 0; i < res.tempFilePaths.length; i++) {
            imageList[imageLength + i] =  res.tempFilePaths[i];
          }
          userInfo.fileID = imageList;
          that.setData({
            userInfo: userInfo
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    },

  }
})
