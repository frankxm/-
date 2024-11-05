// pages/array/array.js
var num=null
Page({
  /**
   * 页面的初始数据
   */
  data: {
 list:[]
  },
 getnum(event){
   num=Number(event.detail.value)
 },
 addnums(){
   var num2=this.data.list
  num2.push(num)
  console.log(num2)
  this.setData({
  list:num2
 })
},
 deletenums(){
 var num3=[]
 for(var i=0;i<this.data.list.length;i++){
   if(this.data.list[i]!=num){
     num3.push(this.data.list[i])
   }
 }
 console.log("新的数组",num3)
 this.setData({
   list:num3
 })
}
})