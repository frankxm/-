//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
Page({

  data: {
    // 左边菜单数据,右边内容数据
    leftmenulist:[],
    rightcontentlist:[],
    currentindex:0,
    // 被点击的左侧的菜单
    scrolltop:0
    // 右侧内容的滚动条距离顶部的距离

  },
  cates:[],

  onLoad: function (options) {
    // 先判断本地存储有无旧的数据,若无则发送请求,有则使用本地
    // 存储方式:{time:Date.now(),data:[]}
    const cates=wx.getStorageSync('cates');
    if(!cates){
    this.getcategory();
    }
    else{
      // 判断有无过期,时间为5分钟
      if(Date.now()-cates.time>1000*60*5){
        this.getcategory();
      }
      else{
        console.log("可以使用旧的数据")
        this.cates=cates.data;
        let leftmenulist=this.cates.map(v => v.cat_name);
        let rightcontentlist=this.cates[0].children;
        this.setData({
          leftmenulist:leftmenulist,
          rightcontentlist:rightcontentlist
        })
      }
    }
  },
  getcategory(){
    request({
      url:"/categories"
    })
      .then(res=>{
        console.log("获取分类数据成功",res)
        this.cates=res.data.message;
        // 把接口数据存储到本地
        wx.setStorageSync("cates",{time:Date.now(),data:this.cates});
        let leftmenulist=this.cates.map(v=>v.cat_name)
        let rightcontentlist=this.cates[0].children
        this.setData({
          leftmenulist:leftmenulist,
          rightcontentlist:rightcontentlist
        })
      })
      .catch(res=>{
        console.log("获取分类数据失败",res)

      })
    
  
  },
  handleitemtap(e){
  
    let rightcontentlist=this.cates[e.currentTarget.dataset.index].children
    this.setData({
      currentindex:e.currentTarget.dataset.index,
      rightcontentlist:rightcontentlist,
      scrolltop:0
    })
  }

  
})