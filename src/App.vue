<template>
  <div id="app">

    <!-- Header -->
    <header class="header">

      <!-- 햄버거 -->
      <div class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- 로고 -->
      <div class="logo">
        <img src="../logo.jpg" />
      </div>

      <!-- 메뉴 -->
      <nav :class="['menu', { open: menuOpen }]">

        <router-link to="/" @click="closeAll">홈</router-link>

        <!-- BRAND -->
        <div class="dropdown">

          <span class="dropbtn" @click.stop="toggleDropdown('brand')">
            브랜드 ▾
          </span>

          <div :class="['dropdown-content', { show: dropdownOpen.brand }]">

            <router-link to="/brand" @click="closeAll">
              브랜드 소개
            </router-link>

            <router-link to="/location" @click="closeAll">
              오시는 길
            </router-link>

          </div>

        </div>

        <!-- PRODUCT -->
        <div class="dropdown">

          <span class="dropbtn" @click.stop="toggleDropdown('product')">
            제품 보기 ▾
          </span>

          <div :class="['dropdown-content', { show: dropdownOpen.product }]">

            <router-link :to="{ path: '/productList' }" @click="closeAll">
              전체 상품
            </router-link>

            <router-link v-for="item in categoryList" :key="item.categoryId"
              :to="{ path: '/productList', query: { category: item.categoryId, categoryNm: item.categoryName } }"
              @click="closeAll">
              {{ item.categoryName }}

            </router-link>

          </div>

        </div>

        <!-- MY PAGE -->
        <div class="dropdown">

          <span class="dropbtn" @click.stop="toggleDropdown('mypage')">
            내 페이지 ▾
          </span>

          <div :class="['dropdown-content', { show: dropdownOpen.mypage }]">

            <router-link to="/myPage" @click="closeAll">
              마이페이지
            </router-link>

            <router-link to="/orderList" @click="closeAll">
              주문내역
            </router-link>

            <router-link to="/cartList" @click="closeAll">
              장바구니
            </router-link>
          </div>
        </div>

        <!-- 관리자 -->
        <div class="dropdown" v-if="userStore.role === 'admin'">

          <span class="dropbtn" @click.stop="toggleDropdown('admin')">
            관리자 ▾
          </span>

          <div :class="['dropdown-content', { show: dropdownOpen.admin }]">

            <router-link :to="{ path: '/admin/orderList' }" @click="closeAll">
              주문정보
            </router-link>
            <router-link :to="{ path: '/admin/userList' }" @click="closeAll">
              회원관리
            </router-link>

          </div>

        </div>
        <!-- ✅ 카카오 친구추가 버튼 -->
        <div class="kakao-btn" @click="addKakaoChannel">
          카카오 친구추가
        </div>
      </nav>

      <!-- 로그인 -->
      <div class="auth">

        <template v-if="userStore.isLogin">

          <span v-if="!isMobile" class="welcome">
            {{ userStore.userName }}님 환영합니다
          </span>

          <button class="login-btn logout-btn" @click="logout">
            로그아웃
          </button>

        </template>

        <template v-else>
          <button class="btn btn-success" @click="registerUser">
            회원가입
          </button>
          <button class="login-btn" @click="goLogin">
            로그인
          </button>

        </template>

      </div>

    </header>

    <!-- Main -->
    <main class="content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      © 2026 해담. All Rights Reserved.
    </footer>

  </div>
</template>

<script>
import axios from "axios"
import { ref, reactive, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/userStore"

const server = process.env.VUE_APP_SERVER

export default {
  name: "App",

  setup() {

    const router = useRouter()
    const userStore = useUserStore()

    const menuOpen = ref(false)

    const dropdownOpen = reactive({
      brand: false,
      product: false,
      mypage: false,
      admin: false
    })

    const isMobile = ref(false)
    const categoryList = ref([])

    const handleResize = () => {
      isMobile.value = window.innerWidth <= 768
    }

    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    const toggleDropdown = (menu) => {

      Object.keys(dropdownOpen).forEach(k => {
        dropdownOpen[k] = k === menu ? !dropdownOpen[k] : false
      })

    }

    const closeAll = () => {

      menuOpen.value = false

      Object.keys(dropdownOpen).forEach(k => {
        dropdownOpen[k] = false
      })

    }

    const handleOutsideClick = (e) => {

      const menu = document.querySelector(".menu")
      const hamburger = document.querySelector(".hamburger")

      if (!menu || !hamburger) return

      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        closeAll()
      }

    }

    const getCategorySet = async () => {

      try {

        const res = await axios.get(`${server}/api/shop/categoryList.do`)
        categoryList.value = res.data || []

      } catch (err) {

        console.error("카테고리 조회 실패", err)

      }

    }

    const checkSession = async () => {

      const savedUser = localStorage.getItem("loginUser")

      if (savedUser) {
        userStore.setUser(JSON.parse(savedUser))
        return
      }

      try {

        const res = await axios.get(
          `${server}/api/shop/session.do`,
          { withCredentials: true }
        )

        if (res.data?.loginUser) {

          userStore.setUser(res.data.loginUser)

          localStorage.setItem(
            "loginUser",
            JSON.stringify(res.data.loginUser)
          )

        } else {

          userStore.clearUser()
          localStorage.removeItem("loginUser")

        }

      } catch (err) {

        userStore.clearUser()
        localStorage.removeItem("loginUser")

      }

    }

    const logout = async () => {

      try {

        await axios.post(
          `${server}/api/shop/logout.do`,
          {},
          { withCredentials: true }
        )

      } catch (err) {

        console.error("logout error")

      }

      userStore.clearUser()
      localStorage.removeItem("loginUser")

      router.push("/")

    }

    const goLogin = () => {
      router.push("/login")
    }

    const registerUser = () => {
      router.push("/joinUs")
    }

    const addKakaoChannel = () => {
      window.open("https://pf.kakao.com/_DxnxdzX", "_blank")
    }

    onMounted(() => {

      handleResize()

      checkSession()
      getCategorySet()

      window.addEventListener("resize", handleResize)

      document.addEventListener("click", handleOutsideClick)
      document.addEventListener("touchstart", handleOutsideClick)

    })

    onBeforeUnmount(() => {

      window.removeEventListener("resize", handleResize)

      document.removeEventListener("click", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)

    })

    return {

      userStore,
      menuOpen,
      dropdownOpen,

      toggleMenu,
      toggleDropdown,
      closeAll,

      logout,
      goLogin,
      registerUser,

      categoryList,
      isMobile,
      addKakaoChannel
    }

  }

}
</script>

<style>
#app {
  font-family: 'Noto Serif KR', serif;
  background: #f8f5ef;
}

/* header */

.header {
  display: flex;
  align-items: center;
  height: 90px;
  padding: 0 20px;
  background: #000;
  position: relative;
}

.logo img {
  height: 80px;
}

.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 18px;
  cursor: pointer;
  margin-right: 10vw;
}

.hamburger span {
  height: 3px;
  background: white;
}

/* menu */

.menu {
  display: flex;
  align-items: center;
  gap: 25px;
  margin-left: 50px;
}

.menu a,
.dropbtn {
  color: white;
  font-size: 18px;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 30px;
  left: 0;
  background: #111;
  min-width: 160px;
  border-radius: 4px;
}

.dropdown-content.show {
  display: flex;
  flex-direction: column;
}

.dropdown-content a {
  padding: 2px 15px;
}

.dropdown-content a:hover {
  background: #222;
}

/* auth */

.auth {
  margin-left: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  color: white;
}

.login-btn {
  background: #0d6efd;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
}

.logout-btn {
  padding: 4px 12px;
  font-size: 12px;
}

/* main */

.content {
  padding: 20px 20px;
}

/* footer */

.footer {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
}

.kakao-btn {
  color: #000;
  background: #FEE500;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: bold;
  cursor: pointer;
}

/* mobile */

@media(max-width:768px) {

  .hamburger {
    display: flex;
  }

  .logo img {
    height: 50px;
  }

  .menu {
    display: none;
    flex-direction: column;
    position: fixed;
    /* absolute → fixed */
    top: 90px;
    left: 20px;
    background: #000;
    width: 200px;
    padding: 20px;
    z-index: 9999;
    align-items: flex-start;
    margin-left: 0px;
  }

  .dropdown {
    width: 100%;
  }

  .menu a,
  .dropbtn {
    width: 100%;
    text-align: left;
  }

  .menu.open {
    display: flex;
  }

  .dropdown-content {
    position: static;
    background: #111;
  }

  .login-btn {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

  .kakao-btn {
    display: block;
    width: 100%;
    text-align: center;
    margin-top: 10px;

    color: #000;
    background: #FEE500;
    padding: 10px;
    border-radius: 20px;
    font-weight: bold;
  }

  .auth .btn-success {
    padding: 4px 10px;
    font-size: 12px;
    border-radius: 12px;
  }

}
</style>