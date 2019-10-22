import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cart: [] // 购物车商品列表数据
  }

  methods = {
    // 监听商品数量变化事件
    countChanged(e) {
      this.$parent.updateGoodsCount(e.target.dataset.id, e.detail)
    }
  }

  computed = {
    cartIsEmpty() {
      return this.cart.length <= 0
    }
  }

  onLoad() {
    this.cart = this.$parent.globalData.cart || []
  }
}
