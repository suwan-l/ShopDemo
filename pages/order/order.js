//引用用来发送请求的方法
import { request } from "../../request/index.js";
//封装的 getSetting , chooseAddress , openSetting 请求
// import { getSetting , chooseAddress , openSetting , showModal , showToast} from "../../utils/asyncWx.js";
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
        name:'全部',
        isActive:true,
      },
      {
        id:1,
        name:'待付款',
        isActive:false,
      },
      {
        id:2,
        name:'待发货',
        isActive:false,
      },
      {
        id:3,
        name:'退款/退货',
        isActive:false,
      }
    ],
    orders:[],//接口获取到的数据
  },

  onShow: function (options) {
    // 0.判断缓存中时候有token值
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/auth',
      });   
      return;
    }
    // 1.获取当前的小程序的页面栈-数组，长度最大是10页面
    let pages =  getCurrentPages();
    console.log(pages)
    // 2.数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1]
    console.log("拿到的options参数",currentPage.options)
    // 3.获取url上的type参数
    const {type} = currentPage.options
    // 4.激活选中页面标题
    this.changeTitleByIndex(type-1)

    // 4. 回调订单列表方法
    this.getOrders(type);
      
  },

  //获取订单列表的方法
  async getOrders(type){
    const res = await request({
      url:"/my/orders/all",
      data:{
        type
      }
    });
    this.setData({
      orders:res.orders,
      //对时间戳处理 --> 前台取数据用create_time_cn
      // orders:res.orders.map(v =>({
      //   ...v,create_time_cn:(
      //     new Date(v.create_time).toLocaleString()
      //   )
      // }))
    })
    console.log(res)
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
    //重新发送请求 type =1 ，index =0
    this.getOrders(idx+1);
    // console.log(idx)
    // //获取数据
    // const tabs = this.data.tabs
    // // console.log(tabs)
    // tabs.forEach((value,index) => {
    //   index===idx ?value.isActive=true:value.isActive= false
    // });
    // this.setData({
    //   tabs:tabs
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
})