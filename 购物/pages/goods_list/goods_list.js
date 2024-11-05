//引入 用来发送请求的方法 一定要把路径补全
import{request}from "../../request/index.js";
/*
1 用户上滑页面 滚动条触底 开始加载下一页
2 判断有无下一页数据 首先需要获取总页数 总页数=Math.ceil(总条数 / 页容量)
   然后获取当前页的页码判断是否大于总页数
3 有则加载,没有则弹出提示  加载是需要将当前页码++ 重新发送请求并且对当前数组拼接 
*/
/*
1 触发下拉刷新,首先在页面JSON文件中开启一个配置项
2 重置数据
3 重置页码 设置为1
4 重新发送请求
5 数据请求回来关闭下拉刷新窗口
*/
Page({

  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      }, 
      {
        id:2,
        value:"价格",
        isActive:false
      },
    ],
    goods_list:[]
  },
   // 接口要的参数
   Queryparams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },
  totalpages:1,


  onLoad: function (options) {
    // 不同方式跳转过来拿不同关键字 首页拿query 导航页面拿cid 存在的话用它不存在用空字符串
    this.Queryparams.query=options.query||"";
    this.Queryparams.cid=options.cid||"";
    this.getgoodlist()

  },
  getgoodlist(){
    request({
      url:"/goods/search"
    })
      .then(res=>{
        console.log("获取商品列表数据成功",res)
        // 获取总条数
        const total=res.data.message.goods.length
        // 计算总页数
        this.totalpages=Math.ceil(total / this.Queryparams.pagesize)
        this.setData({
          // 将旧的数组解构出来并将新的拼接上去
          goods_list:[...this.data.goods_list,...res.data.message.goods]
        })
        wx.stopPullDownRefresh()
        
      })
      .catch(res=>{
        console.log("获取商品列表数据失败",res)

      })
  },
  //标题点击事件,从子组件传递来
  handletabsitemchange(e){
    const{index}=e.detail;
    // 修改数组
    let t=this.data.tabs;
    t.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs:t
    })
  },
  // 页面上滑 滚动条触底
  onReachBottom(){
    if(this.Queryparams.pagenum>=this.totalpages){
      wx.showToast({
        title: '没有数据了',
        icon: 'none',
      });
      
    }
    else{
      this.Queryparams.pagenum++;
      this.getgoodlist()

    }
    
  },
  onPullDownRefresh(){
    this.Queryparams.pagenum=1
    this.setData({
      goods_list:[]
    })
    this.getgoodlist()
  }

})