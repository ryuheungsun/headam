import { createRouter, createWebHistory } from 'vue-router'
import ProductList from '@/views/ProductList.vue'
import ProductDetail from '@/views/ProductDetail.vue'
import ProductEdit from '@/views/ProductEdit.vue' 
import Intro from '@/views/IntroView.vue' 
import Login from '@/views/LoginView.vue'
import NaverCallBack from '@/views/NaverCallBack.vue'

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
    path: '/joinUs',
    name: 'joinUs',
    component: () => import(/* webpackChunkName: "orderComplete" */ '../views/joinUs.vue')
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/naverCallBack',
    name: 'naverCallBack',
    component: NaverCallBack 
  },
  {
    path: '/brand',
    name: 'brand',
    component: () => import(/* webpackChunkName: "about" */ '../views/BrandView.vue')
  },
  {
    path: '/location',
    name: 'location',
    component: () => import(/* webpackChunkName: "about" */ '../views/LocationView.vue')
  }, 
  {
    path: '/cartList',
    name: 'cartList',
    component: () => import(/* webpackChunkName: "about" */ '../views/CartListView.vue')
  },
  {
    path: '/orderList',
    name: 'orderList',
    component: () => import(/* webpackChunkName: "about" */ '../views/OrderListView.vue')
  },
  {
    path: '/order',
    name: 'order',
    component: () => import(/* webpackChunkName: "order" */ '../views/OrderView.vue')
  },
  {
    path: '/orderComplete',
    name: 'orderComplete',
    component: () => import(/* webpackChunkName: "orderComplete" */ '../views/OrderComplete.vue')
  },
  {
    path: '/myPage',
    name: 'myPage',
    component: () => import(/* webpackChunkName: "orderComplete" */ '../views/MyPage.vue')
  },
  {
    path: '/admin/orderList',
    name: '/adminOrderList',
    component: () => import(/* webpackChunkName: "orderComplete" */ '../views/admin/orderListView.vue')
  },
  {
    path: '/admin/userList', 
    name: '/adminUserList',
    component: () => import(/* webpackChunkName: "orderComplete" */ '../views/admin/userListView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
