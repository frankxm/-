// app.js
App({
  //小程序一启动就执行
  onLaunch() {
   console.log("小程序已启动，准备初始化")
   wx.cloud.init({
    env:"frank-0gtl4e4390f31cd9"//云开发环境ID
   })
  },
  // 应用被用户看到
  onShow(){
    // 对应用的数据或页面效果重置
    console.log("onShow")
  },
  // 应用被隐藏
  onHide(){
    // 暂停或者清除定时器
    console.log("Hide")
  },
  // 应用的代码发生了报错时候触发
  onError(err){
    // 收集用户的错误信息
    console.log("onError")
    console.log(err)
  },
  onPageNotFound(){
    // 如果页面不存在了，通过js方式跳转页面
    wx.navigateTo({
      url: '',
    })
  }

})
