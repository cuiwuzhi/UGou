import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    // 首页轮播图数据
    swiperList: [],
    // 首页分类数据  
    cateItems: [],
    // 首页楼层数据
    floorData: []
  }

  methods = {
    // 点击楼层中图片跳转到对应的商品列表页面
    goGoodsList(url) {
      wepy.navigateTo({
        url
      })
    }
  }

  onLoad() {
    this.getSwiperData()
    this.getCateItems()
    this.getFloorData()
  }

  // 获取轮播图数据
  async getSwiperData() {
    const {data: res} = await wepy.get('/home/swiperdata')
    wepy.hideLoading()
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.swiperList = res.message
    this.$apply()
  }

  // 获取首页分类数据
  async getCateItems() {
    const {data: res} = await wepy.get('/home/catitems')
    wepy.hideLoading()
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.cateItems = res.message
    this.$apply()
  }

  // 获取首页楼层数据
  async getFloorData() {
    const {
      data: res
    } = await wepy.get('/home/floordata')
    wepy.hideLoading()
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.floorData = res.message
    this.$apply()
  }
}
