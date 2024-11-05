var danmu
var video
function getRandomColor() {
  const rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length === 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    danmulist:[{
      text:"有人吗",
      color:getRandomColor(), 
      time:1
    }]

  },
  
getDanmu(d){
  danmu=d.detail.value
  console.log("用户输入的弹幕内容",danmu)
},
sendDanmu(){
  video.sendDanmu({
text:danmu,
color:getRandomColor()
  })
},

  onReady: function () {
 video=wx.createVideoContext('myVideo')
  }

  
})