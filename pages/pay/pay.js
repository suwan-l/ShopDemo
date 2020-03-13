var app = getApp();
//引用用来发送请求的方法
import { request } from "../../request/index.js";
// //封装的 getSetting , chooseAddress , openSetting 请求
import {requestPayment , showToast} from "../../utils/asyncWx.js";
//es7语法包
import regeneratorRuntime from '../../lib/runtime/runtime';

/**
微信支付
    1.哪些人,哪些账号可以实现微信支付
        1.企业账号
        2.企业账号的
 */


Page({
    data: {
        address:{},//收货地址
        cart:[],//添加到购物车的商品
        totalPrice:0,//总价格
        totalNum:0,//总数量
    },
    //options(Object)
    onLoad: function(options){
        // 判断是否是IphoneX 
        let modelmes = wx.getStorageSync('modelmes');
        let isIphoneX = app.globalData.isIphoneX;
        this.setData({
        isIphoneX: isIphoneX
        })
        // 判断是否是IphoneX 
    },
    onShow(){
        //获取缓存中的收货地址
        const address = wx.getStorageSync("address");
        //获取缓存中的商品
        let cart = wx.getStorageSync("cart") || [];
        // 过滤后的购物车代码
        cart = cart.filter(v=>
            v.checked
        ); 
        // 8.总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;
        // 9.循环购物车数组
        cart.forEach(v => {
            totalPrice += v.num * v.goods_price; //总价格+=数量*商品单价
            totalNum += v.num;//总数量+=商品数量
        });
        // 5.把购物车数据重新设置回data中
        this.setData({
            cart,
            totalPrice,
            totalNum,
            address,
        });
    },
    //点击支付功能
    async handlePrderPay(){
        // 处理支付正常的流程
        try {
            // 1. 先判断缓存中有没有token 
            const token = wx.getStorageSync("token")
            // 2. 没有跳转到授权页面，获取token 
            if(!token){
                wx.navigateTo({
                    url: '/pages/auth/auth',
                });
                return;
            }
            // 3. 创建订单
            // 3.1 准备请求头参数
            // const header = {Authorization:token}
            // 3.2 准备请求体参数
            const order_price =this.data.order_price;
            const consignee_addr = this.data.address_all;
            // 先拿到cart数据
            const cart = this.data.cart;
            // 定一个空数组
            let goods=[];
            //在遍历拿到商品信息
            cart.forEach(v=>
                goods.push({
                    goods_id:v.goods_id,
                    goods_price:v.goods_price,
                    goods_num:v.num,
                })
            );
            // 封装请求参数
            const orderParams={
                order_price,
                consignee_addr,
                goods
            };
            // ！！！！！！ 4. 发送请求 创建订单 获取订单编号
            const {order_number} = await request({
                url:"/my/orders/create",
                method:"POST",
                data:orderParams,
                // header,
            });
            // ！！！！有真实的token值，这里就可以获取到订单编号 order_number
            console.log(order_number)
            
            // 拿到订单编号，就继续下一步，发起预支付接口
            // 5.发起预支付接口（解构出pay属性，拿到支付接口需要传的参数）
            const {pay} = await request({
                url:"/my/orders/req_unifiedorder",
                method:"POST",
                data:{
                    order_number:order_number,
                }, 
                // header,
            });
            console.log("预支付接口中的pay属性",pay)

            // 6.直接发起微信支付
            try {
                const res = await requestPayment(pay);
                console.log("微信支付",res)
            } catch (error) {
                console.log(error)
            }
            

            // 7.支付成功后，查询后台订单状态
            const res1 = await request({
                url:"/my/orders/chkOrder",
                method:"POST",
                // header,
                data:{
                    order_number:order_number,
                }, 
            });
            console.log("查看订单状态",res1)

            // 支付成功提示
            await showToast({
                title:"支付成功"
            });

            // 8.手动删除缓存中 已经支付了的商品
            let newCart = wx.getStorageSync("cart");
            //过滤出未被选中的
            newCart = newCart.filter(v=>!v.checked);
            //重新存到缓存中
            wx.setStorageSync('cart',newCart);
            // 8.支付成功了跳转到订单页面        
            wx.navigateTo({
                url: '/pages/order/order',  
            });
        } 
        // 捕获异常状态
        catch (error) {
            // 支付失败提示
            await showToast({
                title:"支付失败"
            })
            console.log(error);
        }     
    }
});

  