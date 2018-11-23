<template>
  <div class="amendRole">
     <el-dialog title="修改用户" :visible="true" width="600px"  :show-close='false'>
      <div class="clearfix">
        <el-form ref="form" :model="info[0]" label-width="80px" :rules="rules">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="info[0].roleName" placeholder="请输入角色名称"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="roleCode">
            <el-input v-model="info[0].roleCode"></el-input>
          </el-form-item>
          <el-form-item label="是否有效" prop="status">
            <el-select v-model="info[0].status" placeholder="请选择" @change="getValue">
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
    props:{
      info:{
        type:Array
      }
    },
    created(){
      console.log(this.info)
    },
    data(){
      return{
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
        this.info[0].status=index;
        console.log(this.info[0].status)
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params={
              id:this.info[0].id,
              roleCode:this.info[0].roleCode,
              roleName:this.info[0].roleName,
              status:this.info[0].status
            };
            saveRole(params).then(res=>{
              if(res.data.code===0){
                this.$message({
                  message: '修改成功',
                  type: 'success'
                });
                this.$emit('amendRoleStatus');
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
        this.$emit('amendRoleStatus')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .amendRole{
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
