<template>
    <div class="amendNotices">
      <div class="breadcrumb">
        添加公告
        <i class="el-icon-arrow-right"></i>
        <span @click="amendNotices">返回列表</span>
      </div>
      <el-form ref="form" label-width="80px" :model="amendNewsInfo[0]" :rules="rules">
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="amendNewsInfo[0].title"></el-input>
        </el-form-item>
        <el-form-item label="所属栏目" prop="type">
          <el-select v-model="type" placeholder="请选择" @change="getValue">
            <el-option v-for="item in types" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="内容详情">
          <tinymce class="mt20" :height="300" v-model="amendNewsInfo[0].content"></tinymce>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit('form')">提交</el-button>
          <el-button @click="amendNotices">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import {updateNotice} from '@/api/platformNotice'
  import tinymce from '@/components/tinymce'
    export default {
    components: {tinymce},
      props:{
        amendNewsInfo:Array
      },
      data(){
        return{
          types:[
            {
              value:"21",
              label:"网站公告"
            },
            {
              value:"22",
              label:"APP公告"
            }
          ],
          type:null,
          type1:null,
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
      created(){
        if(this.amendNewsInfo[0].type===21){
          this.type='网站公告';
        }
        if(this.amendNewsInfo[0].type===22){
          this.type='APP公告';
        }
      },
      methods:{
        amendNotices(){
          this.$emit('changeAmendNewsStatus');
        },
        onSubmit(formName){
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.type='网站公告'){
                this.type1=21;
              }
              if(this.type='APP公告'){
                this.type1=22;
              }
              const params={
                title:this.amendNewsInfo[0].title,
                type:this.type1,
                content:this.amendNewsInfo[0].content,
                sysUserId:'aaaa',
                status:this.amendNewsInfo[0].status,
                id:this.amendNewsInfo[0].id
              }
              updateNotice(params).then(res=>{
                if(res.data.code===0){
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  });
                  this.$emit('changeAmendNewsStatus');
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
        },
        getValue(value){
          this.label=value;
          console.log(value)
        }
      }
    }
</script>

<style lang="scss" scoped>
  .amendNotices{
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
