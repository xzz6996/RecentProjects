<template>
  <div class="addNews">
    <div class="breadcrumb">
      添加活动消息
      <i class="el-icon-arrow-right"></i>
      <span @click="webNews">返回列表</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="消息简介" prop="describ">
        <el-input v-model="form.describ" input-width="600px"></el-input>
      </el-form-item>

      <el-form-item label="内容详情">
        <tinymce class="mt20" :height="300" v-model="form.content"></tinymce>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('from')">提交</el-button>
        <el-button @click="webNews">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
  import {addMessage} from '@/api/activityMessage'
  import tinymce from '@/components/tinymce'
export default {
  components:{
    tinymce
  },
    data(){
      return{
        form:{
          title:"",
          content:"",
          describ:""
        },
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
          ],
          describ:[
            { min:2, max:20, message: '请输入2-20位', trigger: 'blur' }
          ],
        }
      }
    },
  methods:{
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params={
            title:this.form.title,
            content:this.form.content,
            describ:this.form.describ,
            status:1,
            sysUserId:'aaaa',
            author:this.$store.state.name
          }
          addMessage(params).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.$emit('changeAddMessage');
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch(err=>{
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
    webNews(){
      this.$emit('changeAddMessage');
    }
  }
}
</script>

<style lang="scss" scoped>
  .addNews{
    color: #4a4a4a;
    width: 1100px;
    float: right;
    background-color: #fff;
    padding: 20px;
    .el-form{
      margin: 50px auto;
    }
    .title{
      font-size: 16px;
      line-height: 40px;
    }
    .el-input{
      width: 180px;
    }

    .el-table{
      margin-top: 20px;
      border: 1px solid #e0e0e0
    }

  }
</style>

