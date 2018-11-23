<template>
  <div class="layout" @wheel="handleScroll" ref="container">
    <v-header :headerFlag="true"></v-header>
    <div class="container clearfix">
      <div class="menu_wapper fl" ref="wapper" :style="{height: sideBarMaxHeight + 'px'}" :class="{top: top}">
        <side-bar :routes='routes'></side-bar>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import vHeader from '@/components/vHeader'
import sideBar from '@/components/sideBar'
import {asyncRoutes} from '@/router'
export default {
  components: {vHeader, sideBar},
  data () {
    return {
      sideBarMaxHeight: '',
      container_height: '',
      top: false,
    }
  },
  computed: {
    routes () {
      return this.$store.state.asyncRouters
    }
  },
  mounted() {
    // console.log('layout', this.routes)
    const container_height = document.body.clientHeight
    const sidebar_height = document.body.clientHeight - 20 - 70
    this.container_height = container_height
    this.sideBarMaxHeight = sidebar_height
  },
  methods: {
    handleScroll (e) {
      const $container = this.$refs.container
      const $wapper = this.$refs.wapper

      const scrollTop = document.documentElement.scrollTop
      // console.log($wapper.offsetTop - scrollTop)
      if ($wapper.offsetTop - scrollTop <= 0) {
        this.top = true
        this.sideBarMaxHeight = this.container_height
      } else {
        this.top = false
        this.sideBarMaxHeight = this.sideBarMaxHeight
      }
      if (scrollTop < 90) {
        this.top = false
        this.sideBarMaxHeight = this.sideBarMaxHeight
      }
    }
  }

}
</script>

<style lang="scss" scoped>
.menu_wapper{
  width: 240px;
  background-color: #fff;
  overflow-y: scroll;
  &.top{
    position: fixed;
    top: 0
  }
}
.container{
  width: 1360px;
  margin: 20px auto 0;
}
::-webkit-scrollbar-track-piece {
  background: #d3dce6;
}
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #99a9bf;
  border-radius: 20px;
}
</style>


