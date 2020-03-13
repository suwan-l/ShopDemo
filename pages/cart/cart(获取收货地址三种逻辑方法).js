//引用用来发送请求的方法
import { request } from "../../request/index.js";
//封装的 getSetting , chooseAddress , openSetting 请求
import { getSetting , chooseAddress , openSetting} from "../../utils/asyncWx.js";
//es7语法包
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    data: {
        
    },
    //options(Object)
    onLoad: function(options){
        
    },
    // 1. ES7语法（一般逻辑）
    // async handleChooseAddress(){
    //     // 1.获取权限状态
    //     const res1 = await getSetting();
    //     // 获取权限状态，属性名怪异的时候，都要使用[]形式来获取属性值
    //     const scopeAddress = res1.authSetting['scope.address']
    //     console.log("获取通讯地址状态",scopeAddress)
    //     // 2.判断权限状态
    //     if (scopeAddress === true || scopeAddress === undefined) {
    //         // 3. 调用获取收货地址api
    //         const res2 = await chooseAddress();
    //         console.log("获取用户通讯地址",res2)
    //     }else{
    //         // 4. 诱导用户打开授权设置
    //         await openSetting();
    //         // console.log("打开设置中的允许获取通讯地址", await openSetting())
    //         // 打开授权后再调用获取收货地址api
    //         const res2 = await chooseAddress();
    //         console.log("获取用户通讯地址",res2)   
    //     }
    // }

    // 2. ES7语法（简化逻辑和处理错误信息方法）
    // async handleChooseAddress(){  
    //     try {
    //         const res1 = await getSetting();
    //         const scopeAddress = res1.authSetting['scope.address']
    //         // 如果获取地理位置false,去诱导打开设置
    //         if (scopeAddress === false) {
    //             await openSetting();
    //         }
    //         // 其他情况则打开授权后再调用获取收货地址api
    //         const address = await chooseAddress();
    //         console.log("获取用户通讯地址",address)  
    //         // 存储到缓存中
    //         wx.setStorageSync("address", address);
    //     } 
    //     catch (error) {
    //        console.log(error);
    //     }   
          
    // }

    // 3：一般语法方法
    //点击收货按钮事件
    // handleChooseAddress:function(){
    //     //1. 获取收货地址
    //     wx.getSetting({
    //         success: (result) => {
    //             // 2.获取权限状态，属性名怪异的时候，都要使用[]形式来获取属性值
    //             const scopeAddress = result.authSetting['scope.address']
    //             console.log("获取通讯地址状态",scopeAddress)
    //             // 用户从来没有调用过获取通讯地址，或者点击了确定获取
    //             if (scopeAddress === true || scopeAddress === undefined) {
    //                 console.log("获取用户通讯地址")
    //                 wx.chooseAddress({
    //                     success:(res1) => {
    //                         console.log(res1)
    //                         // 存储到缓存中
    //                         wx.setStorageSync("address", res1);
    //                     }
    //                 })         
    //             }else {
    //                 // 用户点击了取消获取地理位置
    //                 console.log("打开设置中的允许获取通讯地址")
    //                 wx.openSetting({
    //                     success:(res2) => {
    //                         wx.chooseAddress({
    //                             success:(res3) =>{
    //                                 console.log(res3)
    //                                 // 存储到缓存中
    //                                 wx.setStorageSync("address", res3);
    //                             }
    //                         }) 
    //                         console.log(res2.authSetting)
    //                     }
    //                 })
    //             }
                
    //         },
    //         fail: () => {},
    //         complete: () => {}
    //     });
    // }
});