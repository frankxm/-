// pages/gooddetail/gooddetail.js
var i=""
Page({

  /**
   * 页面的初始数据
   */
  data: {
  detail:""
  },
  getmorelist(){
    wx.cloud.database().collection("goods")
    .doc(i)
    .get()
    .then(res=>{
     console.log("成功获取",res)
     wx.stopPullDownRefresh()
     this.setData({
       detail:res.data
     })
    })
    .catch(res=>{
     console.log("获取失败",res)
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  wx.startPullDownRefresh()
  console.log("详情页拿到目标ID",options.id)
  i=options.id
  this.getmorelist()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  console.log("用户刷新了")
  this.getmorelist()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})