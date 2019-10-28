import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    addressInfo: null, // 收货地址信息
    cart: [] // 已勾选的商品列表
  }

  methods = {
    // 选择收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg === 'chooseAddress:ok') {
        this.addressInfo = res
        wepy.setStorageSync('address', res)
        this.$apply()
      }
    },
    // 登录获取用户信息
    async getUserInfo(e) {
      const userInfo = e.detail
      if (userInfo.errMsg !== 'getUserInfo:ok') {
        return wepy.baseToast('获取用户信息失败！')
      }
      // 获取登录凭证code
      const loginRes = await wepy.login().catch(err => err)
      console.log(loginRes)
      if (loginRes.errMsg !== 'login:ok') {
        return wepy.baseToast('微信登录失败！')
      }
      // 构建登录需要的参数
      const loginParams = {
        code: loginRes.code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        rawData: userInfo.rawData,
        signature: userInfo.signature
      }
      const {data: res} = await wepy.post('/users/wxlogin', loginParams).catch(err => err)
      console.log(res)
      if (res.meta.status !== 200) {
        return wepy.baseToast('登录失败！')
      }
      // 将获取到的token保存到storage中
      wepy.setStorageSync('token', {
        token: res.message.token,
        timestamp: +new Date()
      })
      this.$apply()
    }
  }

  computed = {
    // 是否显示收货地址按钮
    isHaveAddress() {
      return this.addressInfo !== null
    },
    addressStr() {
      if (this.addressInfo === null) {
        return ''
      }
      return `${this.addressInfo.provinceName}${this.addressInfo.cityName}${this.addressInfo.countyName}${this.addressInfo.detailInfo}`
    }
  }

  onLoad() {
    // 从缓存中获取收货地址
    this.addressInfo = wepy.getStorageSync('address') || null

    // 过滤显示购物车中已勾选的商品
    this.cart = this.$parent.globalData.cart.filter(x => x.isCheck)
    this.$apply()
  }
}