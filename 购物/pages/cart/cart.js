/*
 1 onload onshow
 2 获取本地存储中的地址数据‘
 3 把数据设置为data 中的变量并且渲染出来
*/
/*
全选的实现 在onShow 中根据商品数据的情况，若全选中，则 全选
*/
/*
总价格和总数量实现
首先获取购物车数组，遍历判断是否选中
总价格+=商品的单价*数量
总数量+=商品数量
*/
/*
商品的选中，需要复选框绑定点击事件，同时改变状态，并重新计算价格数量
*/
/*
全选和反选 绑定change事件 获取全选变量 取反 遍历购物车数组让里面状态改变
重新将新的购物车给data和缓存
*/
/*
"+""-"按钮绑定同一个事件 区分的关键为自定义属性
传递被点击物品的id 同时获取data中的cart数据修改num 
最后进入setcart计算
*/
// alt光标多选
Page({

  data: {
    address:{},
    cart:[],
    allchecked:false,
    totalprice:0,
    totalnum:0
  },
  onShow(){
    const add=wx.getStorageSync('address');
    const car=wx.getStorageSync('cart')||[]
    // every 数组方法 会遍历并且接受一个回调函数，每个回调函数都返回true的情况那么every返回true
    // 若有一个返回为false 则停止循环
    // 若空数组调用every 返回值也是true
    // const allcheck=car.length?car.every(v=>v.ischeck):false
    this.setData({
      address:add
    })
    this.setcart(car)
    
  },

  onLoad: function (options) {

  },
  // 获取用户收货地址，调用小程序内置的api ChooseAddress
  // 需要获取用户对小程序所授予的获取地址权限的状态scope
  // 如果用户点击获取地址提示框确定，则authSetting scope.address scope 值为true 反之为false
  handleaddress(){
    // 获取权限状态
    wx.getSetting({
      success: (result)=>{
        // 获取权限状态，看scope.address 是true 还是false 出现类似于scope.address怪异的属性名时候 需要用[]来获取其属性值
        const scopeaddress=result.authSetting["scope.address"]
        if(scopeaddress===true||scopeaddress===undefined){
          wx.chooseAddress({
            success: (result2)=>{
              console.log("获取地址信息",result2)
              result2.all= result2.provinceName+result2.cityName+result2.countyName+result2.detailInfo
              wx.setStorageSync("address", result2);
            },
          });
        }
        else{
          // 拒绝过权限 诱导用户打开授权页面
          wx.openSetting({
            success: (result3)=>{
              // 在授权页面允许后就可以调用收货地址
              wx.chooseAddress({
                success: (result4)=>{
                  console.log("获取地址信息",result4)
                 result4.all= result4.provinceName+result4.cityName+result4.countyName+result4.detailInfo
                  wx.setStorageSync("address", result4);
                },
              });
            },
          });
        }
      },
    
    });
  },
  handlechange(e){
    // 获取被修改商品的id
    const goods_id=e.currentTarget.dataset.id
    // 获取购物车数组
    let {cart}=this.data
    // 找到被修改商品的索引
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    // 找到的话选中状态取反
    cart[index].ischeck=!cart[index].ischeck
    this.setcart(cart)
  },
  setcart(cart){
    // 计算数量 价格
    let tp=0
    let tn=0
    let allcheck=true
    cart.forEach(v => {
      if(v.ischeck){
        tp+=v.num*v.goods_price
        tn+=v.num
      }
      else{
        allcheck=false
      }
    })
    allcheck=cart.length!=0?allcheck:false
    this.setData({
      cart:cart,
      totalprice:tp,
      totalnum:tn,
      allchecked:allcheck
    })
    // 购物车数据存储在缓存中
    wx.setStorageSync("cart", cart);
  },
  handlecancel(){
    let {cart,allchecked}=this.data
    allchecked=!allchecked
    cart.forEach(v=>v.ischeck=allchecked)
    this.setcart(cart)
  },
  plusminus(e){
    // 获取传递过来的参数
    const{operation,id}=e.currentTarget.dataset
    // 从data获取购物车数组
    let {cart}=this.data
    // 找到需要修改商品的索引
    const index=cart.findIndex(v=>v.goods_id===id)
    // 进行修改
    if(cart[index].num===1&&operation===-1){
      wx.showModal({
        title: '提示',
        content: '您是否要删除',
        success: (result) => {
          if(result.confirm){
            cart.splice(index,1)
            this.setcart(cart)
          }
          else if(result.cancel){
            console.log("用户点击了取消")
          }
        },
      });
    }
    else{
      cart[index].num+=operation
    }
    // 计算并赋data给缓存
    this.setcart(cart)
  },
  handlebuy(){
    const{address,totalnum}=this.data
    if(!address.userName){
     wx.showToast({
       title: '您还没有选择收货地址',
       icon: 'none',
     });
    }
    else if(totalnum===0){
      wx.showToast({
        title:"您还没有选购商品",
        icon:"none"
      })
    }
    else{
      wx.navigateTo({
        url:'/pages/pay/pay'
      });
    }
  }

  
})