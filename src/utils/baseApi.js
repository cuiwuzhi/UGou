import wepy from 'wepy'

const baseUrl = 'https://www.zhengzhicheng.cn/api/public/v1'

/**
 * 弹框提示无图标的Toast消息
 * @str 提示的信息
 */
wepy.baseToast = (str = '获取数据失败！') => {
  wepy.showToast({
    title: str,
    icon: 'none',
    duration: 1500
  })
}

/**
 * 发起GET请求的API
 * @url 请求的地址，为相对路径，必须以 / 开头
 * @data 请求携带的参数
 */
wepy.get = (url, data = {}) => {
  return wepy.request({
    url: baseUrl + url,
    method: 'GET',
    data
  })
}

/**
 * 发起POST请求的API
 * @url 请求的地址，为相对路径，必须以 / 开头
 * @data 请求携带的参数
 */
wepy.post = (url, data = {}) => {
  return wepy.request({
    url: baseUrl + url,
    method: 'POST',
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf8'
    },
    data
  })
}

wepy.trim = str => {
  if (typeof str === 'string' && str.constructor === String) {
    return str.replace(/\s/g, '')
  }
  return console.error('typeof str of string!')
}
