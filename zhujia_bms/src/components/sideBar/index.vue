<template>
  <el-menu
    :default-active="$route.path"
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    
    text-color="#4a4a4a"
    active-text-color="#fff"
    >
    <template v-for="item in routes">
      <router-link v-if="item.children.length==1" :to="item.path + '/' + item.children[0].path" :key="item.name">
        <el-menu-item :index="item.path + '/' + item.children[0].path">
          <i :class="item.meta.icon"></i>
          <span slot="title">{{item.meta.name}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.meta.name" :key="item.meta.name">
        <template slot="title">
          <i :class="item.meta.icon"></i>
          <span>{{item.meta.name}}</span>
        </template>
        <template v-for="child in item.children">
          <router-link :to="item.path + '/' + child.path" :key="child.meta.name">
            <el-menu-item :index="item.path + '/' + child.path">{{child.meta.name}}</el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>

<script>
import {routes} from '@/router'
export default {
  props: {
    routes: {
      type: Array
    }
  },
  computed: {
  },
  created() {
    
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    }
  }
}
</script>

<style lang="scss" scoped>

.el-menu{
  border-right: none
}
.el-menu-item *{
  font-size: 18px;
  color: #4a4a4a
}
.el-submenu__title *{
  font-size: 18px;
  color: #4a4a4a
}
.el-submenu .el-menu-item{
  font-size: 16px;
  color: #4a4a4a
}
a{
  text-decoration: none;
  display: block;
}
.router-link-active{
  background-color: #2683E2;
  display: block;
  color: #fff !important;
  .el-menu-item{
    color: #fff;
    &:hover{
      background-color: #2683E2;
    }
  }
}
.el-menu-item{
  &:hover{
    color: #fff;
    background-color: #2683E2;
  }
}

.iconfont{
  font-size: 20px;
}
</style>
<style lang="scss">
.el-submenu__title,.el-menu-item{
  &:hover{
    color: #fff !important;
    background-color: #2683E2 !important;
    *{
      color: #fff !important;
    }
  }
}
.el-menu-item:focus, .el-menu-item:hover{
  background-color: #2683E2;
}
.router-link-active{
  .el-menu-item{
    *{
      color: #fff;
    }
  }
}
</style>
