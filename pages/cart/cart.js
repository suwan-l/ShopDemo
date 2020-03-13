//引用用来发送请求的方法
import { request } from "../../request/index.js";
//封装的 getSetting , chooseAddress , openSetting 请求
import { getSetting , chooseAddress , openSetting , showModal , showToast} from "../../utils/asyncWx.js";
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

        // ！！！！调用setCart封装方法！！！！！
        this.setCart(cart);
        this.setData({
            address,
        }) 
    },
    // 添加地址   ES7语法（简化逻辑和处理错误信息方法）
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
        
        // ！！！！调用setCart封装方法！！！！！
        this.setCart(cart);

    },
    //商品的全选功能
    handleAllChange:function(){
        // 1. 获取data中数据
        let {cart,allChecked} = this.data;
        // 2. 直接取反修改值
        allChecked=!allChecked
        // 3. 循环修改cart数组中的商品 选中状态
        cart.forEach(v=>
            v.checked=allChecked
        );
        // 4. 把修改后的值，填充回data或者缓存中-->调用封装好的方法
        this.setCart(cart);
    },
    //商品数量编辑
    async handleItemNumEdit(e){
        // 1.获取传递过来的参数
        const {operation,id} = e.currentTarget.dataset
        console.log(operation,id)
        // 2.获取购物车数组
        let {cart} = this.data
        // 3.找到需要修改的商品的索引
        const index = cart.findIndex(v=>
            v.goods_id===id
        );
        // 4.判断是否要去执行删除
        if(cart[index].num===1 && operation===-1){
            // 用showModal的封装方法
            const res = await showModal({
                //传到封装的方法里面
                content:'您是否要删除该商品?'
            });
            //点击确定，则删除该商品
            if (res.confirm) {
                cart.splice(index,1);
                //这里用this需要吧上面的res改成箭头函数
                this.setCart(cart);
            } 
            //点击取消，不做减操作
            else if (res.cancel) {
                console.log('用户点击取消')
            }
        }else{
            // 5.进行修改数量
            // (当operation为1的时候，num+=1就是+1，operation为-1的时候，+=-1就是-1)
            cart[index].num+=operation;

            // 6.设置回缓存和data中  调用封装好的方法
            this.setCart(cart);
        }    
    },
    //点击结算
    async handlePay(){
        // 1.获取收货地址和结算中的总数totalNum
        const {address,totalNum} = this.data;
        if(!address.userName){
            await showToast({
                //传到封装的方法里面
                title:'您还没有选择收货地址~',
                icon:'none',
            });
            return;
        }
        // 2.判断用户有没有选购商品
        if(totalNum===0){
            await showToast({
                //传到封装的方法里面
                title:'您还没有选购商品~',
                icon:'none',
            });
            return;
        }
        // 3.跳转到支付页面
        wx.navigateTo({
            url: '/pages/pay/pay',
        });
          
    }
});