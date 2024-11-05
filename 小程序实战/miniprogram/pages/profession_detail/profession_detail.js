let school_database = "";
let school_id = "";
Page({
  data: {
    school: [],
  },
  onLoad(option) {
    console.log("传进专业页的参数为", option);
    school_database = option.school_database;
    school_id = option._id;
    this.getpolicy();
  },
  getpolicy() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    // 获取缓存中的收藏数组
    let collect = wx.getStorageSync("collection") || [];
    // 判断当前是否被收藏 通过回调函数返回true false
    let iscollect = collect.some((v) => v._id === this._id);
    let index = collect.findIndex((v) => v._id === this._id);
    if (iscollect) {
      console.log("可以使用旧数据");
      this.setData({
        school: collect[index],
      });
      wx.hideLoading();
    } else {
      wx.cloud
        .callFunction({
          name: "getschool_detail",
          data: {
            school_database: school_database,
            school_id: school_id,
         },
        })
        .then((res) => {
          console.log("获取成功", res);
          this.setData({
            school: res.result.data,
          });
          wx.hideLoading();
        })
        .catch((res) => {
          console.log("获取政策数据失败", res);
         
        });
    }
  },
  repetitive_press(){
    wx.showToast({
      title: "跳转中",
      mask: true,
    });
  },
  handleDownload(e) {
    wx.showLoading({
      title: '下载中',
      mask: true,
    });
    let link = e.currentTarget.dataset.link[0];
    let fileName = new Date().valueOf();
    wx.downloadFile({
      url: link,
      filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
      success: res => {
        console.log(res);
        let filePath = res.filePath;
        wx.saveVideoToPhotosAlbum({
          filePath,
          success: file => {
            wx.showToast({
              title: '下载成功',
              type: 'success'
            })
            let fileMgr = wx.getFileSystemManager();
          
            fileMgr.unlink({
              filePath: wx.env.USER_DATA_PATH + '/' + fileName + '.mp4',
              success: function(r) {
              },
            })           
          },
          fail: err => {
            console.log(err)
            if (err.errMsg === 'saveVideoToPhotosAlbum:fail auth deny') {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: data => {
                  wx.openSetting({
                    success(settingdata) {
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击下载即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                  })
                }
              })
            }
          }
        })
        wx.hideLoading();
      }
    })
  },
　　

});
