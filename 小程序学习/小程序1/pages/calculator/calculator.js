var a=null
var b=null
Page({
  data:{
    num:"",
    result:""
  },
  getname(event){
    console.log(event.detail.value)
    let val=event.detail.value
    this.setData({
      num:val
    })
  },
  getresult(){
     var sum=Number(a)+Number(b)
    // var sum=a+b
    console.log("和为",sum)
    this.setData({
      result:sum
    })
  },
  geta(event_a){
    a=event_a.detail.value
    console.log("a的值为",a)
  },
  getb(event_b){
    b=event_b.detail.value
    console.log("b的值为",b)
  }
   
})