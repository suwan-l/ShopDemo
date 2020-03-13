//引用用来发送请求的方法
import { request } from "../../request/index.js";
//封装的 getSetting , chooseAddress , openSetting 请求
import { getSetting , chooseAddress , openSetting} from "../../utils/asyncWx.js";
//es7语法包
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
    data: {
        address:{},//收货地址
        cart:[],//添加到购物车的商品
        allChecked:false,//全选按钮
        totalPrice:0,//总价格
        totalNum:0,//总数量
    },
    //options(Object)
    onLoad: function(options){
        
    },
    onShow(){
        //获取缓存中的收货地址
        const address = wx.getStorageSync("address");
        //获取缓存中的商品
        const cart = wx.getStorageSync("cart") || [];
        // 1.计算全选 （重复循环，性能差）
        // every数组方法，会遍历，会接收一个回调函数，每一个回调函数都返回true，every方法的返回值就是true，有一个是false，代码就不在循环执行，返回false
        //空数组调用every，返回值就是true(三元运算 如果是空数组，就返回flase)
        // const allChecked = cart.length?cart.every(v=>v.checked):false;

        //调用封装方法
        this.setCart(cart);
        this.setData({
            address,
        }) 
        // // 2.优化全选性能   
        // let allChecked = true
        // // 1.总价格 总数量
        // let totalPrice = 0;
        // let totalNum = 0;

        // //循环购物车数组
        // cart.forEach(v => {
        //     if(v.checked){
        //         totalPrice += v.num * v.goods_price; //总价格+=数量*商品单价
        //         totalNum += v.num;//总数量+=商品数量
        //     }else{
        //         allChecked=false;
        //     }
        // })
        // //判断数组是否为空(判断不为0是，则是他本身的值，否则是false)
        // allChecked=cart.length!=0?allChecked:false;
        // // 2.给data赋值
        // this.setData({
        //     address,
        //     cart,
        //     allChecked,
        //     totalPrice,
        //     totalNum
        // })  
    },
    // 2. ES7语法（简化逻辑和处理错误信息方法）
    async handleChooseAddress(){  
        try {
            const res1 = await getSetting();
            const scopeAddress = res1.authSetting['scope.address']
            // 如果获取地理位置false,去诱导打开设置
            if (scopeAddress === false) {
                await openSetting();
            }
            // 其他情况则打开授权后再调用获取收货地址api
            let address = await chooseAddress();
                //省市区详情地址
                address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
            console.log("获取用户通讯地址",address)  
            // 存储到缓存中
            wx.setStorageSync("address", address);
        } 
        catch (error) {
           console.log(error);
        }      
    },
    //商品的选中
    handleItemChange:function(e){
        // 1.获取被修改的商品id
        const goods_id = e.currentTarget.dataset.id
        // 2.获取购物车数组
        let cart = this.data.cart;
        // 3.找到被修改的商品对象
        let index = cart.findIndex( v=>
            v.goods_id === goods_id
        );
        console.log(index)
        // 4.选中状态取反
        cart[index].checked=!cart[index].checked;
        
        //调用封装方法
        this.setCart(cart);

        // // // 5.把购物车数据重新设置回data中
        // // this.setData({
        // //     cart,
        // // })
        // // 6. 重新存储到缓存中
        // wx.setStorageSync("cart", cart);

        // // 7.全选性能   
        // let allChecked = true
        // // 8.总价格 总数量
        // let totalPrice = 0;
        // let totalNum = 0;

        // // 9.循环购物车数组
        // cart.forEach(v => {
        //     if(v.checked){
        //         totalPrice += v.num * v.goods_price; //总价格+=数量*商品单价
        //         totalNum += v.num;//总数量+=商品数量
        //     }else{
        //         allChecked=false;
        //     }
        // })
        // // 10.判断数组是否为空(判断不为0是，则是他本身的值，否则是false)
        // allChecked=cart.length!=0?allChecked:false;
       
        // // 5.把购物车数据重新设置回data中
        // this.setData({
        //     cart,
        //     totalPrice,
        //     totalNum,
        //     allChecked
        // })
    },
    
    // 封装 --> 设置购物车状态同时，重新计算底部工具栏的数据，全选、总价格、购买的数量
    setCart(cart){
        // 7.全选性能   
        let allChecked = true
        // 8.总价格 总数量
        let totalPrice = 0;
        let totalNum = 0;

        // 9.循环购物车数组
        cart.forEach(v => {
            if(v.checked){
                totalPrice += v.num * v.goods_price; //总价格+=数量*商品单价
                totalNum += v.num;//总数量+=商品数量
            }else{
                allChecked=false;
            }
        })
        // 10.判断数组是否为空(判断不为0是，则是他本身的值，否则是false)
        allChecked=cart.length!=0?allChecked:false;
       
        // 5.把购物车数据重新设置回data中
        this.setData({
            cart,
            totalPrice,
            totalNum,
            allChecked
        })
        // 6. 重新存储到缓存中
        wx.setStorageSync("cart", cart);
    },
    //全选的选中
    handleAllChange:function(){

    }

});