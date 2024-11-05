let school_id = "";
let school_database = "";
let parameter = "";
const db = wx.cloud.database();
let _ = db.command;
let c = "";
let pro = "";
let viewnum=0;
let isupdate=false;
Page({
  data: {
    school_list: [],
    school: [],
    isclick: false,
    iscollect: false,
    currentindex:-1
  },
  onLoad(option) {
    console.log("传进来的参数为", option);
    school_id = option.id;
    school_database = option.database_name;
    this.handle();
  },
  handle(){
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collection") || [];
    // 判断当前商品是否被收藏 通过回调函数返回true false
    let iscollect = collect.some((v) => v._id === school_id);
    let index = collect.findIndex((v) => v._id === school_id);
    if (iscollect) {
      // 修改数据库中的点击量
       viewnum=collect[index].viewnum
       viewnum++
      collect[index].viewnum=viewnum
      wx.setStorageSync("collection", collect);
      this.setData({
        iscollect: iscollect,
        school: collect[index],
      })
      wx.hideLoading()
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
          viewnum=res.result.data.viewnum
          viewnum++
          this.setData({
            school: res.result.data,
          });
          wx.hideLoading();
        })
        .catch((res) => {
          console.log("获取失败", res);
        });
    }
    wx.cloud.callFunction({
      name:"update",
      data:{
        school_database: school_database,
        school_id: school_id,
        viewnum:viewnum
      }
    })
    .then(res=>{
      console.log("改变点击量成功",res)
    })
    .catch(res=>{
      console.log("改变点击量失败",res)
    })
    
  },
  go() {
    wx.navigateTo({
      url: "/pages/profession_detail/profession_detail?school_database="+school_database+ '&_id=' + school_id,
    });
  },

  radiochange(e) {
    console.log(e)
    wx.showLoading({
      title: "加载中",
      mask: true,
    });
    let school_name=this.data.school.school_name
    parameter = e.detail.value;
    let s = school_database.indexOf('_') 
    let str_new = school_database.substring(0,s )
    let profession_database=str_new+"_profession" 
    console.log("专业栏名字",profession_database)
    db.collection(profession_database)
    .where(
      _.and([
        {
          profession_school: db.RegExp({
            regexp: school_name,
            options: "i",
          }),
        },
        {
          department: db.RegExp({
            regexp: parameter,
            options: "i",
          }),
        },
      ])
    )
    .get()
    .then((res) => {
      console.log("查询成功", res.data);
      this.setData({
        school_list:res.data,
        isclick:true
      })
      wx.hideLoading();
      wx.stopPullDownRefresh();
    })
    .catch((res) => {
      console.log("查询失败", res);
    });
  },
  handlecollect() {
    let iscollect = false;
    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync("collection") || [];
    // 判断该商品是否被收藏过 从缓存中取出的数组进行遍历看是否等于data中的id
    let index = collect.findIndex((v) => v._id === school_id);
    if (index != -1) {
      // 如果找到索引说明有收藏，进行删除
      collect.splice(index, 1);
      iscollect = false;
      wx.showToast({
        title: "取消成功",
        icon: "success",
        mask: true,
      });
    } else {
      // 如果找不到索引说明没有收藏，进行添加当前data里的school
      collect.push(this.data.school);
      iscollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      });
    }
    // 放回缓存
    wx.setStorageSync("collection", collect);
    // 修改data中的iscollect
    this.setData({
      iscollect: iscollect,
    });
  },
  handleimage(e) {
    // 构造需要预览的图片数组
    const urls = this.data.school.school_picture.map((v) => v);
    // // 接受传递过来的图片url
    const current = e.currentTarget.dataset.picture;
    wx.previewImage({
      current: current,
      urls: urls,
      showmenu:true
    });
  },
  handlerefresh(){
    wx.stopPullDownRefresh();
  },
  onPullDownRefresh(e){
    console.log("触发了刷新",e)
    this.handlerefresh()
  },
  getindex(e){
    let index=e.currentTarget.dataset.index
    this.setData({
      currentindex:index
    })
  },

     
});
