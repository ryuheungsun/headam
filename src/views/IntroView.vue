<template>
  <div class="wrapper">
    <div class="scene" :class="{ open: isOpen }">
      
      <!-- 로고 -->
      <div
        class="inner"
        :style="{
          backgroundImage: `url(${logoImg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center'
        }"
      ></div>

      <!-- 문 -->
      <div class="door left" :style="{ backgroundImage: `url(${doorTexture})` }"></div>
      <div class="door right" :style="{ backgroundImage: `url(${doorTexture})` }"></div>

      <!-- 환영 텍스트 -->
      <div v-if="isOpen" class="welcome-text">
        환영합니다
      </div>

    </div>
  </div>
</template>

<script>
import doorTexture from '@/assets/door_texture.png'
import logoImg from '@/assets/logo.jpg'

export default {
  name: "GateOpening",
  data() {
    return {
      isOpen: false,
      doorTexture,
      logoImg
    };
  },
  mounted() {
    // 문 열기
    setTimeout(() => {
      this.isOpen = true;
    }, 300);

    // 페이지 이동
    setTimeout(() => {
      this.$router.push("/productList");
    }, 3000);
  }
};
</script>

<style scoped>
.wrapper {
  margin: 0;
  background: #f3f0eb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100dvh;
  flex-direction: column;
  overflow: hidden;
  padding: 20px;
}

.scene {
  position: relative;
  width: min(90vw, 800px);
  aspect-ratio: 16 / 10;
  perspective: 1200px;
}

.inner {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #f3f0eb;
  z-index: 1;
}

.door {
  position: absolute;
  width: 50%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  top: 0;
  z-index: 2;
  transition: transform 2s ease-in-out;
  transform-style: preserve-3d;
}

.left {
  left: 0;
  transform-origin: left center;
}

.right {
  right: 0;
  transform-origin: right center;
}

.open .left {
  transform: rotateY(-110deg);
}

.open .right {
  transform: rotateY(110deg);
}

.welcome-text {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  font-size: clamp(28px, 8vw, 80px);
  color: #aaa;
  font-family: 'Nanum Brush Script', cursive;
  font-weight: 700;
  z-index: 1;
}
</style>