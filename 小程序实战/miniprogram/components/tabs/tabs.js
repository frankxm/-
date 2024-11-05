// components/tabs/tabs.js
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
    // 获取点击的索引并且触发父组件中的事件
    handleitemtap(e){
      const{index}=e.currentTarget.dataset;
      this.triggerEvent("tabsitemchange",{index})
    }

  }
})
