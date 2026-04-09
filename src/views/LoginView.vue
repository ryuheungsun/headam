<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img :src="logo" class="logo" />

      <h2 class="title">로그인</h2>

      <form @submit.prevent="login">
        <div class="input-group">
          <input type="text" v-model="userId" placeholder="아이디" required />
        </div>

        <div class="input-group">
          <input type="password" v-model="password" placeholder="비밀번호" required />
        </div>

        <button type="submit" class="login-btn">
          로그인
        </button>

        <div class="divider"></div>

        <!--  SNS 로그인 -->
        <div class="sns-login">

          <!-- 카카오 -->
          <button type="button" class="sns-btn kakao" @click="kakaoLogin">
            <span class="sns-icon">K</span>
            카카오 로그인
          </button>

          <!-- 네이버 -->
          <button type="button" class="sns-btn naver" @click="naverLogin">
            <span class="sns-icon">N</span>
            네이버 로그인
          </button>

        </div>

      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios"
import logo from "@/assets/logo.png"
import { useUserStore } from "@/stores/userStore"
import Swal from "sweetalert2";

const server = process.env.VUE_APP_SERVER

export default {
  name: "LoginView",

  data() {
    return {
      userId: "",
      password: "",
      logo
    }
  },

  mounted() {
    //  카카오 초기화
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("a12b139def86863fcd7d3ead4b3a5a44")
    }

    //  네이버 결과 받기
    window.addEventListener("message", this.handleNaverLogin);
  },

  beforeUnmount() {
    window.removeEventListener("message", this.handleNaverLogin);
  },

  methods: {

    // 일반 로그인
    async login() {
      const userStore = useUserStore()

      try {
        const res = await axios.post(`${server}/api/login.do`,
          {
            userId: this.userId,
            password: this.password
          },
          {
            withCredentials: true
          }
        )

        if (res.data && res.data.loginUser) {
          userStore.setUser(res.data.loginUser)
          this.$router.push("/productList")
        } else {
          Swal.fire({
            //title: "상품선택",
            text: "아이디 또는 비밀번호를 확인하세요.",
            icon: "info",
            confirmButtonText: "확인",
            width: 300,       // 가로 크기 조절
            heightAuto: false // 높이 자동 확대 방지
          });
        }

      } catch (e) {
        Swal.fire({
          //title: "상품선택",
          text: "아이디 또는 비밀번호를 확인하세요",
          icon: "info",
          confirmButtonText: "확인",
          width: 300,       // 가로 크기 조절
          heightAuto: false // 높이 자동 확대 방지
        });
      }
    },

    //  카카오 로그인
    kakaoLogin() {
      const userStore = useUserStore()

      window.Kakao.Auth.login({
        scope: "account_email",
        success: () => {

          window.Kakao.API.request({
            url: "/v2/user/me",
            success: async (res) => {

              const kakaoId = res.id
              const email = res.kakao_account?.email

              const response = await axios.post(
                `${server}/api/shop/kakaoLogin.do`,
                {
                  kakaoId,
                  email
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

    //  네이버 로그인 (팝업)
    naverLogin() {
      const clientId = "uw_UOITT4pvej9YL5L5M";
      const redirectUri = "http://localhost:8080/naverCallBack";
      const state = "LOGIN_" + Math.random().toString(36).substring(2);

      const url = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

      window.open(url, "naverLogin", "width=500,height=600");
    },

    //  네이버 결과 처리
    handleNaverLogin(event) {

      if (event.data.type === "NAVER" && event.data.mode === "LOGIN") {

        console.log("네이버 로그인 결과:", event.data);

        const userStore = useUserStore();

        if (event.data.loginUser) {
          userStore.setUser(event.data.loginUser);
          this.$router.push("/productList");
        } else {
          // 👉 회원가입으로 이동
          sessionStorage.setItem("naverId", event.data.naverId);
          this.$router.push("/joinUs");
        }
      }
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
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.logo {
  width: 260px;
  display: block;
  margin: 0 auto;
}

.title {
  color: #b8893c;
  margin-bottom: 30px;
}

.input-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  border-radius: 30px;
  border: 1px solid #ddd;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #b8893c;
  border: none;
  color: white;
  border-radius: 30px;
  cursor: pointer;
}

.divider {
  margin: 25px 0;
  height: 1px;
  background: #eee;
}

/* SNS 버튼 */
.sns-login {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sns-btn {
  height: 48px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sns-btn.kakao {
  background: #FEE500;
  color: #3C1E1E;
}

.sns-btn.naver {
  background: #03C75A;
  color: white;
}

.sns-icon {
  font-weight: bold;
}
</style>