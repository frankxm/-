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
    writing_text:cloud.database().command.push(event.writing_text),
    user:cloud.database().command.push(event.user),
    support:cloud.database().command.push(false),
    supportnum:cloud.database().command.push(0),
    imgurl:cloud.database().command.push(event.imgurl),
    }
  })
}