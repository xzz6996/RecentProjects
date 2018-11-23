<template>
    <div>
      <el-dialog title="修改密码" :visible.sync="resetPass" width="600px"  @close="doClick(0)" :show-close='false'>
        <el-form :model="form">
          <el-form-item label="旧密码" :label-width="formLabelWidth">
            <el-input v-model="form.oldPassword " auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" :label-width="formLabelWidth">
            <el-input v-model="form.newPassword " auto-complete="off"></el-input>
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="doClick(0)">取 消</el-button>
          <el-button type="primary" @click="doClick(1)">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
  import {resetPasswd} from '@/api/login'
    export default {
      props:{
        resetPass:{
          type:Boolean
        }
      },
      created(){
        console.log(this.resetPass)
      },
      data() {
        return {
          form: {
            newPassword: '',
            oldPassword: '',
          },
          formLabelWidth: '120px'
        };
      },
      methods:{
        doClick(index){
          if(index===0){
            this.$emit('resetStatus');
          }else{
            if(this.form.newPassword === ''){
              this.$message.error('请输入新密码');
              return
            }
            if(this.form.oldPassword === ''){
              this.$message.error('请输入旧密码');
              return
            }
             const params={
                accountId:this.$store.state.userId,
                newPassword:this.form.newPassword,
                oldPassword:this.form.oldPassword
              }
             resetPasswd(params).then(res=>{
                  if(res.data.code===0){
                    this.$message({
                      message: '修改成功',
                      type: 'success'
                    });
                    this.$store.dispatch('Logout').then(() => {
                      console.log('登出了')
                      this.$router.push({path: '/login'})
                    })
                    //this.$emit('resetStatus');
                  }else{
                    this.$message.error(res.data.msg);
                  }
             })
          }
          }
        }

    }
</script>

<style lang="scss" scoped>
  .el-input{
    width: 76%;
  }
</style>
