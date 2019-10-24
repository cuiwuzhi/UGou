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
    },
    // 监听全选复选框值改变的事件
    onFullCheckChanged(e) {
      this.$parent.updateAllGoodsStatus(e.detail)
    },
    // 提交订单
    submitOrder() {
      if (this.amount <= 0) {
        return wepy.baseToast('您还没有选择商品呢！')
      }
      wepy.navigateTo({
        url: '/pages/order'
      })
    }
  }

  computed = {
    // 判断购物车是否为空
    cartIsEmpty() {
      return this.cart.length <= 0
    },
    // 总价格计算，单位为：分
    amount() {
      let total = 0
      this.cart.forEach(x => {
        if (x.isCheck) {
          total += x.price * x.count
        }
      })
      return total * 100 // 单位转换为元
    },
    // 全选框是否选中
    isFullChecked() {
      const allCount = this.cart.length // 购物车商品个数
      let c = 0
      this.cart.forEach(x => {
        if (x.isCheck) {
          c++
        }
      })
      return allCount === c
    }
  }

  onLoad() {
    // 初始化购物车列表数据，从全局数据中获取
    this.cart = this.$parent.globalData.cart || []  
  }

  onShow() {
     // 设置购物车角标数量
     this.$parent.renderCartBadge()
  }
}
