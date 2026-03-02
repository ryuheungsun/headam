<template>
  <div class="container mt-5">

    <h2 class="mb-4 fw-bold">상품 리스트</h2>

  </div>
  <div class="container mt-5">
    <div class="card shadow">
      <div class="card-header bg-primary text-white">
        <h4>파일 업로드</h4>
      </div>

      <div class="card-body">

        <!-- 파일 선택 -->
        <div class="mb-3">
          <label class="form-label">파일 선택</label>
          <input
            type="file"
            class="form-control"
            @change="handleFileChange"
          />
        </div>

        <!-- 업로드 버튼 -->
        <button
          class="btn btn-success"
          @click="uploadFile"
          :disabled="!selectedFile"
        >
          업로드
        </button>

        <!-- 결과 메시지 -->
        <div v-if="message" class="alert alert-info mt-3">
          {{ message }}
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "FileUpload",
  data() {
    return {
      selectedFile: null,
      message: ""
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
    },

    async uploadFile() {
      if (!this.selectedFile) {
        this.message = "파일을 선택하세요.";
        return;
      }

      const formData = new FormData();
      formData.append("file", this.selectedFile);
      const server = process.env.VUE_APP_SERVER; 
      try {
        const response = await axios.post(
          `${server}/api/shop/fileUpload.do`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );

        this.message = response.data;
      } catch (error) {
        this.message = "업로드 실패";
        console.error(error);
      }
    }
  }
};
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: auto;
}
</style>
