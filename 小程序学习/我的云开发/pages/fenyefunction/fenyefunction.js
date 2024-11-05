var len = 0
Page({
  data: {
    list: []
  },
  getlist() {
    len = this.data.list.length
    console.log("长度", len)
    wx.showLoading({
      title: '加载中..',
    })
    wx.cloud.callFunction({
        name: "fenye",
        data: {
          pagenum: 30, //每页加载多少条数据
          curlen: len //用于分页里的skip
        }
      })
      .then(res => {
        console.log("获取成功", res)
        wx.hideLoading()
        console.log("当前获取数据的长度", res.result.data.length)
        if (res.result.data.length == 0) {
          wx.showToast({
            title: '没有新的数据了',
            icon: "none"
          })
        }
        this.setData({
          list: this.data.list.concat(res.result.data)
        })
      })
      .catch(res => {
        console.log("获取失败", res)
        wx.hideLoading()
      })
  },
  onLoad() {
    this.getlist()
  },
  onReachBottom() {
    this.getlist()
  }
})