let i = ""
let newprice = ""
Page({
  data: {
    list: {}
  },
  onLoad(option) {
    console.log("列表携带的参数", option) //从列表详情页得到的跳转参数
    i = option.id
    this.getwanteddetail()
  },
  getwanteddetail() {
    wx.cloud.database().collection("goods") //更新到数据库后再显示出来
      .doc(i) //选定了特定的商品编译
      .get()
      .then(res => {
        console.log("操作成功", res)
        this.setData({
          list: res.data
        })
      })
      .catch(res => {
        console.log("操作失败")
      })
  },
  getnewprice(p) {
    newprice = p.detail.value
  },
  updateprice() {
    if (newprice == "") {
      wx.showToast({
        title: '输入价格为空',
        icon: 'none',
      })
    } else {
      //云数据库调用
      // wx.cloud.database().collection("goods")
      //   .doc(i)
      //   .update({
      //     data: {
      //       price: newprice
      //     }
      //   })
      //云函数调用
      wx.cloud.callFunction({
        name:"update",
        data:{
          id:i,
          price:parseInt(newprice)
        }
      })
        .then(res => {
          console.log("更新价格成功", res.data)
          this.getwanteddetail()
        })
        .catch(err => {
          console.log("添加失败")
        })
    }
  },
  delete() {
    wx.showModal({
      title: "是否确定删除",
      content: "仔细考虑是否确定删除数据，删除可能无法找回",
      success(res) {
        if (res.confirm == true) {
          console.log("用户点击了确定")
          // wx.cloud.database().collection('goods')
          //   .doc(i)
          //   .remove()
          wx.cloud.callFunction({
            name:"remove",
            data:{
              id:i
            }
          })
            .then(res => {
              console.log("删除成功")
              wx.navigateTo({
                url: '/pages/database/database',
              })
            })
            .catch(res => {
              console.log("删除失败")
            })
        } else if (res.cancel == true)
          console.log("用户点击了取消")
      }
    })
  }

})