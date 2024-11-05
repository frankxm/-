//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
/*
防止输入抖动 利用定时器
定义一个全局定时器id 每次请求前先清除之前定时器再开启当前定时器设定时间后发送请求
用于防止重复输入 重复发送请求的情况
*/

Page({
  data: {
    searchlist:[],
    isfocus:false,
    inputvalue:""
  },
  timeid:-1,
 onLoad(){

 },
 handleinput(e){
   const {value}=e.detail
  //  检测输入合法性，如果是空则不往下执行
  if(!value.trim()){
    // 当输入框没有值，值和按钮被隐藏
    this.setData({
      searchlist:[],
      isfocus:false
    })
    return;
  }
  // 输入框有值的时候按钮出来
  this.setData({
    isfocus:true
  })
  // 先清除之前定时器
  clearTimeout(this.timeid)
  // 开启定时器，若无额外请求则1秒后执行
  this.timeid=setTimeout(() => {
    this.getquery(value)
  }, 1000);
 },
 getquery(query){
   request({
     url:"/goods/qsearch",
     data:{ query }
   })
   .then(res=>{
     console.log(res)
     this.setData({
       searchlist:res.data.message,
       
     })
   })
 },
 handlecancel(){
   this.setData({
     inputvalue:"",
     searchlist:[],
     isfocus:false
   })
 }
});