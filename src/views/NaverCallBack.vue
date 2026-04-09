<template>
  <div class="text-center mt-5">
    <h3>네이버 로그인 처리중...</h3>
  </div>
</template>

<script>
import axios from "axios"
const server = process.env.VUE_APP_SERVER

export default {
  mounted() {

    //  1. URL 파라미터 추출
    const query = new URLSearchParams(window.location.search);
    const code = query.get("code");
    const state = query.get("state");

    console.log("code:", code);
    console.log("state:", state);

    //  2. code 없으면 실패
    if (!code) {
      alert("네이버 로그인 실패 (code 없음)");
      window.close();
      return;
    }

    //  3. 서버 호출
    axios.post(`${server}/api/shop/naverLogin.do`, {
      code: code
    }, { withCredentials: true })
      .then(res => {

        console.log("응답:", res.data);

        const loginUser = res.data.loginUser;
        const naverId = res.data.naverId;

        //  4. 로그인 / 회원가입 구분
        let mode = "LOGIN";

        if (state && state.startsWith("JOIN")) {
          mode = "JOIN";
        }

        console.log("mode:", mode);

        //  5. 부모창으로 전달
        if (window.opener) {
          window.opener.postMessage({
            type: "NAVER",
            mode: mode,
            loginUser: loginUser,
            naverId: naverId
          }, "*");
        }

        //  6. 팝업 닫기
        window.close();

      })
      .catch(err => {
        console.error("네이버 로그인 에러:", err);
        alert("네이버 로그인 실패");
        window.close();
      });
  }
}
</script>