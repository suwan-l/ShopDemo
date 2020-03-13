//引用用来发送请求的方法
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import {login} from "../../utils/asyncWx.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取用户信息
  async handleGetUserInfo(e){
    try {
      console.log(e)
      // 1.获取用户信息
      const {encryptedData,rawData,iv,signature} = e.detail
      // 2.获取小程序登录成功后的code(使用封装的方法)
      const {code} = await login();   
      //封装请求参数
      const loginParams={
        code,
        encryptedData,
        rawData,
        iv,
        signature,
      };
      // 3.发送请求获取token值
      const res = await request({
        url:"/users/wxlogin",
        data:loginParams,
        method:'POST'
      });
      // 这里我们是拿不到token值
      console.log("SS",res)
      // 4.把token存入缓存中，同时跳回上一个页面
      wx.setStorageSync("token", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo");
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {   
      console.log(error)
    }
  }
})