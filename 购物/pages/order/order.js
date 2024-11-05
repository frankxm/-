/*
1 页面被频繁打开，使用onShow 
2 打开页面后获取url上的参数type 同时根据type 发送请求获取数据并渲染
3 点击不同标题，重新获取数据渲染
4 在获取数据前首先需要判断缓存中有无token 若无则先获取
*/
//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
Page({
  data: {
    tabs:[
      {
        id:0,
        value:"全部",
        isActive:true
      },
      {
        id:1,
        value:"待付款",
        isActive:false
      }, 
      {
        id:2,
        value:"待发货",
        isActive:false
      },
      {
        id:3,
        value:"退货、退款",
        isActive:false
      },
    ],
    orders:[]
  },

 
  onLoad: function (options) {

  },
  // onShow无法像onLoad一样获取options 需要获取当前小程序的页面栈的方法获取 页面栈长度最大为10页
  onShow(options){
    let token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      // 成功进入后再返回
      return;
    }
    let pages= getCurrentPages();
    let currentpage=pages[pages.length-1]
    const { type }=currentpage.options
    this.changetitle(type-1)
    this.getorder(type)
  },
  getorder(type){
    request({
      url:"/my/orders/all",
      data:{type},
    })
    .then(res=>{
      console.log("成功获取历史订单",res)
      this.setData({
        // 获取数据时遍历处理时间参数 先将当前create_time转换成以毫秒为单位的create_time_cn 再获取时间错获取时间
        orders:res.orders.map(v=>({...v,create_time_cn:(new Date(create_time*1000).toLocaleString())}))
      })
    })
  },
  changetitle(index){
    let t=this.data.tabs;
    t.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs:t
    })
  },
  handletabsitemchange(e){
    const{index}=e.detail;
    this.changetitle(index)
    // 点击其他标题重新发送请求
    this.getorder(index+1)
  },

  
})