/*
1 点击+触发添加图片事件
2 获取到图片的路径 以数组形式存储
3 把图片路径存到data
4 页面就可以根据图片数组进行循环显示 利用自定义组件
*/
/*
点击自定义组件删除
1 获取被点击的元素的索引
2 获取data中的图片数组
3 根据索引删除图片数组
4 重新设回
*/
/*
提交按钮
1 获取文本域的内容
2 对这些内容进行合法性验证
3 验证通过 将用户选择的图片上传到专门的图片的服务器 返回图片的外网链接
4 文本域和外网的图片的路径一起提交到服务器 小程序中做前端的模拟不会发送请求到后台
5 清空当前页面
6 返回上一页
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      },
    ],
    chooseImage: [],
    textvalue: ""
  },
  uploadimg: [],
  onLoad() {

  },
  handletabsitemchange(e) {
    const { index } = e.detail;
    // 修改数组
    let t = this.data.tabs;
    t.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs: t
    })
  },
  handlechooseimg() {
    wx.chooseImage({
      // 最大图片数量
      count: 9,
      // 图片的格式 原图 压缩
      sizeType: ['original', 'compressed'],
      // 图片的来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          // 图片数组进行拼接 用的是图片路径
          chooseImage: [...this.data.chooseImage, ...result.tempFilePaths]
        })
      },
    });
  },
  handleremove(e) {
    const { index } = e.currentTarget.dataset
    let { chooseImage } = this.data
    chooseImage.splice(index, 1)
    this.setData({
      chooseImage: chooseImage
    })
  },
  handletext(e) {
    this.setData({
      textvalue: e.detail.value
    })
  },
  handlesubmit() {
    const { textvalue, chooseImage } = this.data
    if (!textvalue.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true,
      });
      return;
    }
    // 显示正在等待的图片
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });
    // 判断有无需要上传的图片数组
    if (chooseImage.length != 0) {
      // 上传文件的api不支持多个文件同时上传
      // 需要遍历图片数组挨个上传并自己维护图片数组 存放上传后的外网的链接
      chooseImage.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: 'image',
          formData: {},
          success: (result) => {
            // data是个json字符串所以用json解析拿到url 解析后再来一次
            let url = JSON.parse(result.data).data.url
            //  给数组赋值
            this.uploadimg.push(url)
            console.log("uploadimg数组存放的链接", this.uploadimg)
            // 所有图片都上传完毕触发
            if (i === chooseImage.length - 1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组提交到了后台")
              // 提交成功后重置页面
              this.setData({
                textvalue: "",
                chooseImage: []
              })
              // 返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    }
    else {
      wx.hideLoading();
      console.log("只是提交了文本")
      wx.navigateBack({
        delta: 1
      });
    }
  }
})
