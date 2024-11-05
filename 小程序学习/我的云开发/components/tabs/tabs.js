// components/tabs/tabs.js
let index=0
let list=[]
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
    type:Array,
    value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    click(e){
    index=e.currentTarget.dataset.index
    // 触发父组件中的自定义事件，同时传递index
    this.triggerEvent("itemChange",{index})
    // list=this.data.tabs
    // list.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false)
    // // 遍历数组找到符合index的值并且修改原数组
    // this.setData({
    //   tabs:list
    // })
    }
  }
})
