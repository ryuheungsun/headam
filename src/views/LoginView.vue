<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img :src="logo" class="logo" />

      <h2 class="title">로그인</h2>

      <form @submit.prevent="login">
        <div class="input-group">
          <input
            type="text"
            v-model="userId"
            placeholder="아이디"
            required
          />
        </div>

        <div class="input-group">
          <input
            type="password"
            v-model="password"
            placeholder="비밀번호"
            required
          />
        </div>

        <button type="submit" class="login-btn"> 
          로그인
        </button>
        <!-- 🔥 구분선 -->
        <div class="divider"></div>
        <button type="button" class="kakao-btn" @click="kakaoLogin">
          <img :src="kakao_login" class="kakao-btn"/>
        </button>

        <div id="naverIdLogin" class="naver-login"></div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import logo from "@/assets/logo.png"
import kakao_login from "@/assets/kakao_login.png"
import { useUserStore } from "@/stores/userStore"

const server = process.env.VUE_APP_SERVER

export default {
  name: "LoginView",

  data() {
    return {
      userId: "",
      password: "",
      logo,
      kakao_login
    }
  },

  mounted() {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("a12b139def86863fcd7d3ead4b3a5a44")
    }
     this.initNaverLogin();
  },

  methods: {  
    
    async login() {
      const userStore = useUserStore()  // 🔥 반드시 여기서 호출

      try {
        const res = await axios.post(`/api/shop/login.do`,
          {
            userId: this.userId,
            password: this.password
          },
          {
            withCredentials: true
          }
        )
      //console.log("응답:", res.data)
        if (res.data && res.data.loginUser) {
          // Pinia 상태 저장
          userStore.setUser(res.data.loginUser)

          // 로그인 후 이동
          this.$router.push("/productList")
        } else {
          alert("아이디 또는 비밀번호를 확인하세요.")
        }

      } catch (e) {
        alert("아이디 또는 비밀번호를 확인하세요.")
      }
    },

     // 카카오 로그인
    kakaoLogin() {
      const userStore = useUserStore()

      window.Kakao.Auth.login({
        scope: "account_email,phone_number",
        success: () => {

          window.Kakao.API.request({
            url: "/v2/user/me",
            success: async (res) => {

              const kakaoId = res.id
              const email = res.kakao_account?.email
              //const phone = res.kakao_account?.phone_number

              const response = await axios.post(
                `/api/shop/kakaoLogin.do`,
                {
                  kakaoId: kakaoId,
                  email: email
                },
                {
                  withCredentials: true
                }
              )

              if (response.data && response.data.loginUser) {
                userStore.setUser(response.data.loginUser)
                this.$router.push("/productList")
              }
            }
          })
        }
      })
    },
    //naver Login
    initNaverLogin() {
      // 네이버 SDK가 아직 안 불러와진 경우 대기
      if (!window.naver || !window.naver.LoginWithNaverId) {
        console.warn("네이버 SDK 로딩 대기중...");
        setTimeout(this.initNaverLogin, 300);
        return;
      }

      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "QkwdMc1jkcmIhFw74Pl7", // ← 네이버 클라이언트 ID
        callbackUrl: "http://localhost:8080/naverCallBack", // ← 네이버에 등록한 콜백 URL
        isPopup: false,
        loginButton: {
          color: "green",
          type: 3,
          height: 50
        }
      });

      // 로그인 초기화
      naverLogin.init();
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  background: #f3f0eb;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 400px;
  padding: 50px 40px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 40px rgba(0,0,0,0.1);
  text-align: center;
}

.logo {
  width: 260px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.title {
  color: #b8893c;
  margin-bottom: 30px;
  font-weight: 600;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 30px;
  outline: none;
  font-size: 14px;
  transition: 0.3s;
}

input:focus {
  border-color: #b8893c;
  box-shadow: 0 0 5px rgba(184,137,60,0.3);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #b8893c;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 30px;
  cursor: pointer;
  transition: 0.3s;
}

.login-btn:hover {
  background: #a4772f;
}
.kakao-btn {
  width: 85%;
  background: transparent;   /* 배경 제거 */
  border: none;              /* 🔥 라인 제거 */
  padding: 0;                /* 여백 제거 */
  cursor: pointer;
}
.divider {
  display: flex;
  align-items: center;
  margin: 25px 0;   /* 위아래 간격 */
  color: #aaa;
  font-size: 13px;
}

/* 좌우 선 */
.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e0e0e0;
}

/* 가운데 텍스트 */
.divider span {
  margin: 0 15px;
  white-space: nowrap;
}

.naver-login {
  margin-top: 20px;
}
</style>