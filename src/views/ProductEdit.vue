<template>
  <div class="product-container">

    <div class="product-wrapper">

      <!-- 좌측 이미지 영역 -->
      <div class="left">
        <div class="image-box">
          <img v-if="imagePreview" :src="imagePreview" />
          <div v-else class="no-image">이미지를 선택하세요</div>
        </div>
        <input type="file" @change="onImageChange" />
      </div>

      <!-- 우측 상품 정보 영역 -->
      <div class="right">

        <h2 class="product-title">
          <input v-model="form.productName" placeholder="상품명 입력" />
        </h2>
        <!-- <input v-model="form.kind" placeholder="구분" /> -->

        <div class="info-table">

          <div class="info-row">
            <span>브랜드</span>
            <input v-model="form.brand" placeholder="브랜드 입력" />
          </div>

          <!-- 카테고리 -->
          <div class="info-row category-row">
            <span>카테고리</span>
            <select v-model="form.category" @change="onCategoryChange">
              <option v-for="cat in form.categoryList" :key="cat.categoryId" :value="cat.categoryId">
                {{ cat.categoryName }}
              </option>
            </select>
            <button class="btn btn-outline-secondary btn-sm" type="button" @click="openCategoryModal">
              + 추가
            </button>
          </div>

          <div class="info-row">
            <span>상품코드</span>
            <input v-model="form.productCode" placeholder="상품코드 입력" />
          </div>

          <div class="info-row">
            <span>수령 방법</span>
            <select v-model="form.receiveMethod">
              <option value="1">택배</option>
              <option value="2">방문수령</option>
            </select>
          </div>

          <div class="info-row">
            <span>판매가</span>
            <input type="number" v-model.number="form.price" />
          </div>

          <div class="info-row">
            <span>배송비</span>
            <select v-model="form.shippingType">
              <option value="1">무료배송</option>
              <option value="2">유료배송</option>
              <option value="3">조건부 무료배송</option>
            </select>
          </div>

          <div class="info-row" v-if="form.shippingType === '2' || form.shippingType === '3'">
            <span>배송비 금액</span>
            <input type="number" v-model.number="form.shippingCost" />
          </div>

          <div class="info-row" v-if="form.shippingType === '3'">
            <span>무료 조건 금액</span>
            <input type="number" v-model.number="form.freeLimit" />
          </div>

          <div class="info-row">
            <span>구매제한</span>
            <input type="text" v-model="form.purchaseLimit" />
          </div>

        </div>

        <!-- 버튼 영역 -->
        <div class="d-flex justify-content-end gap-2 mt-4">
          <router-link to="/productList" class="btn btn-secondary">
            목록
          </router-link>

          <button type="button" class="btn btn-primary" @click="onSubmit">
            {{ form.kind == 1 ? '입력 완료' : '수정 완료' }}
          </button>

          <button type="button" class="btn btn-danger" @click="deleteProduct">
            삭제
          </button>
        </div>

      </div>
    </div>

    <!--상품 설명 -->
    <div class="description-area">
      <h3>상품 설명</h3>
      <ckeditor :editor="editor" v-model="form.description" :config="editorConfig" />
    </div>

    <!--상세 정보 -->
    <div class="shipping-area">
      <h3>상세정보</h3>
      <!-- <textarea v-model="form.shippingInfo" style="height: 450px;"></textarea> -->
      <ckeditor :editor="editor" v-model="form.detailInfo" :config="editorConfig" />
    </div>

    <!-- 카테고리 모달 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-box">
        <h5 class="mb-3">카테고리 추가</h5>

        <input type="text" class="form-control mb-3" v-model="newCategoryId" placeholder="카테고리 ID를 입력하세요" />
        <input type="text" class="form-control mb-3" v-model="newCategoryName" placeholder="카테고리명을 입력하세요" />

        <div class="d-flex justify-content-end gap-2">
          <button class="btn btn-secondary btn-sm" @click="closeCategoryModal">
            취소
          </button>

          <button class="btn btn-primary btn-sm" @click="addCategory">
            저장
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios"
import { useUserStore } from "@/stores/userStore"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"
import { Ckeditor } from "@ckeditor/ckeditor5-vue"

const server = process.env.VUE_APP_SERVER

export default {
  name: "ProductEdit",

  components: {
    Ckeditor
  },

  data() {
    return {
      editor: ClassicEditor,

      editorConfig: {
        toolbar: [
          "heading",
          "|",
          "bold",
          "italic",
          "|",
          "alignment",
          "|",
          "bulletedList",
          "numberedList",
          "|",
          "insertTable",
          "imageUpload",
          "|",
          "undo",
          "redo"
        ],

        ckfinder: {
          uploadUrl: server + "/api/upload/image.do"
        }
      },

      imagePreview: null,
      imageFile: null,

      showModal: false,
      newCategoryId: "",
      newCategoryName: "",

      form: {
        kind: 1,
        productName: "",
        brand: "해담",
        productCode: "",
        category: "1",
        price: 0,
        description: "",
        detailInfo: "",
        shippingType: "",
        shippingCost: 0,
        freeLimit: 0,
        shippingInfo: "",
        receiveMethod: "",
        purchaseLimit: 0,
        categoryList: [],

      }
    }
  },

  computed: {
    userStore() {
      return useUserStore()
    }
  },

  async mounted() {
    await this.fetchProduct()

    if (this.userStore.role !== "admin") {
      alert("관리자만 접근 가능합니다.")
      this.$router.replace("/")
      return
    }
  },

  methods: {

    async fetchProduct() {

      const id = this.$route.params.id

      try {

        const res = await axios.get(`${server}/api/shop/product/${id}.do`)
        const data = res.data

        this.form = {
          ...this.form, ...data,
          description: data.description ?? "",
          detailInfo: data.detailInfo ?? ""
        }

        this.form.kind = data.productCode ? 2 : 1

        this.imagePreview = data.image

        if (!this.form.categoryList) {
          this.form.categoryList = []
        }

      } catch (err) {

        console.error(err)

      }

    },

    onImageChange(e) {

      const file = e.target.files[0]

      if (file) {

        this.imageFile = file
        this.imagePreview = URL.createObjectURL(file)

      }

    },

    onCategoryChange() {

      this.form.productCode = this.form.category

    },

    async onSubmit() {

      try {

        const id = this.$route.params.id

        const formData = new FormData()

        Object.keys(this.form).forEach(key => {

          if (key === "categoryList") {

            formData.append(
              "categoryListJson",
              JSON.stringify(this.form.categoryList)
            )

          } else {

            if (this.form[key] !== null && this.form[key] !== undefined) {

              formData.append(key, this.form[key])

            }

          }

        })

        if (this.imageFile) {

          formData.append("imageFile", this.imageFile)

        }

        formData.append("origin", server)

        await axios.post(`${server}/api/shop/product/${id}.do`, formData)

        alert(
          this.form.kind == 1
            ? "상품이 입력되었습니다."
            : "상품이 수정되었습니다."
        )

        this.$router.push("/productList")

      } catch (error) {

        console.error(error)

        alert("수정 중 오류 발생")

      }

    },

    async deleteProduct() {

      const id = this.$route.params.id

      if (!confirm("정말 삭제하시겠습니까?")) {
        return
      }

      try {

        await axios.delete(`${server}/api/shop/product/${id}.do`)

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

    addCategory() {

      if (!this.newCategoryId.trim()) return

      const newCat = {

        categoryId: this.newCategoryId,
        categoryName: this.newCategoryName,
        isNew: "Y"

      }

      this.form.categoryList.push(newCat)

      this.form.category = this.newCategoryId

      this.closeCategoryModal()

    }

  }
}
</script>

<style scoped>
.product-container {
  max-width: 1200px;
  margin: 50px auto;
  font-family: 'Noto Sans KR', sans-serif;
}

.product-wrapper {
  display: flex;
  gap: 60px;
}

.left {
  width: 45%;
}

.right {
  width: 55%;
}

.image-box {
  width: 100%;
  height: 450px;
  border: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  background: #fafafa;
}

.image-box img {
  max-width: 100%;
  max-height: 100%;
}

.no-image {
  color: #999;
}

.product-title input {
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: none;
  border-bottom: 2px solid #ddd;
  padding: 10px 0;
  margin-bottom: 25px;
}

.info-table {
  border-top: 1px solid #eee;
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f2f2f2;
}

.info-row span {
  width: 130px;
  font-weight: bold;
  color: #5a4a3f;
}

.info-row input,
.info-row select {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.description-area,
.shipping-area {
  margin-top: 60px;
}

textarea {
  width: 100%;
  min-height: 150px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* 모달 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-box {
  background: white;
  padding: 30px;
  width: 350px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
}

/* 카테고리 한줄 유지 */
.category-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-row select {
  flex: 1;
}

.category-row button {
  flex: none;
  white-space: nowrap;
}

/* =========================
   모바일 반응형
========================= */
@media (max-width:768px) {

  .product-wrapper {
    flex-direction: column;
    gap: 30px;
  }

  .left,
  .right {
    width: 100%;
  }

  .image-box {
    height: 280px;
  }

  .info-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .info-row span {
    width: auto;
  }

  .info-row input,
  .info-row select {
    width: 100%;
  }

  .category-row {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  .category-row select {
    flex: 1;
  }

  .category-row button {
    flex: none;
  }
}
</style>