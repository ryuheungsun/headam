import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import CKEditor from '@ckeditor/ckeditor5-vue'

const app = createApp(App)

app.use(router)
app.use(createPinia())
app.use(CKEditor)

// ✅ 카카오 SDK 초기화 (한 번만)
function initKakao() {
  if (window.Kakao && !window.Kakao.isInitialized()) {
    window.Kakao.init(process.env.VUE_APP_KAKAO_JS_KEY)
    console.log('✅ Kakao initialized')
  }
}

// ✅ SDK 로딩 대기
function waitKakao() {
  if (window.Kakao) {
    initKakao()
  } else {
    setTimeout(waitKakao, 100)
  }
}

waitKakao()

app.mount('#app')