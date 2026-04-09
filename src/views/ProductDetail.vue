<template>
  <div class="container mt-5">

    <div class="row gx-5">

      <!-- 좌측 이미지 -->
      <div class="col-md-6">
        <!-- 큰 이미지 -->
        <div class="mb-3 text-center product-main-img">
          <img :src="product.image" class="img-fluid" alt="상품 이미지" />
        </div>

        <!-- 썸네일 이미지 -->
        <div class="d-flex gap-2 thumbs-wrapper justify-content-center">
          <img v-for="(thumb, idx) in product.thumbnails" :key="idx" :src="thumb" class="img-thumbnail thumb-img" />
        </div>
      </div>

      <!-- 우측 상품 정보 -->
      <div class="col-md-6">

        <!-- 상품명 -->
        <h2 class="fw-bold mb-3">{{ product.productName }}</h2>

        <!--  배송/재고/포인트 정보 박스 -->
        <div class="info-box mb-4">

          <div class="info-row">
            <span class="info-label">구매제한</span>
            <span class="info-value">
              {{ product.purchaseLimit }}
            </span>
          </div>
          <div class="info-row">
            <span class="info-label">배송방법</span>
            <span class="info-value">
              <select class="form-select" v-model="product.receiveMethod">
                <option value="1">택배</option>
                <option value="2">방문수령</option>
              </select>
            </span>
          </div>
          <div class="info-row" v-if="product.receiveMethod === '1'">
            <span class="info-label">배송비</span>
            <span class="info-value">
              {{ product.shippingCost }}원
            </span>
          </div>
          <div class="info-row" v-if="product.receiveMethod === '2'">
            <span class="info-label">방문수령지</span>
            <span class="info-value">
              충남 천안시 서북구 부성 6길 11 해담
            </span>
          </div>

        </div>

        <!-- 가격 / 할인 -->
        <div class="d-flex align-items-baseline mb-3">
          <span class="fs-3 fw-bold text-danger">{{ product.price }} 원</span>
          <span v-if="product.salePrice" class="text-muted text-decoration-line-through fs-5 ms-3">
            {{ product.salePrice }} 원
          </span>
        </div>

        <!-- 옵션 선택 -->
        <div class="mb-3">
          <select class="form-select" v-model="product.option">
            <option value="0" selected>옵션 선택</option>
            <option v-for="(opt, idx) in options" :key="idx" :value="opt.itemCode">
              {{ opt.itemName }} --- {{ opt.price }}원
            </option>
          </select>
        </div>

        <!-- 수량 -->
        <div class="mb-4 d-flex align-items-center gap-2">
          <button class="btn btn-outline-secondary" @click="decQty">-</button>
          <input type="text" v-model="this.product.quantity" class="form-control text-center w-25" readonly />
          <button class="btn btn-outline-secondary" @click="incQty">+</button>
        </div>

        <!-- 버튼 -->
        <div class="d-flex gap-2 mb-4">
          <button class="btn btn-danger flex-fill py-2" @click="buyNow">
            구매하기
          </button>
          <button class="btn btn-outline-secondary flex-fill py-2" @click="addCart('Y')">
            장바구니 담기
          </button>
        </div>

        <!-- 추가 정보 (기존 구조 유지) -->
        <div class="small text-secondary">

          <!-- 수정 / 삭제 버튼 -->
          <div class="d-flex justify-content-end gap-2 mt-2">
            <button class="btn btn-secondary btn-sm" style="width:20%;" @click="$router.push('/productList')">
              목록
            </button>
            <template v-if="userStore.role == 'admin'">
              <button class="btn btn-primary btn-sm" style="width:20%;" @click="goEdit">
                수정
              </button>
              <button class="btn btn-danger btn-sm" style="width:20%;" @click="deleteProduct">
                삭제
              </button>
            </template>
          </div>

        </div>

      </div>
    </div>

    <!-- 상세 정보 탭 -->
    <div class="mt-5">
      <ul class="nav nav-tabs">

        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'desc' }" @click="activeTab = 'desc'">
            상품설명
          </button>
        </li>

        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'detail' }" @click="activeTab = 'detail'">
            상세정보
          </button>
        </li>

        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'review' }" @click="activeTab = 'review'">
            리뷰
          </button>
        </li>

      </ul>

      <div class="border p-4">

        <div v-if="activeTab === 'desc'">
          <div class="editor-content" v-html="product.description"></div>
        </div>

        <div v-if="activeTab === 'detail'">
          <div class="editor-content" v-html="product.detailInfo"></div>
        </div>

        <div v-if="activeTab === 'review'">
          <div v-if="product.reviews && product.reviews.length">
            <div v-for="(review, idx) in product.reviews" :key="idx" class="mb-3 border-bottom pb-2">
              <strong>{{ review.user }}</strong>
              <p class="mb-1 text-warning">
                ⭐ {{ review.rating }} / 5
              </p>
              <p>{{ review.comment }}</p>
            </div>
          </div>
          <div v-else>
            리뷰가 없습니다.
          </div>
        </div>

      </div>

    </div>

    <!-- 로그인 모달 -->
    <div class="modal fade" id="loginModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content login-modal">

          <div class="modal-header border-0">
            <h5 class="modal-title fw-bold">로그인 필요</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>

          <div class="modal-body text-center">
            <p>
              로그인이 필요한 서비스입니다.<br>
              로그인 페이지로 이동하시겠습니까?
            </p>
          </div>

          <div class="modal-footer border-0 d-flex gap-2">

            <button class="btn btn-outline-secondary flex-fill" data-bs-dismiss="modal">
              취소
            </button>

            <button class="btn btn-danger flex-fill" @click="goLogin">
              로그인
            </button>

          </div>

        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios"
import { useUserStore } from "@/stores/userStore"
import * as bootstrap from "bootstrap"
const server = process.env.VUE_APP_SERVER;

export default {
  name: "ProductDetail",
  props: ["id"],

  data() {
    return {
      qty: 1,
      product: {
        productCode: '',
        productName: '',
        brand: '',
        category: '',
        price: '',
        quantity: 0,
        description: '',
        detatilInfo: '',
        shippingType: '',
        shippingCost: '',
        purchaseLimit: '',
        shippingInfo: '',
        receiveMethod: '',
        option: '',
        stock: '',
        point: '',
        image: '',
        thumbnails: []
      },
      options: {
        itemCode: '',
        itemName: '',
        price: ''
      },
      activeTab: 'desc'
    }
  },
  computed: {
    userStore() {
      return useUserStore()
    }
  },
  async mounted() {
    await this.fetchProduct()
    await this.fetchOptins()
  },
  methods: {


    goEdit() {
      const id = this.$route.params.id
      this.$router.push({
        name: 'productEdit',
        params: { id }
      })
    },

    async fetchProduct() {
      try {
        const res = await axios.get(
          `${server}/api/shop/product/${this.id}.do`
        )
        this.product = res.data
      } catch (err) {
        console.error(err)
      }
    },

    async fetchOptins() {
      try {
        const res = await axios.get(
          `${server}/api/shop/options.do`, { productCode: "" + this.product.productCode }
        )
        this.options = res.data
      } catch (err) {
        console.error(err)
      }
    },

    incQty() {
      this.product.quantity++
    },

    decQty() {
      if (this.product.quantity > 1) this.product.quantity--
    },

    async deleteProduct() {
      const id = this.$route.params.id

      if (!confirm("정말 삭제하시겠습니까?")) return

      try {
        await axios.delete(
          `${server}/api/shop/product/${id}.do`
        )

        alert("삭제되었습니다.")
        this.$router.push("/productList")

      } catch (error) {
        console.error(error)
        alert("삭제 중 오류 발생")
      }
    },

    openCategoryModal() {
      this.showModal = true
    },

    closeCategoryModal() {
      this.showModal = false
      this.newCategoryId = ""
      this.newCategoryName = ""
    },

    async buyNow() {

      // 장바구니 먼저 완료 기다림
      const result = await this.addCart('N')

      if (result !== 'success') {
        alert("장바구니 담기 실패")
        return
      }

      // 완료 후 이동
      this.$router.push({
        path: "/order",
        query: {
          items: this.product.productCode,
          option: this.product.option
        }
      })
    },

    addCart(flag) {
      if (!this.userStore.userId) {
        const modal = new bootstrap.Modal(
          document.getElementById("loginModal")
        )
        modal.show()
        return
      }

      // 장바구니 API 호출 예시
      return axios.post(`${server}/api/cart/addCart.do`, {
        productCode: "" + this.product.productCode,
        userId: this.userStore.userId,
        quantity: this.product.quantity,
        option: this.product.option
      })
        .then(res => {
          console.log(res)

          if (res.data === "success") {
            if (flag == 'Y') {
              alert("장바구니에 담았습니다.")
            }
            return "success"
          } else {
            alert("저장 실패")
            return "fail"
          }
        })
        .catch(err => {
          console.error(err)
          alert("서버 오류")
          return "error"
        })
    },

    goLogin() {
      const modalEl = document.getElementById("loginModal")
      const modal = bootstrap.Modal.getInstance(modalEl)

      if (modal) {
        modal.hide()
      }
      this.$router.push("/login")
    }

  }
}
</script>

<style scoped>
.product-main-img img {
  border: 1px solid #eee;
  padding: 10px;
  object-fit: contain;
}

.thumb-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
}

.thumb-img:hover {
  cursor: pointer;
  transform: scale(1.1);
  transition: 0.2s;
}

/*  정보 박스 디자인 */
.info-box {
  border: 1px solid #eee;
  padding: 15px;
  border-radius: 6px;
  background: #fafafa;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  font-size: 0.95rem;
}

.info-label {
  color: #666;
}

.info-value {
  font-weight: 500;
  width: 70%
}

.highlight {
  color: #d32f2f;
  font-weight: bold;
}

.login-modal {
  max-width: 60%;
}

.editor-content {
  line-height: 1.7;
  word-break: break-word;
}

.editor-content img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 10px auto;
}

.editor-content p {
  margin-bottom: 12px;
}

/* 태블릿 / 모바일 */
@media (max-width: 768px) {
  .login-modal {
    max-width: 100%;
  }
}
</style>
