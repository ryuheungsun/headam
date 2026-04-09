<template>
  <div class="cart-page">

    <div class="title-box">
      <h3>장바구니</h3>
    </div>

    <div v-if="orders.length === 0" class="empty-box">
      장바구니 내역이 없습니다.
    </div>

    <div v-else>

      <div v-for="order in orders" :key="order.productCode" class="cart-card">

        <div class="cart-body">

          <input type="checkbox" v-model="order.checked">

          <img :src="order.image || '/noimage.png'" class="thumb">

          <div class="product-info">

            <div class="product-name">
              {{ order.productName }}
            </div>

            <div class="product-option">
              옵션 : {{ order.optionName }}
            </div>

            <div class="product-qty">
              수량 : {{ order.quantity }}
            </div>

            <div class="product-price">
              {{ formatPrice(order.price) }}원
            </div>

          </div>

          <div class="btn-box">

            <button class="order-btn" @click="orderCart(order.productCode)">
              주문
            </button>

            <button class="delete-btn" @click="removeCart(order.productCode)">
              삭제
            </button>

          </div>

        </div>
      </div>
      <div class="all-order-box">
        <button class="all-order-btn" @click="orderAll">
          선택상품 주문하기
        </button>
      </div>

      <div class="total-box">
        총 금액 :
        <span class="price">
          {{ formatPrice(totalPrice) }}원
        </span>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios"
import Swal from "sweetalert2";
import { useUserStore } from "@/stores/userStore"

const server = process.env.VUE_APP_SERVER

export default {

  data() {
    return {
      orders: []
    }
  },

  computed: {

    userStore() {
      return useUserStore()
    },

    totalPrice() {
      return this.orders
        .filter(o => o.checked)
        .reduce((sum, o) => sum + Number(o.price), 0)
    }

  },

  mounted() {
    this.getCartList()
  },

  methods: {

    async getCartList() {

      try {

        const res = await axios.get(`${server}/api/cart/cartList.do`, {
          params: {
            userId: this.userStore.userId
          }
        })

        this.orders = res.data.map(o => ({
          ...o,
          checked: false
        }))

      } catch (e) {
        console.error(e)
      }

    },

    async removeCart(productCode) {

      if (!confirm("삭제하시겠습니까?")) return

      await axios.post(`${server}/api/cart/deleteCart.do`, {
        productCode: productCode,
        userId: this.userStore.userId
      })

      this.getCartList()

    },

    orderCart(productCode) {

      this.$router.push({
        path: "/order",
        query: {
          items: productCode
        }
      })

    },

    formatPrice(price) {
      return Number(price).toLocaleString()
    },

    orderAll() {

      const selected = this.orders
        .filter(o => o.checked)
        .map(o => o.productCode)

      if (selected.length === 0) {
        //alert("상품을 선택해주세요.")
        Swal.fire({
          title: "상품선택",
          text: "상품을 선택해주세요",
          icon: "info",
          confirmButtonText: "확인",
          width: 300,       // 가로 크기 조절
          heightAuto: false // 높이 자동 확대 방지
        });
        return
      }

      this.$router.push({
        path: "/order",
        query: {
          items: selected.join(",")
        }
      })

    }

  }

}
</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: auto;
  padding: 20px;
}

.title-box {
  border-bottom: 1px solid #ddd;
  margin-bottom: 20px;
  padding-bottom: 10px;
}

.empty-box {
  text-align: center;
  padding: 80px 0;
  color: #888;
}

.cart-card {
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 12px;
}

.cart-body {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
}

.thumb {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
}

.product-info {
  flex: 1;
}

.product-name {
  font-weight: bold;
  margin-bottom: 5px;
}

.product-price {
  color: #e60023;
  font-weight: bold;
}

.btn-box {
  display: flex;
  gap: 4px;
}

.order-btn {
  padding: 5px 10px;
  font-size: 13px;
  background: #0d6efd;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn {
  padding: 5px 10px;
  font-size: 13px;
  background: white;
  border: 1px solid #dc3545;
  color: #dc3545;
  border-radius: 6px;
  cursor: pointer;
}

.total-box {
  text-align: right;
  margin-top: 25px;
  font-size: 18px;
  font-weight: bold;
}

.price {
  color: #e60023;
}

.all-order-box {
  margin-top: 20px;
  text-align: center;
}

.all-order-btn {
  width: 50%;
  font-size: 15px;
  background: #2300d6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  height: 30px;
}

@media (max-width:768px) {

  .cart-page {
    padding: 0;
  }

  .cart-body {
    padding: 10px;
  }

  .order-btn,
  .delete-btn {
    padding: 4px 8px;
    font-size: 12px;
  }

  .product-option {
    font-size: 13px;
    color: #555;
  }

  .product-qty {
    font-size: 13px;
    color: #555;
  }

}
</style>