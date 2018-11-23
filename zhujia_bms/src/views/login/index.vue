<template>
  <div class="login">
    <v-header :headerFlag="false"></v-header>
    <div class="login_content">
      <div class="login_box">
        <img class="logo" src="../../assets/logo.png" alt="">
        <el-input
          clearable
          class="username"
          placeholder="用户名"
          prefix-icon="icon-yonghu icon iconfont"
          v-model="account">
        </el-input>
        <el-input
          clearable
          class="password"
          type="password"
          placeholder="密码"
          prefix-icon="icon-mima icon iconfont"
          @keyup.enter.native="login"
          v-model="password">
        </el-input>
        <el-button :loading="loading" @click="login" class="login_btn" type="primary">登录</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import vHeader from '@/components/vHeader'
export default {
  components: {vHeader},
  data () {
    return {
      account: '',
      password: '',
      loading: false
    }
  },
  methods: {
    login () {
      const _this = this
      if (this.account === '' || this.pwd === '') {
        this.$message.error('用户名或密码不能为空');
        return
      }
      const params = {
        account: this.account,
        password: this.password
      }
      this.loading = true
      this.$store.dispatch('Login', params).then(res => {
        console.log('res',res)
        if (!res.data.success) {
          _this.loading = false
          this.$message({
            message: res.data.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
        if (res.data.data.roleCodes.length === 0) {
          _this.loading = false
          this.$message({
            message: '用户未分配角色',
            type: 'error',
            duration: 5 * 1000
          })
        }
        if (res.data.success) {
          this.$router.push({path: '/'})
        } else {
          console.log('zzz')
          _this.loading = false
          this.$message({
            message: res.data.msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      }).catch((err) => {
        console.log(err)
        this.$message({
            message: err.data.msg,
            type: 'error',
            duration: 5 * 1000
          })
        _this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login{
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: fixed;
  background: url(../../assets/img/login-bg.png) no-repeat center;
  .login_content{
    width: 1200px;
    margin: 0 auto;
    .login_box{
      padding: 0px 45px;
      width: 350px;
      height: 340px;
      float: right;
      margin-top: 180px;
      border-radius: 5px;
      margin-right: 30px;
      background-color: #fff;
      .logo{
        display: block;
        width: 250px;
        padding: 70px 0 30px 0;
      }
      .password{
        margin: 20px 0;
      }
      .login_btn{
        display: block;
        width: 100%;
      }
    }
  }
}
</style>

