// 同时发送异部代码的次数 若出现同时调用的情况等都数据返回再结束loading
let ajaxtimes=0;
export const request=(params)=>{
    ajaxtimes++;
    // 显示加载中效果
    wx.showLoading({
        title: "加载中",
        mask:true
    });
    // 定义公共的url
    const baseurl="https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject)=>{
        wx.request({
           ...params,
           url:baseurl+params.url,
           success:(result)=>{
               resolve(result);
           },
           fail:(err)=>{
               reject(err);
           },
           complete:()=>{
               ajaxtimes--;
               if(ajaxtimes===0)
               wx.hideLoading();
           }
           
        });
    })
}
// promise学习