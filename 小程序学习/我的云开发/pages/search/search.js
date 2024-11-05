
Page({
  data: {

  },
  onLoad () {
  let searchkey='小石头'
  let db=wx.cloud.database()
  let _=db.command
  db.collection('news')
  .where(_.and([
    {
    title:db.RegExp({
      regexp:searchkey,
      options:'i',
    }),
  },
  {
    desc:db.RegExp({
      regexp:searchkey,
      options:'i',
    }),
  }
]))
  .get()
  .then(res=>{
  console.log("查询成功",res)
  })
  .catch(err=>{
  console.log("查询失败",err)
  })
  }
})