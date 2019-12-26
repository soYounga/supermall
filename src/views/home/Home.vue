<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
  <tab-control :titles= "['流行','新款','精选']" 
            @tabClick="tabClick" ref="tabControl1"
            :class="{fixed: isTabFixed}"
            class="tab-control" v-show="isTabFixed"/>
    <scroll class="content" 
            ref="scroll" 
            :probe-type="3" 
            @scroll="contentScroll"
            :pull-up-load="true"
            @pullingUp="loadMore">
    <home-swiper :banners= "banners" @swiperImageLoad="swiperImageLoad" />
    <recommend-view :recommends = "recommends" />
    <feature-view />
<tab-control :titles= "['流行','新款','精选']" 
            @tabClick="tabClick" ref="tabControl2"
            :class="{fixed: isTabFixed}"/>
  <goods-list :goods = "showGoods" />
  </scroll>

  <back-top @click.native="backClick" v-show="isShowBackTop"/>
  </div>
</template>

<script>
// 子组件
import HomeSwiper from './childComps/HomeSwiper'
import RecommendView from './childComps/RecommendView'
import FeatureView from './childComps/FeatureView'
// 公共组件
import NavBar from 'components/common/navbar/NavBar'
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'
// 导入方法
import {getHomeMultidata, getHomeGoods} from 'network/home.js'
import {debounce} from 'common/utils.js'


  export default {
    name: "Home",
    components: {
      // 子组件
      HomeSwiper,
      RecommendView,
      FeatureView,
     // 公共组件
      NavBar,
      TabControl,
      Scroll,
      GoodsList,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommends: [],
        goods: {
          'pop': {page: 0,list: []},
          'new': {page: 0,list: []},
          'sell': {page: 0,list: []},
        },
        currentType: 'pop',
        isShowBackTop: false,
        tabOffsetTop: 0,
        isTabFixed: false,
        saveY: 0
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    },
    destroyed () {
      console.log('home destoryed');
    },
    activated () {
      this.$refs.scroll.scrollTo(0,this.saveY,0)
      this.$refs.scroll.refresh()
    },
    deactivated () {
      this.saveY = this.$refs.scroll.getScrollY()
    },
    created() {
      // 请求多个数据
      this.getHomeMultidata()

      // 请求商品数据
      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')

    },
    mounted () {
      // 1.图片加载完成的事件监听
      const refresh = debounce(this.$refs.scroll.refresh, 50)
       // 监听item中图片加载完成
      this.$bus.$on('itemImageLoad',() => {
        // this.$refs.scroll.refresh()
        refresh()
      })
      
    },
    methods: {
      /*
      事件监听相关的方法
      */
     tabClick(index) {
       switch (index) {
         case 0:
           this.currentType = 'pop'
           break
        case 1:
          this.currentType = 'new'
          break
        case 2:
          this.currentType = 'sell'
          break
       }
       this.$refs.tabControl1.currentIndex = index;
       this.$refs.tabControl2.currentIndex = index;
     },
     backClick() {
       this.$refs.scroll.scrollTo(0,0)
     },
     contentScroll(position) {
      //  1.判断BackTop是否显示
      //  console.log(position);
       this.isShowBackTop = (-position.y) >1000

      //  2.决定tabControl是否吸顶（position：fixed）
      this.isTabFixed = (-position.y) > this.tabOffsetTop
     },
     loadMore() {
       this.getHomeGoods(this.currentType)
     },
     swiperImageLoad() {
       // 2.获取tabControl的offsetTOP
      // 所有的组件都有一个属性$el：用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
  // console.log(this.$refs.tabControl.$el.offsetTop);
  
     }, 
      /*
      网络请求相关的方法
      */
      getHomeMultidata() {
        getHomeMultidata().then(res => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      }) 
      },
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          // 将列表的数据push到空的list列表中
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          // 完成上拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      }
    }
  }
</script>

<style scoped>
#home {
  position: relative;
  padding-top: 44px;
  height: 100vh;
}
  .home-nav {
    background-color: var(--color-tint);
    color: #fff;
    /* 在使用浏览器原生滚动时，为了让导航不跟随一起滚动*/
     position: fixed;
    left: 0;
    right: 0;
    top: 0;  
    z-index: 9; 
  }
  .content {
    /* height: 300px; */
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;

    overflow: hidden;
  }
  /* .content {
    height: calc(100%-93px);
    overflow: hidden;
    margin-top: 44px;
  } */
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .fixed {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
  }
</style>
