
<template>
  <div class="home">
    <img :src="logo" alt="Vue logo">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'
import logo from '@/assets/logo.png'

export default {
  name: 'HomeView',
  components: {
    HelloWorld
  },
  data() {
    return {
      logo
    }
  }
}
</script>
