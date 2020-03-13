//引用用来发送请求的方法
import { request } from "../../request/index.js";
Page({
  data: {
    swiperList:[],  //轮播图数组
    cateList:[],    //导航数组
    floorList:[],   //楼层数据
  },
  onLoad: function(options){
    // 回调轮播图
    this.getSwiperList();
    // 回调导航
    this.getCateList();
    // 回调楼层
    this.getFloorList();
  },
  
  // 首页轮播图
  getSwiperList(){
    request({url:'/home/swiperdata'})
    .then(res=>{
      console.log("首页轮播图",res)
      this.setData({
        swiperList:res.data.message
      })
    }) 
  },
  //首页导航
  getCateList(){
    request({url:'/home/catitems'})
    .then(res=>{
      console.log("首页导航",res)
      this.setData({
        cateList:res.data.message
      })
    }) 
  },
  //楼层
  getFloorList(){
    request({url:'/home/floordata'})
    .then(res=>{
      console.log("首页楼层",res)
      this.setData({
        floorList:res.data.message
      })
    }) 
  },
});