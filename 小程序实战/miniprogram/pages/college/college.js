let school_collection = new Array(20).fill('')  // 100个空数组
Page({
  data: {
    school_list: [],
    country_name:["英国","意大利","新加坡","新西兰","德国","瑞典","瑞士","荷兰","日本","韩国","马来西亚","卢森堡","法国","澳大利亚","丹麦","西班牙","加拿大","美国","葡萄牙","俄罗斯"],
    country_need: [
      "Britain_school",
      "Italy_school",
      "Singapore_school",
      "NewZealand_school",
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
    countrylist: [],
    currentindex: 0,
  },
  onLoad() {
  },
  onShow(){

    wx.showLoading({
      title: "获取中",
    });
    this.gethotlist()
  },
  gethotlist() {
    let currentindex=this.data.currentindex
    let country=this.data.country_need[currentindex]

      wx.cloud
        .database()
        .collection(country)
        .get()
        .then((res) => {
          console.log("获取国家信息成功",res)
          //缓存操作
          if(country=="Britain_school"){
          school_collection[0]=res.data
          }
          else{
         school_collection[currentindex]=res.data
        }
        wx.setStorageSync("school_collection", {time:Date.now(),data:school_collection});
          this.setData({
            school_list:res.data
          })
          wx.hideLoading();
        })
        .catch((res) => {
          console.log("获取国家信息失败", res);
        });
  },
  gocountry(e) {
    wx.showLoading({
      title: "加载中",
    })
    const{cindex}=e.currentTarget.dataset
    let currentindex=cindex
    const school_collection=wx.getStorageSync('school_collection')
    if(!school_collection.data[currentindex]){
      this.setData({
        currentindex:currentindex
      })
    this.gethotlist();
    }
    else {
      // 判断有无过期,时间为5分钟
      if(Date.now()-school_collection.time>1000*60*5){
        this.setData({
          currentindex:currentindex
        })
        this.gethotlist();
      }
      else{
        console.log("可以使用旧的数据")
        let school_list=school_collection.data[currentindex];
        this.setData({
          currentindex: currentindex,
          school_list:school_list
        })
        wx.hideLoading();
      }
    }

  },
  enterschool(e){
    const id=e.currentTarget.dataset.id
    const database_name=e.currentTarget.dataset.database_name
    wx.navigateTo({
      url:
        "/pages/school_detail/school_detail?id=" +
        id +
        "&database_name=" +
        database_name,
    })
  },
  onPullDownRefresh(e){
    this.gethotlist()
    wx.stopPullDownRefresh()
  },
});
