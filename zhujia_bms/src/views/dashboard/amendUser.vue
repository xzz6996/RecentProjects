<template>
  <div class="amendUser">
     <el-dialog title="修改用户" :visible="true" width="600px"  :show-close='false'>
      <div class="clearfix">
        <el-form ref="form" :model="info[0]" label-width="80px" :rules="rules">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="info[0].userName" placeholder="请输入用户名"></el-input>
          </el-form-item>
        <!-- <el-form-item label="密码">
            <el-input v-model="info[0].pwd" placeholder="请输入密码" type="password"></el-input>
          </el-form-item>-->
        <!-- <el-form-item label="姓名">
            <el-input v-model="info[0].relaName" placeholder="请输入姓名"></el-input>
          </el-form-item>-->
          <el-form-item label="手机" prop="phone">
            <el-input v-model="info[0].phone" placeholder="请输入手机"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="mailbox">
            <el-input v-model="info[0].mailbox" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="用户角色" prop="roleCode">
            <el-select v-model="info[0].roleCode" multiple placeholder="请选择" @change="getValue">
              <el-option v-for="item in sure" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">提交</el-button>
            <el-button @click="webNews">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {saveSysUser} from '@/api/systemManagement'
  import {isPhone} from "@/filters";

  var validPhone=(rule,value,callback)=>{
    if(!value){
      callback(new Error('请输入电话号码'))
    }else  if (!isPhone(value)){
      callback(new Error('请输入正确的11位手机号码'))
    }else {
      callback()
    }
  }
  export default {
    props:{
      info:{
        type:Array
      }
    },
    created(){
       this.info[0].roleCodes=this.info[0].roleCode;
    },
    data(){
      return{
        sure:[
          {
            label:"技术",
            value:"technology"
          },
          {
            label:"产品",
            value: "product"
          },
          {
            label:"运营",
            value: "operate"
          },
          {
            label:"风控",
            value: "risk"
          },
          {
            label:"财务",
            value: "finance"
          },
          {
            label:"超级管理员",
            value:"admin"
          },
          {
            label:"超级超级管理员",
            value:"0000"
          },
        ],
        rules: {
          userName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min:3, max:8, message: '请输入3-8位', trigger: 'blur' }
          ],
          phone: [
            { required: true, trigger: 'blur', validator: validPhone ,max:11}
          ],
          roleCode: [
            { type: 'array',required: true, message: '请至少选择一个用户角色', trigger: 'change' }
          ],
          mailbox: [
            { required: true, message: '请输入邮箱地址', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ]
        }
      }
    },
    methods:{
      getValue(index){
        this.info[0].roleCodes=index;
        this.info[0].roleName=index;
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params=this.info[0];
            saveSysUser(params).then(res=>{
              if(res.data.code===0){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$emit('amendUserStatus');
              }else{
                this.$message.error(res.data.msg);
              }
            })
          } else {
            console.log('error submit!!');
            return false;
          }
        })
      },
      webNews(){
        this.$emit('amendUserStatus')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .amendUser{
    width: 1100px;
    color: #4a4a4a;
    float: right;
    background-color: #fff;
    padding: 20px;
    .clearfix{
      margin: 20px auto;
      .el-input,.el-select{
        width: 300px;
      }
    }
  }
</style>
