
Page({
  data: {
    nbFrontColor: '#000000',
    nbBackgroundColor: '#ffffff',
  },
  onLoad() {
    this.setData({
      nbTitle: '新标题',
      nbLoading: true,
      nbFrontColor: '#ffffff',
      nbBackgroundColor: '#000000',
    })
  }
})