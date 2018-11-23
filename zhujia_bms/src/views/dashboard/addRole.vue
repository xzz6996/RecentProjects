<template>
  <div class="addRole">
     <el-dialog title="添加角色" :visible="true" width="600px"  :show-close='false'>
      <div class="clearfix">
        <el-form ref="form" :model="form" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="form.roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="form.roleCode" placeholder="请输入角色编码"></el-input>
          </el-form-item>
          <el-form-item label="是否有效" prop="status">
            <el-select v-model="form.status" placeholder="请选择" @change="getValue">
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
  import {saveRole} from '@/api/systemManagement'
    export default {
      data(){
          return{
            form:{
              roleName:null,
              roleCode:null,
              status:null
            },
            sure:[
              {
                label:"有效",
                value:1
              },
              {
                label:"无效",
                value: 0
              }
            ],
            rules: {
              roleCode: [
                { required: true, message: '请输入角色编码', trigger: 'blur' },
                { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
              ],
              roleName:[
                { required: true, message: '请输入角色名称', trigger: 'blur' },
                { min: 0, max:10, message: '请输入0-10位', trigger: 'blur' }
              ],
              status: [
                { required: true, message: '请选择', trigger: 'change' }
              ]
            }
          }
      },
      methods:{
        getValue(index){
          this.form.status=index;
        },
        onSubmit(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              const params=this.form;
              console.log(params)
              saveRole(params).then(res=>{
                if(res.data.code===0){
                  this.$message({
                    message: '添加成功',
                    type: 'success'
                  });
                  this.$emit('addRoleStatus');
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
          this.$emit('addRoleStatus')
        }
      }
    }
</script>

<style lang="scss" scoped>
  .addRole{
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
