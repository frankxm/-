Page({
  data: {

  },
  onLoad() {
    let db = wx.cloud.database()
    const _ = db.command
    db.collection('goods').where(_.and([{
          price: _.gt(5)
        },
        {
          price: _.lt(10)
        }
      ]))
      .get()
      .then(res => {
        console.log("成功", res)
      })
      .catch(err => {
        console.log("失败", err)
      })
  }
})