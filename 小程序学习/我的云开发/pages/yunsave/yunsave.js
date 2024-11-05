Page({
  data: {
  yes_image:false,
  yes_video:false
  },
  chooseimg() {
    wx.chooseImage({ //上传图片第一步，选择需要上传的图片
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.uploadfile(res.tempFilePaths[0],"林俊杰.jpg",1)
      },
    })
  },
  choosevideo(){
    wx.chooseVideo({
      sourceType: ['album','camera'],
      maxDuration: 60,
      camera: 'back',
      success:res=> {
        this.uploadfile(res.tempFilePath,"林俊杰出道18周年.mp4",2)
      }
    })
  },
  uploadfile(tempfile,filename,type){//上传图片的第二步，上传图片至云存储
    console.log("要上传的临时路径",tempfile)
    wx.cloud.uploadFile({
      cloudPath:filename,
      filePath:tempfile,
      success:res=>{
        console.log("上传成功",res)
        if(type==1){
        this.setData({
          imgurl:res.fileID,
          yes_image:true,
          yes_video:false
        })
      }
      else if(type==2){
        this.setData({
          videourl:res.fileID,
          yes_image:false,
          yes_video:true
        })
      }},
      fail:err=>{
        console.log("上传失败",err)
      }
})
  }
})