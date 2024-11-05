// 分页展示
const db = wx.cloud.database();
let _ = db.command;
let c = "";
let country_need = [
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
];
let medium = [];
let parameter = "";
let loading = false; //定义一个变量来判断是否loading
Page({
  data: {
    schoollist: [],
  },
  search_key:"",
  getsearch(searchkey) {
		 searchkey = searchkey.replace(/\s*/g,"")
    medium = [];
    if (!loading) {
      wx.showLoading({
        title: "加载中",
      });
      loading = true;
    } 
    if(searchkey){
    for (var count = 0; count < 20; count++) {
      c = country_need[count];
      db.collection(c)
        .where(
          _.or([
            {
              school_name: db.RegExp({
                regexp: searchkey,
                options: "i",
              }),
            },
            {
              country: db.RegExp({
                regexp: searchkey,
                options: "i",
              }),
            },
            {
              profession: db.RegExp({
                regexp: searchkey,
                options: "i",
              }),
            },
          ])
        )
        .get()
        .then((res) => {
          console.log("查询成功", res.data);
          if (res.data[0] != null) medium.push(res.data);
          this.setData({
            schoollist: medium,
          });
          if (loading) {
            wx.hideLoading();
            loading = false;
          }
          wx.stopPullDownRefresh();
        })
        .catch((res) => {
          console.log("查询失败", res);
        });
    }
  }
    else{
      this.setData({
        schoollist:[]
      })   
      if (loading) {
        wx.hideLoading();
        loading = false;
      }
    }
  },
  onShow() {
    //通过页面栈来获取options
    let pages = getCurrentPages();
    let currentpage = pages[pages.length - 1];
    let options = currentpage.options;
    let searchkey = options.searchkey;
    this.search_key=searchkey
    this.getsearch(searchkey);
  },
  getdetail(e) {
    parameter = e.detail.value;
  },
  godetail() {
    let searchkey = parameter;
    this.search_key=searchkey
    this.getsearch(searchkey);
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
  onPullDownRefresh() {
    let search_key=this.search_key
    this.getsearch(search_key);
  },
});
