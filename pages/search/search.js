//引用用来发送请求的方法
import { request } from "../../request/index.js";
// //封装的 getSetting , chooseAddress , openSetting 请求
import {requestPayment , showToast} from "../../utils/asyncWx.js";
//es7语法包
import regeneratorRuntime from '../../lib/runtime/runtime';
/**

防抖（防止抖动） 定时器 节流
  0.防抖一般在输入框中，防止重复输入 重复发送请求
  1.节流，一般用页面的下拉和上拉
  2.定义全局的定时器id
 * 
 */
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goods:[], //搜索的内容数组
    isFoucs:false,//取消按钮默认不显示
    inputValue:"",//输入框的value值
  },

  TimeId:-1, //全局定时器


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //输入框的值改变了就会触发的事件
  handleInput(e){
    console.log(e)
    // 1.获取输入框的值
    const {value} = e.detail
    // 2.检测合法性
    if(!value.trim()){
      this.setData({
        inputValue: '',
        goods:[],
        isFoucs:false
      })
      //值不合法
      return;
    }
    this.setData({
      isFoucs:true
    })

    // 3. 准备发送请求获取数据
    // 清除全局定时器
    clearTimeout(this.TimeId); 
    // 开启定时器
    this.TimeId=setTimeout(()=>{
      this.qsearch(value);
    },1000);
  }, 

  //点击取消按钮
  handleCancle(){
    this.setData({
      inputValue:"",
      isFoucs:false,
      goods:[]
    })
  },
  
  //商品搜索
  async qsearch(query){
    try {
      const res = await request({
        url:"/goods/qsearch",
        data:{query}
      });
      this.setData({
        goods:res.data.message
      })
      
    } catch (error) {   
      console.log(error)
    }
  }
})