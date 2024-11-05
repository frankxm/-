// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  return await 
  cloud.database().collection(event.school_database)
  .doc(event.school_id)
  .update({
    data:{
    writing_text:event.writing_text,
    user:event.user,
    support:event.support,
    supportnum:event.supportnum,
    imgurl:event.imgurl
    }
  })
}