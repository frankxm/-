//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
/*
轮播图放大预览：
1 绑定点击事件
2 调用小程序的api previewImage
*/
/*
点击加入购物车 
1 先绑定点击事件
2 获取缓存中的购物车数据 为数组格式
3 先判断 当前的商品是否已经存在于购物车
若存在则修改商品
数量，执行购物车数量++并重新把购物车数组填充回缓存
若不存在则给购物车数组添加一个新元素同时带上购买数量 
4 弹出提示
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods_obj:{},
    iscollect:false
  },
  goods_id:0,
  goods_info:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    //通过页面栈来获取options
    let pages= getCurrentPages();
    let currentpage=pages[pages.length-1]
    let options=currentpage.options
    this.goods_id=options.goods_id,
    this.getdetail(this.goods_id)

  },
  getdetail(goods_id){
    request({
      url:"/goods/detail",
      data: {goods_id}
    })
      .then(res=>{
        console.log("获取商品详情数据成功",res.data.message)
        let obj=res.data.message
        this.goods_info=obj
        // 确保拿到渲染对象的值后再判断收藏
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collection")||[];
    // 判断当前商品是否被收藏 通过回调函数返回true false
    let iscollect=collect.some(v=>v.goods_id===this.goods_info.goods_id)
        this.setData({
          goods_obj:{
          // appdata里面只存有用的数据
          goods_name:obj.goods_name,
          goods_price:obj.goods_price,
          /*iphone 部分手机 不识别 webp图片格式
            企业中需要找到后台让其修改格式
            也可前端自己改，但是得确保后台存在 1.webp=>1.jpg
          */
          goods_introduce:obj.goods_introduce,
          // goods_introduce:obj.goods_introduce.replace(/\.webp/g,'.jpg')
          pics:obj.pics
          },
          iscollect:iscollect
        })
      
      })
      .catch(res=>{
        console.log("获取商品详情数据失败",res)

      })
  },
  handleimage(e){
    // 构造需要预览的图片数组
    const urls=this.goods_info.pics.map(v=>v.pics_mid);
    // 接受传递过来的图片url
    const current=e.currentTarget.dataset.url;
    wx.previewImage({
      current: current,
      urls: urls,
      
    });
  },
  handlecart(){
    // 获取缓存中的购物车 数组 第一次获取时cart是空字符串格式
    // 那么||[]就将其转化为空数组
    let cart=wx.getStorageSync("cart")||[];
    // 判断 商品对象是否存在于购物车数组中 这里用goods_info因为里面有goods_id 但是goods_obj里面没有
    // 若存在对应的id则返回当前对象对应的索引
    let index=cart.findIndex(v=>v.goods_id===this.goods_info.goods_id)
      if(index==-1){
        // 添加num并且放回从缓存中取出的cart数组中
        this.goods_info.num=1
        // 添加复选框的是否选中状态
        this.goods_info.ischeck=true
        cart.push(this.goods_info)
      }
      else{
        // 若存在，直接对相应的id的num++
        cart[index].num++
      }
      wx.setStorageSync("cart", cart);
     wx.showToast({
        title: '添加成功',
        icon: 'success',
        // 预防用户手抖 疯狂点击
        mask: true,
   
      });
  },
  handlecollect(){
    let iscollect=false
    // 获取缓存中的商品收藏数组
    let collect=wx.getStorageSync("collection")||[];
    // 判断该商品是否被收藏过 从缓存中取出的数组进行遍历看是否等于data中的id
    let index=collect.findIndex(v=>v.goods_id===this.goods_info.goods_id)
    if(index!=-1){
      // 如果找到索引说明有收藏，进行删除
      collect.splice(index,1)
      iscollect=false
      wx.showToast({
        title:"取消成功",
        icon:"success",
        mask:true
      })
    }
    else{
      // 如果找不到索引说明没有收藏，进行添加当前data里的goods_info
      collect.push(this.goods_info)
      iscollect=true
      wx.showToast({
        title:"收藏成功",
        icon:"success",
        mask:true
      })
    }
    // 放回缓存
    wx.setStorageSync("collection", collect);
    // 修改data中的iscollect
    this.setData({
      iscollect:iscollect
    })
    
  }

})