import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    goodsList: [], // 商品列表数据
    total: 0, // 总数据条数
    isover: false, // 数据是否加载完毕
    isloading: false, // 数据是否正在请求中，防止发起重复请求
    params: {
      query: '', // 搜索关键字
      cid: '', // 商品分类ID
      pagenum: 1, // 页码
      pagesize: 10 // 每页条数
    }
  }

  onLoad(options) {
    this.params.query = options.query || ''
    this.params.cid = options.cid || ''
    this.getGoodsList()
  }

  // 监听页面触底
  onReachBottom() {
    if (!this.isloading) {
      if (this.params.pagenum * this.params.pagesize < this.total) {
        this.params.pagenum++
        this.getGoodsList()
      } else {
        this.isover = true
      }
    }
  }

  // 页面下拉刷新
  onPullDownRefresh() {
    if (!this.isloading) {
      this.goodsList = []
      this.params.pagenum = 1
      this.getGoodsList(() =>{
        wepy.stopPullDownRefresh()
      })
    }
  }

  methods = {
    goGoodsDetail(goodsId) {
      wepy.navigateTo({
        url: `/pages/goods_detail/main?goods_id=${goodsId}`
      })
    }
  }

  // 获取商品列表数据
  async getGoodsList(cb) {
    this.isloading = true
    const {
      data: res
    } = await wepy.get('/goods/search', this.params)
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.goodsList = [...this.goodsList, ...res.message.goods]
    this.total = res.message.total
    this.isloading = false    
    this.$apply()
    cb && cb()
  }
}
