// app.js
App({
  //小程序一启动就执行
  onLaunch() {
   console.log("小程序已启动，准备初始化")
   wx.cloud.init({
    env:"frank-0gtl4e4390f31cd9"//云开发环境ID
   })
  },
  globalData:{
    islogin:false,
    current_user:''
  }
})