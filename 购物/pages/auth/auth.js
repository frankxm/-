//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
let code=""
let token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
// 用接口文档的暂时token


Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handlegetinfo(e){
    // 获取用户信息
    const {encryptedData,rawData,iv,signature}=e.detail
    // 获取小程序登录成功后的code
    wx.login({
      timeout:10000,
      success: (result)=>{
        code=result.code
      },
    });
    const loginparams={encryptedData,rawData,iv,signature,code}
    // 根据以上参数发送请求获取用户token值
    request({
      url:"/users/wxlogin",
      data:loginparams,method:"POST"
    })
      .then(res=>{
        console.log("获取成功",res)
        })
    // 把token存入缓存，同时跳转回上一个界面
    wx.setStorageSync('token', token)

    // 返回上一层
    wx.navigateBack({
      delta: 1
    });
  }
})