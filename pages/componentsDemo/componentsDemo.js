// pages/componentsDemo/componentsDemo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:'首页',
        isActive:true
      },
      {
        id:1,
        name:'原创',
        isActive:false
      },
      {
        id:2,
        name:'分类',
        isActive:false
      },
      {
        id:3,
        name:'关于',
        isActive:false
      }
    ]
  },

  //自定义事件，用来接收子组件传递的数据
  hanldeItemChange:function(e){
    // 接收传递过来的参数
    const idx = e.detail.idx
    console.log(idx)
    // 获取数据
    const tabs = this.data.tabs
    console.log(tabs)
    // 遍历数据，修改isActive值
    tabs.forEach((v,i)=>{
      i===idx?v.isActive=true:v.isActive=false
    })
    // 重新赋值
    this.setData({
      tabs
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})