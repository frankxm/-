// pages/fenye/fenye.js
var len = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list: [],
  },
  getlist() {
    wx.showLoading({
      title: "加载中...",
    });
    len = this.data.list.length;
    console.log("长度", len);
    wx.cloud
      .database()
      .collection("number")
      .skip(len)
      .get()
      .then((res) => {
        console.log("获取成功", res.data);
        wx.hideLoading();
        console.log("当前获取数据的长度", res.data.length);
        if (res.data.length == 0) {
          wx.showToast({
            title: "没有新的数据了",
            icon: "none",
          });
        }
        this.setData({
          list: this.data.list.concat(res.data), //把前面的数据和当前数据连接起来
        });
      })
      .catch((res) => {
        console.log("获取失败", res);
        wx.hideLoading();
      });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    //   for(var i=0;i<120;i++){
    //  console.log('{"_id":"'+(i+1)+'","number":'+(i+1)+'}')
    //打印大量数据并放到word中删除相同项
    this.getlist();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getlist();
  },
});
