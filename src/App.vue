<template>
  <div id="app">
    <!-- Header -->
    <header class="header">
      <!-- 햄버거 버튼 (왼쪽 끝, 모바일만) -->
      <div class="hamburger" @click="toggleMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>

      <!-- 로고 -->
      <div class="logo">
        <img src="../logo.jpg" height="80" />
      </div>

      <!-- 메뉴 -->
      <nav :class="['menu', { open: menuOpen }]" @mouseleave="closeAll">
        <router-link to="/">HOME</router-link>

        <!-- BRAND -->
        <div class="dropdown" @click.stop="toggleDropdown('brand')">
          <span class="dropbtn">BRAND ▾</span>
          <div :class="['dropdown-content', { show: dropdownOpen.brand }]">
            <router-link to="/about">브랜드 소개</router-link>
            <router-link to="/location">오시는 길</router-link>
          </div>
        </div>

        <!-- PRODUCT -->
        <div class="dropdown" @click.stop="toggleDropdown('product')">
          <span class="dropbtn">PRODUCT ▾</span>
          <div :class="['dropdown-content', { show: dropdownOpen.product }]">
            <router-link to="/giftset">선물세트</router-link>
            <router-link to="/season">계절상품</router-link>
            <router-link to="/best">베스트상품</router-link>
          </div>
        </div>
      </nav>

      <!-- 로그인/로그아웃 영역 (오른쪽 끝) -->
      <div class="auth">
        <template v-if="userStore.isLogin">
          <span class="welcome">{{ userStore.userName }}님 환영합니다</span>
          <button class="login-btn logout-btn" @click="logout">로그아웃</button>
        </template>
        <template v-else>
          <button class="login-btn" @click="goLogin">로그인</button>
        </template>
      </div>
    </header>

    <!-- Main content -->
    <main class="content">
      <router-view />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>© 2026 해담. All Rights Reserved.</p>
    </footer>
  </div>
</template>

<script>
import axios from "axios"
import { ref, reactive, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useUserStore } from "@/stores/userStore"

export default {
  name: "App",
  setup() {
    const router = useRouter()
    const userStore = useUserStore()

    const menuOpen = ref(false)

    const dropdownOpen = reactive({
      brand: false,
      product: false
    })

    /* ⭐ 전체 메뉴 닫기 (핵심 함수) */
    const closeAll = () => {
      menuOpen.value = false
      Object.keys(dropdownOpen).forEach(k => dropdownOpen[k] = false)
    }

    /* 햄버거 토글 */
    const toggleMenu = () => {
      menuOpen.value = !menuOpen.value
    }

    /* 드롭다운 토글 */
    const toggleDropdown = (menu) => {
      dropdownOpen[menu] = !dropdownOpen[menu]
      Object.keys(dropdownOpen).forEach(key => {
        if (key !== menu) dropdownOpen[key] = false
      })
    }

    /* ⭐ 메뉴 클릭 시 전체 닫기 */
    const handleMenuClick = () => {
      closeAll()
    }

    /* ⭐ 메뉴 영역 밖 클릭 / 터치 */
    const handleOutsideClick = (e) => {
      const menu = document.querySelector(".menu")
      const hamburger = document.querySelector(".hamburger")

      if (!menu || !hamburger) return

      if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        closeAll()
      }
    }

    /* ⭐ 메뉴 영역 마우스 이탈 */
    const handleMouseLeave = () => {
      closeAll()
    }

    const checkSession = async () => {
      try {
        const res = await axios.get(`/api/shop/session.do`, { withCredentials: true })
        if (res.data.loginUser) userStore.setUser(res.data.loginUser)
        else userStore.clearUser()
      } catch {
        userStore.clearUser()
      }
    }

    const logout = async () => {
      await axios.post(`/api/shop/logout.do`, {}, { withCredentials: true })
      userStore.clearUser()
      router.push("/")
    }
    

    const goLogin = () => router.push("/login")

    onMounted(() => {
      checkSession()

      document.addEventListener("click", handleOutsideClick)
      document.addEventListener("touchstart", handleOutsideClick)

      const menu = document.querySelector(".menu")
      if (menu) {
        menu.addEventListener("mouseleave", handleMouseLeave)

        /* ⭐ 메뉴 안의 모든 링크 클릭 시 닫기 */
        menu.querySelectorAll("a").forEach(el => {
          el.addEventListener("click", handleMenuClick)
        })
      }
    })

    onBeforeUnmount(() => {
      document.removeEventListener("click", handleOutsideClick)
      document.removeEventListener("touchstart", handleOutsideClick)

      const menu = document.querySelector(".menu")
      if (menu) {
        menu.removeEventListener("mouseleave", handleMouseLeave)
      }
    })

    
    return {
      userStore,
      menuOpen,
      toggleMenu,
      dropdownOpen,
      toggleDropdown,
      logout,
      goLogin
    }
  }
}
</script>

<style> 
/* 전체 스타일 */
#app {
  font-family: 'Noto Serif KR', serif;
  background-color: #f8f5ef;
  margin: 0;
  padding: 0;
}

.header {
  display: flex;
  align-items: center;
  height: 90px;
  padding: 0 20px;
  background: #000;
  border-bottom: 1px solid #222;
  position: relative;
}

/* 햄버거 (왼쪽 끝, 모바일만) */
.hamburger {
  display: none; /* 기본은 숨김 */
  flex-direction: column;
  justify-content: space-between;
  width: 25px;
  height: 18px;
  cursor: pointer;
  margin-right: 10vw; /* 로고와 10% 화면 폭 공백 */
}

.hamburger span {
  display: block;
  height: 3px;
  background-color: white;
  border-radius: 2px;
}

/* 로고 */
.logo img {
  height: 80px;
}

/* 메뉴 */
.menu {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-left: 50px; /* 넓은 화면에서 로고와 메뉴 사이 50px */
}

.menu a,
.dropbtn {
  margin: 0;
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
}

/* 드롭다운 */
.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #111;
  min-width: 150px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.4);
  z-index: 999;
  flex-direction: column;
}

.dropdown-content.show {
  display: flex;
}

.dropdown-content a {
  padding-left: 20px; 
  color: #fff;
  text-decoration: none;
}

.dropdown-content a:hover {
  background-color: #222;
}

/* 로그인/로그아웃 */
.auth {
  margin-left: auto;
  display: flex;
  gap: 10px;
  align-items: center;
  color: white;
}

.login-btn {
  background-color: #0d6efd;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

.login-btn:hover {
  background-color: #0b5ed7;
}

.logout-btn {
  padding: 4px 12px;
  font-size: 12px;
  border-radius: 15px;
}

/* 콘텐츠/푸터 */
.content {
  padding: 80px 20px;
  min-height: 500px;
}

.footer {
  height: 50px; /* 높이 50px */
  display: flex;
  align-items: center;
  justify-content: center;
  background: #ffffff;
  border-top: 1px solid #e5ded6;
  font-size: 13px;
  color: #777;
}

/* 모바일 반응형 */
@media (max-width: 768px) {
  .hamburger {
    display: flex; /* 모바일에서만 보임 */
  }

  .menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 90px;
    left: 0;
    background-color: #000;
    width: 200px;
    z-index: 999;
    gap: 0;
    margin-left: 0; /* 모바일에서는 공백 제거 */
    align-items: flex-start; 
  }

  .menu.open {
    display: flex;
  }

  .menu a,
  .dropbtn {
  margin: 5px 0 5px 15px;
  }

  .dropdown-content {
    position: relative;
    box-shadow: none;
  }
}
</style>