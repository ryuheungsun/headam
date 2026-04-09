<template>
  <div class="container mt-3">

    <!-- 제목 + 상단 정보 -->
    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
      <h3 class="fw-bold text-white bg-primary p-2 rounded mb-0">
        회원 목록
      </h3>

      <div class="d-flex align-items-center gap-3">
        <!-- 회원 수 -->
        <div class="fw-bold">
          회원수 : {{ users.length }} 명
        </div>

        <!-- 저장 버튼 -->
        <button class="btn btn-success" @click="saveUsers">
          저장
        </button>
      </div>
    </div>

    <!-- 검색 -->
    <div class="row mb-3 g-2">
      <div class="col-auto">
        <input type="text" v-model="searchName" class="form-control" placeholder="이름 검색">
      </div>
      <div class="col-auto">
        <input type="text" v-model="searchEmail" class="form-control" placeholder="이메일">
      </div>
      <div class="col-auto">
        <button class="btn btn-primary" @click="getUserList">검색</button>
      </div>
    </div>

    <!-- 테이블 -->
    <div class="table-container">
      <div class="table-container">
        <table class="table table-hover align-middle" style="table-layout: fixed; min-width: 1800px;">
          <colgroup>
            <col style="width: 120px;"> <!-- 아이디 -->
            <col style="width: 120px;"> <!-- 이름 -->
            <col style="width: 100px;"> <!-- 비밀번호 -->
            <col style="width: 200px;"> <!-- 이메일 -->
            <col style="width: 130px;"> <!-- 전화번호 -->
            <col style="width: 180px;"> <!-- 주소 -->
            <col style="width: 120px;"> <!-- 상세주소 -->
            <col style="width: 80px;"> <!-- 우편번호 -->
            <col style="width: 80px;"> <!-- 포인트 -->
            <col style="width: 100px;"> <!-- 권한 -->
            <col style="width: 150px;"> <!-- 카드번호 -->
            <col style="width: 80px;"> <!-- 카드유효기간 -->
            <col style="width: 60px;"> <!-- CVC -->
            <col style="width: 160px;"> <!-- Kakao ID -->
            <col style="width: 180px;"> <!-- Naver ID -->
          </colgroup>

          <thead class="table-primary">
            <tr>
              <th>아이디</th>
              <th>이름</th>
              <th>비밀번호</th>
              <th>이메일</th>
              <th>전화번호</th>
              <th>주소</th>
              <th>상세주소</th>
              <th>우편번호</th>
              <th>포인트</th>
              <th>권한</th>
              <th>카드번호</th>
              <th>카드유효기간</th>
              <th>CVC</th>
              <th>Kakao ID</th>
              <th>Naver ID</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="user in filteredUsers" :key="user.userId">
              <td>{{ user.userId || "" }}</td>
              <td>{{ user.userName || "" }}</td>
              <td>{{ user.password || "" }}</td>
              <td>{{ user.email || "" }}</td>
              <td>{{ user.hp || "" }}</td>
              <td>{{ user.address || "" }}</td>
              <td>{{ user.address2 || "" }}</td>
              <td>{{ user.zipCode || "" }}</td>
              <td class="text-danger fw-bold">{{ formatPrice(user.point) }}</td>
              <td>
                <select v-model="user.role" class="form-select form-select-sm">
                  <option value="user">회원</option>
                  <option value="admin">관리자</option>
                </select>
              </td>
              <td>{{ user.cardNum || "" }}</td>
              <td>{{ user.cardExp || "" }}</td>
              <td>{{ user.cardCvc || "" }}</td>
              <td>{{ user.kakaoId || "" }}</td>
              <td>{{ user.naverId || "" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios"
const server = process.env.VUE_APP_SERVER

export default {
  data() {
    return {
      users: [],
      searchName: "",
      searchEmail: ""
    }
  },

  computed: {
    filteredUsers() {
      return this.users.filter(u => {
        const name = u.userName || ""
        const email = u.email || ""

        const matchName = this.searchName ? name.includes(this.searchName) : true
        const matchEmail = this.searchEmail ? email.includes(this.searchEmail) : true

        return matchName && matchEmail
      })
    }
  },

  mounted() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      try {
        // 빈 객체라도 보내면 Spring @RequestBody에서 에러 안남
        const res = await axios.post(`${server}/api/userList.do`, {})
        this.users = res.data || []
      } catch (e) {
        console.error(e)
        alert("사용자 조회 실패")
      }
    },

    formatPrice(price) {
      return Number(price || 0).toLocaleString()
    },

    async saveUsers() {
      try {
        const res = await axios.post(`${server}/api/saveUserList.do`, this.users)
        if (res.data === "success") {
          alert("저장 완료")
        } else {
          alert("저장 실패")
        }
      } catch (e) {
        console.error(e)
        alert("서버 오류")
      }
    }
  }
}
</script>

<style scoped>
.table-container {
  height: 70vh;
  overflow-y: auto;
  border: 1px solid #ddd;
  background: #fff;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;
}

.text-danger {
  color: red;
  font-weight: bold;
}
</style>