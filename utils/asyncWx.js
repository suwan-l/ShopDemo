//promise 形式 getSetting
export const getSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}

//promise 形式 chooseAddress
export const chooseAddress=()=>{
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}

//promise 形式 openSetting
export const openSetting=()=>{
    return new Promise((resolve,reject)=>{
        wx.openSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}

// promise 形式 wx.showModal
export const showModal=({content})=>{
    return new Promise((resolve,reject)=>{
        wx.showModal({
            title: '提示',
            content: content,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });
          
    })
}

// promise 形式 wx.showToast
export const showToast=({title , icon})=>{
    return new Promise((resolve,reject)=>{
        wx.showToast({
            title: title,
            icon: icon,
            duration: 2000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });       
    })
}

// promise 形式 wx.login
export const login=()=>{
    return new Promise((resolve,reject)=>{
        wx.login({
            timeout:10000,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });       
    })
}

/**
 * promise 形式 wx.requestPayment 微信支付
 * @param {object} pay 支付所必要的参数 
 */
export const requestPayment=(pay)=>{
    return new Promise((resolve,reject)=>{
        wx.requestPayment({
            ...pay,
            // timeStamp: '',
            // nonceStr: '',
            // package: '',
            // signType: '',
            // paySign: '',
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {}
        });   
    })
}