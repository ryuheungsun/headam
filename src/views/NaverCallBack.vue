<template>
  <div class="text-center mt-5">
    <h3>네이버 로그인 처리중...</h3>
  </div>
</template>

<script>
import axios from "axios"
import { useUserStore } from "@/stores/userStore"

const server = process.env.VUE_APP_SERVER
const userStore = useUserStore()

export default {
  mounted() {
    if (window.naver) { 
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: "QkwdMc1jkcmIhFw74Pl7",
        callbackUrl: "http://localhost:8080/naver/callback"
      });

      naverLogin.init();

      naverLogin.getLoginStatus(async (status) => {
        if (status) {
          const user = {
            id: naverLogin.user.getId(),
            name: naverLogin.user.getName(),
            email: naverLogin.user.getEmail(),
          };
          //console.log("네이버 사용자 정보:", user);
          
          const response = await axios.post(`/api/shop/naverLogin.do`,
            {
              kakaoId: user.id,
              email: user.email
            },
            {
              withCredentials: true
            }
          )

          if (response.data && response.data.loginUser) {
console.log("네이버 사용자 정보:3");
            userStore.setUser(response.data.loginUser)
            this.$router.push("/productList")
          }
        } else {
          console.log("네이버 로그인 실패");
        }
      });
    }
  }
};
</script>