let addname = ""
let addprice = ""
let type = 0
Page({
  data: {
    list: []
  },
  getlist(type) {
    let db = wx.cloud.database().collection("goods")
    if (type == 1) {
      db = db.orderBy("price", "asc")
    } else if (type == -1) {
      db = db.orderBy("price", "desc")
    }
    db.get().then(res => {
        console.log("返回的数据", res.data)
        this.setData({
          list: res.data
        })
      })
      .catch(err => {
        console.log("请求失败", err)
      })
  },
  onLoad() {
    this.getlist(0)
  },
  godetail(event) {
    console.log("点击跳转得到的数据id", event.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/demo1/demo1?id=" + event.currentTarget.dataset.id
    })
  },
  goname(e1) {
    addname = e1.detail.value
  },
  goprice(e2) {
    addprice = e2.detail.value
  },
  addmerchandise() {
    console.log("添加的商品名", addname)
    console.log("添加的商品价格", addprice)
    if (addname == "") {
      wx.showToast({
        title: '商品名为空',
        icon: 'none'
      })
    } else if (addprice == "") {
      wx.showToast({
        title: '商品价格为空',
        icon: 'none'
      })
    } else { //用户更新
      console.log("进行添加操作")
      wx.cloud.database().collection("goods")
        .add({ //加到数据库
          data: {
            name: addname,
            price: parseInt(addprice)
          }
        })
        .then(res => {
          console.log("添加成功")
          this.getlist(0)
        })
        .catch(err => {
          console.log("添加失败")
        })
    }
  },
  upsort() {
    this.getlist(1)
  },
  downsort() {
    this.getlist(-1)
  }
})