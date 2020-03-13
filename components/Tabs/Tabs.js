// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{
      type:Array, //类型
      value:[],   //初始化
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
    // 点击tab切换
    handleItem:function(e){
      let idx = e.currentTarget.dataset.id
      // 触发父组件中的自定义组件，同时传递数据给父组件
      this.triggerEvent("ItemChange",{
        idx:idx
      })
    },
  }
})
