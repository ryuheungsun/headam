import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '@/views/ProductList.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProductEdit from '@/views/ProductEdit.vue' 
import Intro from '@/views/IntroView.vue' 
import Login from '@/views/LoginView.vue'


const routes = [
  {
    path: '/',
    name: 'home',
    component: Intro
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/productList',
    name: 'productList',
    component: ProductList
  },
  {
    path: '/product/:id',
    name: 'productDetail',
    component: ProductDetail,
    props: true
  },
  {
    path: '/productEdit/:id',
    name: 'productEdit',
    component: ProductEdit,
    props: true
  },
  {
    path: '/intro',
    name: 'intro',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/IntroView.vue')
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/naverCallBack',
    name: 'naverCallBack',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/NaverCallBack.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
