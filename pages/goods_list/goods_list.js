//引用用来发送请求的方法
import { request } from "../../request/index.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        name:'总和',
        isActive:true,
      },
      {
        id:1,
        name:'销量',
        isActive:false,
      },
      {
        id:2,
        name:'价格',
        isActive:false,
      }
    ],
    GoodsList:[],
  },

  //接收接口参数
  QueryParams:{
    query:'',
    cid:'',
    pagenum:1,
    pagesize:10
  },
  //总页数
  totalPages:1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid
    //回调商品列表搜索接口
    this.getGoodsList()
  },
  // 标题点击事件 从子组件传递过来
  hanldeItemChange:function(e){
    const idx = e.detail.idx
    console.log(idx)
    //获取数据
    const tabs = this.data.tabs
    console.log(tabs)
    tabs.forEach((value,index) => {
      index===idx ?value.isActive=true:value.isActive= false
    });
    this.setData({
      tabs:tabs
    })
  },
  // 商品列表搜索
  getGoodsList(){
    request({
      url:'/goods/search',
      data:this.QueryParams //参数
    })
    .then(res=>{
      console.log("商品列表搜索",res.data.message)
      //数据总条数
      const total = res.data.message.total
      //计算总页数
      this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
      this.setData({
        //拼接了数组
        // this.data.GoodsList 原数据
        // res.data.message.goods 加载后新数据
        GoodsList:[...this.data.GoodsList,...res.data.message.goods]
      });

      //关闭下拉刷新动作
      wx.stopPullDownRefresh();
    }) 
  },

  /*
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 重置数组
    this.setData({
      GoodsList:[]
    }),
    //重置页码
    this.QueryParams.pagenum=1;
    //发送请求
    this.getGoodsList()
  },

  /*
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.QueryParams.pagenum>=this.totalPages){
      console.log("没有数据了")
      wx.showToast({
        title: '没有下一页数据了',
      });
    }
    else{
      this.QueryParams.pagenum++;
      this.getGoodsList()
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})