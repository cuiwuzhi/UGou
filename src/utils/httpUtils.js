import wepy from 'wepy'

export default {
  get(url, params, cb, failCb) {
    wepy.showLoading()
    
    wepy.request({
      url: url,
      method: 'GET',
      data: params,
      success: res => {
        cb && cb(res)
      },
      fail: (err) => {
        failCb && failCb(err)
      },
      complete: () => {
        wepy.hideLoading()
      }
    })
  },
  post(url, params, cb, failCb) {
    wepy.showLoading()

    wepy.request({
      url: url,
      method: 'POST',
      data: params,
      header: {'content-type': 'applicction/x-www-form-urlencoded;charset=UTF-8'},
      success: res => {
        cb && cb(res)
      },
      fail: (err) => {
        failCb && failCb(err)
      },
      complete: () => {
        wepy.hideLoading()
      }
    })
  }
}
