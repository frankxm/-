//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
Page({
  data: {
    swiperlist:[],
    categorylist:[],
    floorlist:[]
  },
  //options(Object)
  onLoad: function (options) {
 this.getLunbotu();
 this.getcategory();
 this.getfloor()
  },
  getLunbotu(){
     //   wx.request({
  //     url: 'https://api.it120.cc/kotoba/banner/list',
  //     success: (result)=>{
  //       console.log("获取轮播数据成功",result.data)
  //       this.setData({
  //         swiperlist:result.data.data
  //       })
  //     },
  //     fail: (result)=>{
  //       console.log("获取轮播数据失败",result)
  //     },
      
  //   });
  request({url: "/home/swiperdata"})
  .then(result=>{
    console.log("获取轮播数据成功",result.data)
          this.setData({
            swiperlist:result.data.message
          })
  })
  },
  getcategory(){
    request({url: "/home/catitems"})
  .then(result=>{
    console.log("获取导航数据成功",result.data)
          this.setData({
            categorylist:result.data.message
          })
  })
  },
  getfloor(){
    request({url: "/home/floordata"})
    .then(result=>{
      console.log("获取楼层数据成功",result.data)
            this.setData({
              floorlist:result.data.message
            })
    })
  }
  
});