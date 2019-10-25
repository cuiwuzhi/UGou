import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    active: 0, // 被激活的索引
    wh: 0, // 设备可用高度
    scrollTop: 0,
    cateList: [],
    secondCate: []
  }

  methods = {
    bindscroll(e) {
      if (this.scrollEndTimer) {
        clearTimeout(this.scrollEndTimer);
        this.scrollEndTimer = null;
      }
      this.scrollEndTimer = setTimeout(function () {
        this.scrollTop = e.detail.scrollTop
      }.bind(this), 500);   
    },
    onChange(e) {
      this.scrollTop = 0
      this.secondCate = this.cateList[e.detail].children
    },
    goGoodsList(id) {
      wepy.navigateTo({
        url: `/pages/goods_list?cid=${id}`
      })
    }
  }
  
  onLoad() {
    // 获取列表数据
    this.getCateList()
    // 获取设备可用高度
    this.getWindowHeight()
  }

  async getCateList() {
    const {data: res} = await wepy.get('/categories')
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.cateList = res.message
    this.secondCate = res.message[0].children
    this.$apply()
  }

  async getWindowHeight() {
    const res = await wepy.getSystemInfo()
    if (res.errMsg === 'getSystemInfo:ok') {
      this.wh = res.windowHeight
      this.$apply()
    }
  }
}