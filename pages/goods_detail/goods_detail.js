var app = getApp();
//引用用来发送请求的方法
import { request } from "../../request/index.js";
//封装的 getSetting , chooseAddress , openSetting 请求
import { getSetting , chooseAddress , openSetting , showModal , showToast} from "../../utils/asyncWx.js";

import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj:{},
    isCollect:false,//商品是否被收藏
  },
  // 商品对象
  GoodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    // 判断是否是IphoneX 
    let modelmes = wx.getStorageSync('modelmes');
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    // 判断是否是IphoneX 

    // 1.获取当前的小程序的页面栈-数组，长度最大是10页面
    let pages =  getCurrentPages();
    // 2.数组中索引最大的页面就是当前页面
    let currentPage = pages[pages.length-1];
    let options = currentPage.options;
    console.log("拿到的options参数",options);
    const {goods_id} = options;
    //回调商品列表详情接口
    this.getGoodsDetail(goods_id); 
  },

  // 商品列表详情
  async getGoodsDetail(goods_id){
    const res = await request({
      url:"/goods/detail",
      data:{
        goods_id, //参数
      }
    });
    console.log("商品详情页",res.data.message);
    const goodsObj = res.data.message;
    this.GoodsInfo = goodsObj;

    // 收藏
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断当前商品是否收藏
    let isCollect = collect.some(v=>
      v.goods_id === this.GoodsInfo.goods_id
    );
    
    this.setData({
      goodsObj:{
        goods_name:goodsObj.goods_name,
        goods_price:goodsObj.goods_price,
        //iphone部分手机不支持webp图片格式
        //将webp格式改成jpg格式
        // goods_introduce:goodsObj.goods_introduce,
        goods_introduce:goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics:goodsObj.pics
      },
      isCollect
    })
  },

  //预览轮播图大图
  previewImage:function(e){
    var current = e.currentTarget.dataset.src;
    // 构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v=>v.pics_mid)
    console.log(current)
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: urls // 需要预览的图片http链接列表  
    })
  },

  //点击加入购物车
  handleCartAdd:function(e){
    // 1.获取缓存中的购物车数组(第一次获取需要转换成数组格式--> || [] )
    let cart = wx.getStorageSync('cart') || [];
    // 2.判断商品对象是否存在于购物车数组中
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if(index===-1){
      // 3.不存在 第一次添加
      this.GoodsInfo.num = 1; //添加到购物车的次数
      this.GoodsInfo.checked = true; //选中的状态
      cart.push(this.GoodsInfo);
    }else{
      // 4. 已经存在购物车数据 执行num++
      cart[index].num++;
    }
    // 5. 把购物车存到缓存中
    wx.setStorageSync("cart", cart);
    // 6.弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true,
    });   
  },

  //点击收藏图标
  async handleCollect(){
    let isCollect = false;
    // 1.获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2.判断当前商品是否收藏
    let index = collect.findIndex(v=>
      v.goods_id === this.GoodsInfo.goods_id
    );
    console.log(index)
    // 3.当index!=-1表示已经收藏过
    if(index!==-1){
      //能找到，已经收藏过了，在数组中删除该商品
      collect.splice(index,1);
      isCollect = false;
      await showToast({
        //传到封装的方法里面
        title:'取消收藏~',
        icon:'success',
      });
    }else{
      //没有收藏过
      collect.push(this.GoodsInfo);
      isCollect = true;
      await showToast({
        //传到封装的方法里面
        title:'收藏成功~',
        icon:'success',
      });
    }
    // 4.把数组存到缓存中
    wx.setStorageSync("collect", collect);
    // 5.修改isCollect属性
    this.setData({
      isCollect
    })
  }
})