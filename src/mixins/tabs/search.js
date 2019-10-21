import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    scrollHeight: 0, // 搜索建议列表的可用高度
    searchValue: '', // 搜索关键字
    suggestList: [],  // 搜索到的建议列表数据
    kwList: []       // 搜索历史 
  }

  methods = {
    // 点击搜索建议项，跳转到商品详情页面
    goGoodsDetail(id) {
      wepy.navigateTo({url: `/pages/goods_detail/main?goods_id=${id}`})
    },
    // 关键词改变搜索列表
    onChange(e) {
      const searchVal = wepy.trim(e.detail)
      this.searchValue = e.detail.trim()
      if (searchVal.length > 0) {
        this.getSuggestList(searchVal)
      } else {
        this.suggestList = []
      }
    },
    // 点击键盘右下角搜索按钮跳转到商品列表页面
    onSearch(e) {
      const key = wepy.trim(e.detail)
      if (key.length > 0) {
        // 如果已经存在该条记录就不往里存了
        if (this.kwList.indexOf(key) === -1) {
          this.kwList.unshift(key)
        }
        // 只截取最新的前十个关键字
        this.kwList = this.kwList.slice(0, 10)
        wepy.setStorageSync('kw', this.kwList)
        wepy.navigateTo({url: `/pages/goods_list?query=${key}`})
      }
    },
    // 取消搜索清空搜索建议列表
    onCancel() {
      this.suggestList = []
    },
    // 点击历史记录标签跳转到商品列表页面
    goGoodsList(key) {
      this.searchValue = key
      const keyIndex = this.kwList.indexOf(key)
      if (keyIndex !== -1) {
        // console.log(this.kwList.splice(keyIndex, 1))
        this.kwList.unshift(this.kwList.splice(keyIndex, 1)[0])
      }
      wepy.navigateTo({
        url: `/pages/goods_list?query=${key}`
      })
    },
    // 清空历史记录
    clearHistory() {
      this.kwList = []
      wepy.setStorageSync('kw', [])
    }
  }

  computed = {
    isShowHistory() {
      return this.searchValue.length <= 0
    }
  }

  onLoad() {
    // 获取本地搜索记录缓存
    const kwList = wepy.getStorageSync('kw') || []
    this.kwList = kwList

    // 获取搜索建议列表可用高度
    this.getWindowScrollHeight()
  }

  // 获取搜索建议列表
  async getSuggestList(key) {
    const {data: res} = await wepy.get('/goods/qsearch', {query: key})
    if (res.meta.status !== 200) {
      return wepy.baseToast()
    }
    this.suggestList = res.message
    this.$apply()
  }

  async getWindowScrollHeight() {
    const res = await wepy.getSystemInfo()
    if (res.errMsg === 'getSystemInfo:ok') {
      this.scrollHeight = res.windowHeight - 54 // 可用高度减去搜索框高度
      this.$apply()
    }
  }
}