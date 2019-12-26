import Vue from 'vue'
import VueRouter from  'vue-router'

// 进行相关的懒加载之后在下面配置对应的映射关系
const Home = () => import('../views/home/Home')
const Category = () => import('../views/category/Category')
const Cart = () => import('../views/cart/Cart')
const Profile = () => import('../views/profile/Profile')
const Detail = () => import('../views/detail/Detail.vue')
// 1.安装插件
Vue.use(VueRouter)


// 2.创建路由

// 配置对应映射关系
const routes = [
    {
        path: '',
        redirect: '/home'
      },
      {
        path: '/home',
        component: Home
      },
      {
        path: '/category',
        component: Category
      },
      {
        path: '/cart',
        component: Cart
      },
      {
        path: '/profile',
        component: Profile
      },
      {
        path: '/detail/:iid',
        component: Detail
      }
]
const router = new VueRouter({
    // routes可以抽出去写
    routes,
    mode: 'history'
})

export default router