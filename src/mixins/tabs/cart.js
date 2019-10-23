import wepy from 'wepy'

export default class extends wepy.mixin {
  data = {
    cart: [] // 购物车商品列表数据
  }

  methods = {
    // 监听商品数量变化事件
    countChanged(e) {
      this.$parent.updateGoodsCount(e.target.dataset.id, e.detail)
    },
    // 监听购物车列表复选框改变事件
    statusChanged(e) {
      const id = e.target.dataset.id // 当前点击项的商品ID
      const status = e.detail
      this.$parent.updateGoodsStatus(id, status)
    },
    // 删除商品
    removeItem(id) {
      this.$parent.removeGoodsById(id)
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
