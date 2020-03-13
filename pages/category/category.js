//引用用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  Cates:[],// 接口返回数据
  data: {
    leftMenuList:[],//左侧菜单
    rightContent:[],// 右侧内容
    currentIndex:0,//左侧选中
    scrollTop:0,//右侧内容距离顶部高度
  },
  onLoad: function (options) {
    //缓存技术
    // 1.判断一下本地存储中有没有旧的数据
    const Cates = wx.getStorageSync('cates');
    console.log("拿本地存储数据",Cates)
    // 2.没有旧数据，直接发送新请求
    if(!Cates){
      // 不存在，发送请求获取数据
      this.getCatesList();
    }
    // 3.有旧数据同时旧数据也没有过期，就使用本地存储中的旧数据
    else{
      // 有旧的数据，定义过期时间
      if(Date.now()-Cates.time >1000*10){
        // 重新请求数据
        this.getCatesList();
      }
      else{
        // 可以使用旧数据
        console.log("可以使用本地存储数据")
        //把本地存储的数据放到定义的返回数据中
        this.Cates = Cates.data;
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v=>v.cat_name);
        // 构造右侧内容
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent,
        })
      }
    }
    
  },
  // 1.使用ES7语法
  // async getCatesList(){
  //   // 使用es7的async
  // },


  // 2.普通ES6语法
  // 商品分类
  getCatesList(){
    request({url:'/categories'})
    .then(res=>{
      console.log("商品分类",res)
      //把接口中的数据存到cates中
      this.Cates=res.data.message

      // 把本地数据存在本地存储中
      wx.setStorageSync("cates",{time:Date.now(),data:this.Cates});
        
      // 构造左侧大菜单数据
      let leftMenuList = this.Cates.map(v=>v.cat_name);
      // 构造右侧内容
      let rightContent = this.Cates[0].children;
      this.setData({
        leftMenuList,
        rightContent,
      })
    })
  },

  //左侧点击事件
  handleItemTap:function(e){
    console.log("左侧标题索引",e.currentTarget.dataset.index)
    // 获取被点击的标题索引，并赋值给currentIndex 
    let index = e.currentTarget.dataset.index
    //根据不用的索引来渲染右侧的商品内容
    let rightContent = this.Cates[index].children;
    this.setData({
      currentIndex:index,
      rightContent:rightContent,
      scrollTop:0
    })
  }
})