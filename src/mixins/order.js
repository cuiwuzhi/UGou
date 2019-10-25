import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    addressInfo: null
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
  }
}