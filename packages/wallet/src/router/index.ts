import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import MainPage from '@/pages/MainPage.vue'
import EthereumPage from '@/pages/EthereumPage.vue'
import SolanaPage from '@/pages/SolanaPage.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage,
  },
  {
    path: '/ethereum/:coin/:address/:network',
    name: 'EthereumPage',
    component: EthereumPage,
    props: true,
  },
  {
    path: '/solana/:coin/:address/:network',
    name: 'SolanaPage',
    component: SolanaPage,
    props: true,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
