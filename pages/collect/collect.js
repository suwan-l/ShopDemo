//引用用来发送请求的方法
import { request } from "../../request/index.js";
//es7语法包
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:'商品收藏',
        isActive:true,
      },
      {
        id:1,
        name:'品牌收藏',
        isActive:false,
      },
      {
        id:2,
        name:'店铺收藏',
        isActive:false,
      },
      {
        id:3,
        name:'浏览足迹',
        isActive:false,
      }
    ],
    collect:[],//收藏的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const collect = wx.getStorageSync("collect") || [];
    this.setData({
      collect
    })
  },
  //根据标题索引来激活选中标题数组
  changeTitleByIndex(idx){
    //获取数据
    const tabs = this.data.tabs
    // console.log(tabs)
    tabs.forEach((value,index) => {
      index===idx ?value.isActive=true:value.isActive= false
    });
    this.setData({
      tabs:tabs
    })
  },
  // 标题点击事件 从子组件传递过来
  hanldeItemChange:function(e){
    const idx = e.detail.idx
    //调用选中
    this.changeTitleByIndex(idx);
  }
})