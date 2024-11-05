
// // pages/function/function.js
Page({
  getname1(){
    console.log("点击了text，执行函数")
  },
  getname2(){
    console.log("点击了view,执行函数")
  },
  getcontent(content){
    console.log("输入的内容是",content.detail.value)
  }
//   /**
//    * 页面的初始数据
//    */
//   data: {

//   },

//   /**
//    * 生命周期函数--监听页面加载，第一步
//    */
//   onLoad: function (options) {
//    console.log("onload1")
//   },
//   //两函数同名，第二个覆盖第一个
//   onLoad(){
//     console.log("onload2")
//   },

//   /**
//    * 生命周期函数--监听页面初次渲染完成,第三步
//    */
//   onReady: function () {
//    console.log("onready")
//   },

//   /**
//    * 生命周期函数--监听页面显示，第二步
//    */
//   onShow: function () {
//    console.log("show")
//   },

//   /**
//    * 生命周期函数--监听页面隐藏,切后台显示
//    */
//   onHide: function () {
//    console.log("onhide")
//   },

//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {

//   },

//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {

//   },

//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {

//   },

//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {

//   }
 })