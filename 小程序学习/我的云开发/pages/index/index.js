Page({
  data:{
    list:[]
  },
  onLoad(){
    wx.cloud.database().collection("goods")
    .doc("cbddf0af60edac17169a23c421ac5c09")
    .update({
      data:{
      price:1
      }
    })
    .then(res=>{
   console.log("返回的数据",res.data)
   this.setData({
     list:res.data
   })
    })
    .catch(err=>{
     console.log("请求失败",err)
    })
  }
  // onLoad(){
  //   wx.cloud.database().collection("goods")
  //   .add({//添加数据
  //   data:{
  //   name:"荔枝",
  //   price:10
  //   }
  //   })
  //   .then(res=>{
  //  console.log("返回的数据",res.data)
  //  this.setData({
  //    list:res.data
  //  })
  //   })
  //   .catch(err=>{
  //    console.log("请求失败",err)
  //   })
  // }
  // onLoad(){
  //   //固定写法
  //   wx.cloud.database().collection("goods").get()
  //   .then(res=>{//请求成功
  //   console.log("请求成功")
  //   this.setData({
  //     list:res.data
  //   })
  //   })
  //   .catch(err=>{//请求失败
  //  console.log("请求失败")
  //   })
  // }
  // onLoad(){
  //   wx.cloud.database().collection("goods")
  //     .doc("数据id")
  //   .where({//查询符合条件的数据
  //     name:"橘子",
  //     price:8
  //   })
  //   .get()
  //   .then(res=>{
  //  console.log("返回的数据",res)
  //  this.setData({
  //    list:res.data
  //  })
  //   })
  //   .catch(err=>{
  //    console.log("请求失败",err)
  //   })
  // }
})