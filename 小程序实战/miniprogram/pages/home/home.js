let searchkey = "";
let db = wx.cloud.database();
let rindex = 0;
let country_database = "";
let loading = false; //定义一个变量来判断是否loading
Page({
  data: {
    imagelist: [],
    hotlist: [],
    country_need: [
      "Britain_school",
      "Italy_school",
      "NewZealand_school",
      "Singapore_school",
      "Germany_school",
      "Sweden_school",
      "Switzerland_school",
      "Holland_school",
      "Japan_school",
      "Korea_school",
      "Malaysia_school",
      "Luxembourg_school",
      "France_school",
      "Australia_school",
      "Denmark_school",
      "Spain_school",
      "Canada_school",
      "America_school",
      "Portugal_school",
      "Russia_school",
    ],
  },
  getlunbotu() {
    {
      if (!loading) {
        wx.showLoading({
          title: "加载中",
        });
        loading = true;
      }  
      wx.cloud
        .database()
        .collection("lunbotu")
        .get()
        .then((res) => {
          if (loading) {
            wx.hideLoading();
            loading = false;
          }
          console.log("获取轮播图成功", res);
          this.setData({
            imagelist: res.data,
          });
        })
        .catch((res) => {
          console.log("获取轮播图失败", res);
          this.setData({
            imagelist: [
              {
                picture: "../../images/1.jfif",
              },
              {
                picture: "../../images/2.jfif",
              },
              {
                picture: "../../images/3.jfif",
              },
            ],
          });
        });
    }
  },
  onLoad() {
    this.getlunbotu();
  
  },
  onShow(){
    this.gethotlist();
  },
  getdetail(e) {
    searchkey = e.detail.value;
  },
  godetail() {
    console.log("触发了搜索", searchkey);
    if (searchkey && searchkey.length > 0) {
      wx.navigateTo({
        url: "/pages/school_search/school_search?searchkey=" + searchkey,
      });
    } else {
      wx.showToast({
        title: "搜索为空",
        icon: "none",
      });
    }
  },
  click1() {
    wx.navigateTo({
      url: "/pages/college/college",
    });
  },
  click4() {
    wx.navigateTo({
      url: "/pages/postgraduate/postgraduate",
    });
  },
  go() {
    searchkey = "";
    wx.navigateTo({
      url: "/pages/school_search/school_search?searchkey=" + searchkey,
    });
  },
  gethotlist() {
    // 在20个国家中创立随机数，随机显示当前国家的热门数据
    rindex = Math.floor(Math.random() * 20);
    country_database = this.data.country_need[rindex];
    if (!loading) {
      wx.showLoading({
        title: "加载中",
      });
      loading = true;
    }  
    wx.cloud
      .callFunction({
        name: "getdata",
        data: {
          country_database: country_database,
        },
      })
      .then((res) => {
        console.log("获取热门数据成功", res);
        this.setData({
          hotlist: res.result.data,
        });
        console.log("当前热门数据国家为", this.data.hotlist[0].country);
        if (loading) {
          wx.hideLoading();
          loading = false;
        }
        wx.stopPullDownRefresh();
      })
      .catch((res) => {
        console.log("获取失败", res);
      });
  },
  enterschool(e) {
    console.log("得到的参数为", e);
    wx.navigateTo({
      url:
        "/pages/school_detail/school_detail?id=" +
        e.currentTarget.dataset.id +
        "&database_name=" +
        e.currentTarget.dataset.database_name,
    });
  },
  onPullDownRefresh(e){
    console.log("触发了刷新",e)
    this.gethotlist()
  },
    onShareAppMessage() {
      const promise = new Promise(resolve => {
        setTimeout(() => {
          resolve({
            title: 'YZ留学小程序'
          })
        }, 2000)
      })
      return {
        title: 'YZ留学小程序',
        path: '/pages/school_detail/school_detail',
        promise 
      }
    }
});
