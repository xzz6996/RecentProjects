<template>
  <header>
    <div class="header">
      <el-dropdown class="fr" v-if="headerFlag">
        <span class="el-dropdown-link">
          <img class="userImg" src="../../assets/img/headerImg_20180720.jpg" alt="">
          <span class="name">{{username}}</span>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>
            <div @click="logout">登出</div>
          </el-dropdown-item>
          <el-dropdown-item>
            <div @click="resetPassword">修改密码</div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <reset-password v-if="resetPass" @resetStatus="resetStatus" :resetPass="resetPass"></reset-password>
  </header>
</template>

<script>
  import resetPassword from '../resetPassAlert/resetPass'
  export default {
    data(){
      return{
        resetPass:false
      }
    },
    components:{
      resetPassword
    },
  props: {
    headerFlag: Boolean
  },
  computed: {
    username () {
      return this.$store.state.name
    }
  },
  methods: {
    logout () {
      console.log('登出')
      this.$store.dispatch('Logout').then(() => {
        console.log('登出了')
        this.$router.push({path: '/login'})
      })
    },
    resetPassword(){
      this.resetPass=true;
    },
    resetStatus(){
      this.resetPass=false;
    }
  }
}
</script>

<style lang="scss" scoped>
header{
  width: 100%;
  height: 70px;
  background-color: #fff;
  .header{
    width: 1360px;
    margin: 0 auto;
    height: 70px;
    background: url(../../assets/logo.png) no-repeat 0 center;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .userImg{
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .name{
      position: relative;
      top: -10px;
      color: #4A4A4A;
      font-size: 16px;
    }
  }
}
</style>
