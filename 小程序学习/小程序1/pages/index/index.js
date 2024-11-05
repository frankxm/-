Page({
  data: {
    userInfo: ""
  },
  onLoad() {
    let user = wx.getStorageSync('user')
    console.log('进入小程序的index页面获取缓存', user)
    this.setData({
      userInfo: user
    })
  },
  // 授权登录
  login() {
    wx.getUserProfile({
      desc: "必须授权才可以继续使用",
      success: res => {
        let user = res.userInfo
        // 把用户信息缓存到本地
        wx.setStorageSync('user', user)
        console.log("用户信息", user)
        this.setData({
          userInfo: user
        })
      },
      fail: res => {
        console.log('授权失败', res)
      }
    })
  },
  // 退出登录
  loginOut() {
    this.setData({
      userInfo: ""
    })
    wx.setStorageSync('user', null)
  }
})

  // login(){
  //   console.log("点击事件执行了")
  //   let that=this
  //   wx.getUserProfile({
  //     desc: '必须授权才可继续使用',
  //     success(res){
  //       console.log("授权成功",res)
  //       that.setData({
  //         nickname:res.userInfo.nickName
  //       })
  //     },
  //     fail(res){
  //       console.log("授权不成功",res)
  //     }
  //   })
  // }
