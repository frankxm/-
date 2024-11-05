let loading = false; //定义一个变量来判断是否loading
Page({
  data: {
    website: [],
    tabs: [
      {
        id: 0,
        value: "我的收藏",
        isActive: true,
      },
      {
        id: 1,
        value: "汇率查询",
        isActive: false,
      },
      {
        id: 2,
        value: "学校网址",
        isActive: false,
      },
    ],
    schoollist: [],
    length: 0,
    pagenum: 50,
    totallength: 153,
  },
  onLoad() {},
  onShow() {
    if (!loading) {
      wx.showLoading({
        title: "加载中",
      });
      loading = true;
    }

    wx.showLoading({
      title: "加载中",
    });
    const collect = wx.getStorageSync("collection") || [];
    this.setData({
      schoollist: collect,
    });
    this.getwebsite();
    if (loading) {
      wx.hideLoading();
      loading = false;
    }
  },
  handleenter(e) {
    const id = e.currentTarget.dataset._id;
    const database_name = e.currentTarget.dataset.country_database;
    wx.navigateTo({
      url:
        "/pages/school_detail/school_detail?id=" +
        id +
        "&database_name=" +
        database_name,
    });
  },
  handletabsitemchange(e) {
    const { index } = e.detail;
    let t = this.data.tabs;
    t.forEach((v, i) =>
      i === index ? (v.isActive = true) : (v.isActive = false)
    );
    this.setData({
      tabs: t,
    });
  },
  onShareAppMessage() {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          title: "YZ留学小程序",
        });
      }, 2000);
    });
    return {
      title: "YZ留学小程序",
      path: "/pages/school_detail/school_detail",
      promise,
    };
  },
  getwebsite() {
    let pagenum = this.data.pagenum;
    let length = this.data.length;
    const net = "net";
    if (!loading) {
      wx.showLoading({
        title: "加载中",
      });
      loading = true;
    }
    wx.cloud
      .callFunction({
        name: "fenye",
        data: {
          database_name: net,
          length: length,
          pagenum: pagenum,
        },
      })
      .then((res) => {
        console.log("获取网址数据成功", res);
        length += res.result.data.length;
        this.setData({
          website: this.data.website.concat(res.result.data),
          length: length,
        });
        if (loading) {
          wx.hideLoading();
          loading = false;
        }
      })
      .catch((res) => {
        console.log("获取失败", res);
      });
  },

  onReachBottom() {
    let length = this.data.length;
    let totallength = this.data.totallength;
    if (length >= totallength) {
      wx.showToast({
        title: "没有数据了",
        icon: "none",
      });
    } else {
      this.getwebsite();
    }
  },
});
