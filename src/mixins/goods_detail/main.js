import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    goods_id: '', // 商品的ID值
    goodsInfo: {}, // 商品的详情数据
    addressInfo: null // 收货地址信息
  }

  methods = {
    // 预览图片
    preview(img) {
      wepy.previewImage({
        urls: this.goodsInfo.pics.map(x => x.pics_big),
        current: img
      })
    },
    // 获取用户收货地址
    async chooseAddress() {
      const res = await wepy.chooseAddress().catch(err => err)
      if (res.errMsg !== 'chooseAddress:ok' && !this.addressInfo) {
        return wepy.baseToast('获取收货地址失败！')
      }
      if (res.errMsg === 'chooseAddress:ok') {
        this.addressInfo = res
        wepy.setStorageSync('address', res)
        this.$apply()
      }
    },
    // 添加商品到购物车
    addToCart() {
      this.$parent.addGoodsToCart(this.goodsInfo)
      wepy.showToast({
        title: '已加入购物车',
        icon: 'success'
      })
    }
  }

  computed = {
    // 收货地址动态渲染
    addressStr() {
      const addr = this.addressInfo
      return addr ? `${addr.provinceName}${addr.cityName}${addr.countyName}${addr.detailInfo}` : '请选择收货地址'
    },
    // 计算购物车商品数量
    cartListCount() {
      return this.$parent.globalData.cartListTotal || ''
    }
  }

  onLoad(options) {
    this.goods_id = options.goods_id //接受传过来的商品ID
    this.getGoodsInfo() //获取商品信息数据
    this.getAddressFromStorage()  // 从缓存中查找收货地址
  }

  // 获取商品详情数据
  async getGoodsInfo() {
    const {data: res} = await wepy.get('/goods/detail', {goods_id: this.goods_id})
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.goodsInfo = res.message
    this.$apply()
  }

  //  从缓存中查找收货地址
  async getAddressFromStorage() {
    const res = await wepy.getStorageSync('address')
    res && (this.addressInfo = res)
    this.$apply()
  }
}
