<template>
  <div class="container mt-5">

    <!-- 타이틀 -->
    <div class="mb-4 border-bottom pb-2">
      <h3 class="fw-bold">상품 리스트</h3>
    </div>

    <!-- 로딩 -->
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-dark"></div>
    </div>

    <!-- 에러 -->
    <div v-if="error" class="alert alert-danger">
      데이터를 불러오지 못했습니다.
    </div>

    <!-- 상품 그리드 -->
    <div class="row g-4">

      <div 
        v-for="product in products"
        :key="product.id"
        class="col-6 col-md-3"
      >
        <router-link 
          :to="`/product/${product.productCode}`"
          class="text-decoration-none text-dark"
        >
          <div class="product-card">

            <!-- 이미지 -->
            <div class="product-img">
              <img :src="product.image" />
            </div>

            <!-- 정보 -->
            <div class="product-info">

              <div class="product-title">
                {{ product.productName }}
              </div>

              <div class="product-price">
                {{ product.price }}  원
              </div>

            </div>

          </div>
        </router-link>
      </div>

    </div>

  </div>
</template>

<script>
import axios from 'axios'
axios.defaults.withCredentials = true;
const server = process.env.VUE_APP_SERVER;   

export default {
  name: "ProductList",

  data() {
    return {
      products: [],
      loading: false,
      error: false
    }
  },

  mounted() {
    this.fetchProducts()
  },

  methods: {
    async fetchProducts() {
      this.loading = true
      this.error = false
      
      try {
        const response = await axios.get(
          `/api/shop/productList.do`
        )

        // ⚠️ Spring에서 ModelMap으로 내려줄 경우
        this.products = response.data.resultList || response.data

      } catch (err) {
        console.error(err)
        this.error = true
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

.product-card {
  border: 1px solid #eee;
  padding: 10px;                /* 기존 15px → 10px */
  transition: all 0.2s ease;
  background: #fff;
}

.product-img {
  width: 100%;
  height: 280px;                /* 🔥 200px → 280px */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.product-img img {
  max-height: 260px;            /* 🔥 180px → 260px */
  width: 100%;
  object-fit: contain;
  transition: transform 0.3s;
}

.product-card:hover img {
  transform: scale(1.05);
}


.product-info {
  margin-top: 10px;   /* 기존 15px → 10px (선택) */
}

.product-title {
  font-size: 0.95rem;
  height: 28px;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;  /* 🔥 추가 */
}

.product-price {
  margin-top: 2px;     /* 🔥 8px → 2px */
  font-size: 1.1rem;
  font-weight: bold;
  color: #000;
}


</style>
