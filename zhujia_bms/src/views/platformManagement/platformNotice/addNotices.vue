<template>
  <div class="addNotices">
    <div class="breadcrumb">
      添加公告
      <i class="el-icon-arrow-right"></i>
      <span @click="addNews">返回列表</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="所属栏目" prop="type">
      <el-select v-model="form.type" placeholder="请选择">
        <el-option v-for="item in type" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      </el-form-item>

      <el-form-item label="内容详情">
        <tinymce class="mt20" :height="300" v-model="form.content"></tinymce>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="addNews">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {addNotice} from '@/api/platformNotice'
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
        type:""
      },
      type:[
        {
          value:"21",
          label:"网站公告"
        },
        {
          value:"22",
          label:"APP公告"
        }
      ],
      rules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
        ],
        type:[
           { required: true, message: '请选择所属栏目', trigger: 'blur' }
        ],
      }
    }
  },
  methods:{
    addNews(){
      this.$emit('changeAddNoticesStatus');
    },
    onSubmit(formName){
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params={
            title:this.form.title,
            type:this.form.type,
            content:this.form.content,
            sysUserId:'aaaa',
            status:1,
            author:this.$store.state.name
          }
          addNotice(params).then(res=>{
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.$emit('changeAddNoticesStatus');
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch(err=>{
            this.$message.error(err);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .addNotices{
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

