<template>
  <div class="container mt-5">

    <!-- 제목 -->
    <div class="mb-4 border-bottom pb-2">
      <h3 class="fw-bold">주문 내역</h3>
    </div>

    <!-- 주문 없을 때 -->
    <div v-if="orders.length === 0" class="text-center py-5 text-muted">
      주문 내역이 없습니다.
    </div>

    <!-- 주문 리스트 -->
    <div v-else>
      <div v-for="order in orders" :key="order.orderId" class="card mb-3 shadow-sm">
        <div class="card-body" @click="viewOrder(order.orderNo)">

          <div class="d-flex justify-content-between mb-2">
            <strong>주문번호 : {{ order.orderNo }}</strong>
            <span class="text-muted">{{ order.orderDate }}</span>
          </div>

          <div class="d-flex align-items-center clickable">

            <!-- 상품 이미지 -->
            <img :src="order.image" style="width:80px;height:80px;object-fit:cover" class="me-3 rounded" />

            <div class="flex-grow-1">

              <div class="fw-bold">
                {{ order.productName }}
              </div>

              <div class="text-muted">
                수량 : {{ order.quantity }}
              </div>

              <div class="text-danger fw-bold">
                {{ formatPrice(order.price) }}원
              </div>

            </div>

            <div>
              <span class="badge bg-success">
                {{ order.status }}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios"
const server = process.env.VUE_APP_SERVER
import { useUserStore } from "@/stores/userStore"

export default {
  data() {
    return {
      orders: []
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    }
  },

  mounted() {
    this.getOrderList()
  },

  methods: {

    async getOrderList() {

      try {
        const res = await axios.post(`${server}/api/cart/orderList.do`, { orderer: this.userStore.userId })
        console.log(JSON.stringify(res.data, null, 2))

        this.orders = res.data

      } catch (e) {
        console.error(e)
      }

    },

    formatPrice(price) {
      return Number(price).toLocaleString()
    },

    viewOrder(orderNo) {
      this.$router.push({
        path: "/orderComplete",
        query: {
          orderNo: orderNo
        }
      })
    },

  }
}
</script>

<style scoped>
.clickable {
  cursor: pointer;
  transition: background 0.2s;
}

.clickable:hover {
  background: #f8f9fa;
}
</style>