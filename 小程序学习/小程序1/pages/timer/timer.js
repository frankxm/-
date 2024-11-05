var hour
 var second 
 var minute
Page({
  data:{
   time_hour:0,
  time_minute:0,
    time_second:0
  },
  onLoad(){
var dateEnd=new Date('2021-7-10 18:00:00')
var dateNow=new Date()
console.log(dateEnd)
console.log(dateNow)
console.log(dateEnd.getTime())
console.log(dateNow.getTime())
var time=dateEnd.getTime()-dateNow.getTime()
console.log("当前时间",dateNow)
console.log("当前时为",(time/1000/60/60%24))
console.log("当前分为",(time/1000/60%60))
console.log("当前秒为",(time/1000%60))
 hour=parseInt(time/1000/60/60%24)
 minute=parseInt(time/1000/60%60)
 second=Math.ceil(time/1000%60)
console.log("还剩"+hour+"时"+minute+"分"+second+"秒")
this.setData({
  time_hour:hour,
  time_minute:minute,
  time_second:second
})
  }


})