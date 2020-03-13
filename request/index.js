//同时发送异步代码的次数(例如首页会同时调用三次接口数据)
let ajaxTime=0;

// 封装request请求
export const request=(params)=>{
    // 判断url中是否带有/my/请求的是私有路径 带上header token
    let header ={...params.header};
    //如果请求头中有/my/
    if(params.url.includes("/my/")){
        //拼接header带上token
        header['Authorization'] = wx.getStorageSync("token");      
    };

    ajaxTime++;
    // 显示加载图标
    wx.showLoading({
        title: '加载中',
        mask:true
    })
    // 公共的接口地址
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";//请求地址
    return new Promise((resolve,reject)=>{
        wx.request({
            ...params,
            header:header,
            // 接口地址前缀加上返回的url
            url:baseUrl + params.url,
            success: (result) => {
              resolve(result);  
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTime--;
                // 当异步次数为0的时候，关闭加载
                if(ajaxTime===0){
                    // 不管数据加载成功失败都会关闭加载弹窗
                    wx.hideLoading()
                }
                
            }
        });
          
    })
}