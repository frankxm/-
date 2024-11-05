Page({
  /**
   * 页面的初始数据
   */
  data: {
    school: [],
    country_database: "",
    _id: "",
    support: [],
    supportnum: [],
    index: -1,
    currentindex: -1,
    islogin: "",
    userInfo: "",
    currentuser: "",
    again: false,
    imgurl: [],
    showModal: false,
    tempfile: "",
    isadd: false,
    text: "",
  },
  _id: "",
  country_database: "",
  onShow() {
    let again = this.data.again;
    if (again) {
      wx.showModal({
        title: "提示",
        content: "添加失败，需要重试嘛",
        showCancel: true,
        cancelText: "取消",
        confirmText: "确定",
        success: (result) => {
          if (result.confirm) {
            wx.navigateTo({
              url:
                "/pages/writing/writing?_id=" +
                this._id +
                "&country_database=" +
                this.country_database,
            });
          }
        },
      });
    }
    let user = wx.getStorageSync("user") || [];
    this.setData({
      currentuser: user,
      again: false,
    });
    this.getcomment();
  },
  onLoad(e) {
    this._id = e._id;
    this.country_database = e.country_database;
    let user = wx.getStorageSync("user");
    let islogin = wx.getStorageSync("islogin");
    console.log("用户信息", user, islogin);
    this.setData({
      country_database: e.country_database,
      _id: e._id,
      islogin: islogin,
    });
  },
  getcomment() {
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    wx.cloud
      .callFunction({
        name: "getschool_detail",
        data: {
          school_database: this.country_database,
          school_id: this._id,
        },
      })
      .then((res) => {
        console.log("获取成功", res);
        let r = res.result.data;
        if (r.user) {
          this.setData({
            school: r,
            userInfo: r.user,
            supportnum: r.supportnum,
            support: r.support,
            imgurl: r.imgurl,
          });
        } else {
          this.setData({
            school: r,
            supportnum: r.supportnum,
            support: r.support,
            imgurl: r.imgurl,
          });
        }
        wx.hideLoading();
      })
      .catch((res) => {
        console.log("获取失败", res);
      });
  },
  handlecancel(e) {
    let writing_text = this.data.school.writing_text;
    let index = e.currentTarget.dataset.id;
    let user = this.data.userInfo;
    let support = this.data.support;
    let supportnum = this.data.supportnum;
    let imgurl = this.data.imgurl;
    wx.showModal({
      title: "提示",
      content: "您是否要删除",
      success: (result) => {
        if (result.confirm) {
          writing_text.splice(index, 1);
          user.splice(index, 1);
          support.splice(index, 1);
          supportnum.splice(index, 1);
          wx.cloud.deleteFile({
            fileList: [imgurl[index]],
            success(res) {
              console.log("删除云存储的文件成功");
            },
            fail(err) {
              console.log(err);
            },
          });
          imgurl.splice(index, 1);
          wx.cloud
            .callFunction({
              name: "remove",
              data: {
                school_database: this.country_database,
                school_id: this._id,
                writing_text: writing_text,
                user: user,
                support: support,
                supportnum: supportnum,
                imgurl: imgurl,
              },
            })
            .then((res) => {
              console.log("删除评论数据成功");
              this.setData({
                tempfile: "",
              });
              this.getcomment();
            })
            .catch((res) => {
              console.log("删除评论数据失败", res);
            });
        }
      },
    });
  },
  handlesupport(e) {
    let writing_html = this.data.school.writing_html;
    let user = this.data.userInfo;
    let support = this.data.support;
    let supportnum = this.data.supportnum;
    let index = e.currentTarget.dataset.index;
    support[index] = true;
    supportnum[index]++;
    this.setData({
      support: support,
      supportnum: supportnum,
      index: index,
    });
    support[index] = false;
    wx.cloud
      .callFunction({
        name: "remove",
        data: {
          school_database: this.country_database,
          school_id: this._id,
          supportnum: supportnum,
          support: support,
          writing_html: writing_html,
          user: user,
        },
      })
      .then((res) => {
        console.log("修改点赞成功", res);
        this.timecounter();
      })
      .catch((res) => {
        console.log("修改点赞失败", res);
      });
  },
  timecounter() {
    var that = this;
    let index = this.data.index;
    let support = this.data.support;
    let m = -1;
    var times = 0;
    var i = setInterval(function () {
      times++;
      if (times >= 1) {
        console.log("超时间了", i);
        clearInterval(i);
        support[index] = false;
        that.setData({
          support: support,
          currentindex: m,
        });
      } else {
        console.log("没超时间", i);
      }
    }, 1000);
  },
  handleoppose(e) {
    let writing_html = this.data.school.writing_html;
    let user = this.data.userInfo;
    let support = this.data.support;
    let supportnum = this.data.supportnum;
    let index = e.currentTarget.dataset.index;
    if (supportnum[index] > 0) {
      supportnum[index]--;
      wx.cloud
        .callFunction({
          name: "remove",
          data: {
            school_database: this.country_database,
            school_id: this._id,
            supportnum: supportnum,
            support: support,
            writing_html: writing_html,
            user: user,
          },
        })
        .then((res) => {
          console.log("减少点赞成功", res);
          this.setData({
            supportnum: supportnum,
            currentindex: index,
          });
          this.timecounter();
        })
        .catch((res) => {
          console.log("减少点赞失败", res);
        });
    }
  },
  // 授权登录
  login() {
    let display_user = this.data.userInfo || [];
    wx.getUserProfile({
      desc: "必须授权才可以继续使用",
      success: (res) => {
        let user = res.userInfo;
        // 把用户信息缓存到本地
        wx.setStorageSync("user", user);
        wx.setStorageSync("islogin", true);
        this.setData({
          currentuser: user,
          islogin: true,
          showModal: true,
        });
        // wx.navigateTo({
        //   url:
        //     "/pages/writing/writing?_id=" +
        //     this.data._id +
        //     "&country_database=" +
        //     this.data.country_database,
        // });
      },
      fail: (res) => {
        console.log("授权失败", res);
      },
    });
  },
  onPullDownRefresh(e) {
    this.getcomment();
    wx.stopPullDownRefresh();
  },
  showDialogBtn: function () {
    this.setData({
      showModal: true,
    });
  },
  hideModal: function () {
    let isadd = this.data.isadd;
    let tempfile = this.data.tempfile;
    if (isadd === true) {
      this.setData({
        showModal: false,
        isadd: false,
      });
      this.getcomment();
    } else {
      if (tempfile != "") {
        wx.cloud.deleteFile({
          fileList: [tempfile],
          success(res) {
            console.log("删除云存储的文件成功");
          },
          fail(err) {
            console.log(err);
          },
        });
      }
      this.setData({
        showModal: false,
        tempfile: "",
      });
    }
  },
  preventTouchMove: function () {},
  insertImage() {
    const that = this;
    let tempfile = this.data.tempfile;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res, "插入的图片");
        let tempfile = res.tempFilePaths[0];
        wx.cloud.uploadFile({
          cloudPath: "user/comment/" + new Date().getTime() + ".png",
          filePath: tempfile,
          success(res) {
            //上传成功后会返回永久地址
            console.log(res.fileID, "当前图片永久地址");
            tempfile = res.fileID;
            that.setData({
              tempfile: res.fileID,
            });
          },
        });
      },
    });
  },
  onInputtingDesc(e) {
    var str=e.detail.value
   
    this.setData({
      text: str,
    });
  },
  handlesubmit() {
    let school_database = this.data.country_database;
    let _id = this.data._id;
    let user = wx.getStorageSync("user");
    let text = this.data.text;
    let imgurl = this.data.tempfile;
    if (text == "" && imgurl == "") {
      wx.showToast({
        title: "输入内容为空，请重新输入",
        icon: "none",
        mask: true,
      });
    } else {
      wx.showLoading({
        title: "提交中",
      });

      wx.cloud
        .callFunction({
          name: "add",
          data: {
            school_database: school_database,
            school_id: _id,
            writing_text: text,
            user: user,
            imgurl: imgurl,
          },
        })
        .then((res) => {
          console.log("添加成功", res);
          wx.hideLoading();
          this.setData({
            isadd: true,
            text: "",
            tempfile: "",
          });
          this.hideModal();
        })
        .catch((res) => {
          console.log("添加失败", res);
        });
    }
  },
  handleremove(e) {
    let tempfile = this.data.tempfile;
    wx.cloud.deleteFile({
      fileList: [tempfile],
      success(res) {
        console.log("删除云存储的文件成功");
      },
      fail(err) {
        console.log(err);
      },
    });
    this.setData({
      tempfile: "",
    });
  },
});
