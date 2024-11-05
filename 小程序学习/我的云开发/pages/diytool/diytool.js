// pages/diytool/diytool.js
let index=0
let list=[]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:"首页",
        isActive:true
      },
      {
        id:1,
        name:"原创",
        isActive:false
      },
      {
        id:2,
        name:"分类",
        isActive:false
      },
      {
        id:3,
        name:"关于",
        isActive:false
      }
    ],
  },
  change(e){
    index=e.detail.index
    list=this.data.tabs
    list.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // 遍历数组找到符合index的值并且修改原数组
    this.setData({
      tabs:list
    })
  }

  
})