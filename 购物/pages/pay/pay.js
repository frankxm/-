//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
/*
微信支付
1 企业帐号 
2 企业帐号的小程序后台给开发者添加上白名单
其中一个appid可以同时绑定多个开发者 这些开发者可以共用appid和它的开发权限
*/
// 因为学习需要，没有权限，用了写死的一个token获得了order_number然后发起了预支付最后实际支付无法获得权限
let order_number=""
Page({
  data: {
    address:{},
    cart:[],
    totalprice:0,
    totalnum:0
  },
  onShow(){
    const add=wx.getStorageSync('address');
    let cart=wx.getStorageSync('cart')||[]
    // every 数组方法 会遍历并且接受一个回调函数，每个回调函数都返回true的情况那么every返回true
    // 若有一个返回为false 则停止循环
    // 若空数组调用every 返回值也是true
    // const allcheck=car.length?car.every(v=>v.ischeck):false
        // 过滤ischeck为负的物品 
    cart=cart.filter(v=>v.ischeck)
     // 计算数量 价格
     let tp=0
     let tn=0
     cart.forEach(v => {
         tp+=v.num*v.goods_price
         tn+=v.num
     })
     this.setData({
       cart:cart,
       totalprice:tp,
       totalnum:tn,
       address:add
     })
   },
   handleorderpay(){
    //  判断缓存中有无token 无token要跳转到授权页面进行获取token
    const token=wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });
      return;
    }
    else{
      // 有token 
      console.log("存在token")
      // 创建订单
      // 准备头参数 左边为设的参数名，右边是规定的，将规定的设定为token
      const header={Authorization:token}
      // 准备 请求体参数 订单价格为总价格 收货地址为地址
      const order_price=this.data.totalprice
      const consignee_addr=this.data.address.all
      // 定义一个空数组 遍历拿到的cart数组将id num price三个参数加到goods
      let goods=[]
      const cart=this.data.cart
      cart.forEach(v=>goods.push({
        goods_id:v.goods_id,
        goods_number:v.num,
        goods_price:v.goods_price
      }))
      const orderparams={order_price,consignee_addr,goods}
      // 准备发送请求 创建订单 获取订单号
      request({
        url:"/my/orders/create",
        data:orderparams,
        header:header,
        method:"POST"
      })
        .then(res=>{
          order_number=res.data.message.order_number
        })
      // 发起预支付 获得预支付参数
      request({
        url:"/my/orders/req_unifiedorder",
        data:{order_number},
        header:header,
        method:"POST"
      })
        .then(res=>{
          console.log(res.data.message.pay)
          let payparams=res.data.message.pay
          // 发起微信支付
          wx.requestPayment({
            timeStamp: 'payparams.timeStamp',
            nonceStr: 'payparams.nonceStr',
            package: 'payparams.package',
            signType: 'payparams.signType',
            paySign: 'payparams.paySign',
            success: (result)=>{
              console.log("获取成功",result)
              // 查询后台订单状态
              request({
                url:"/my/orders/chkOrder",
                data:{order_number},
                header:header,
                method:"POST"
              })
              .then(res=>{
                console.log("支付成功")
              })
              .catch(res=>{
                console.log("支付失败",res)
              })
            },
            fail:(result)=>{
              console.log(result)
            }
          });
        })
    }
    // 支付完成后删除支付了的商品
    let newcart=wx.getStorageSync("cart");
    newcart=newcart.filter(v=>!v.ischeck);
    wx.setStorageSync("cart", newcart);
    wx.navigateTo({
      url:"/pages/order/order"
    })
   }, 

  onLoad: function (options) {

  },
   
  
})