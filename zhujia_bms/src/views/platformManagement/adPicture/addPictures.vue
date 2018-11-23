<template>
  <div class="addNews">
    <div class="breadcrumb">
      添加图片
      <i class="el-icon-arrow-right"></i>
      <span @click="webNews">返回列表</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="图片名称">
        <el-input v-model="form.bannerName"></el-input>
      </el-form-item>
      <el-form-item label="图片类型" prop="picType">
        <el-select v-model="form.picType" placeholder="请选择">
          <el-option
            v-for="item in picType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否分享">
        <el-checkbox v-model="form.share" @change="checkShare()"></el-checkbox>
      </el-form-item>
      <el-form-item label="分享标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="分享内容" prop="content">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="分享链接" prop="pathUrl">
        <el-input v-model="form.pathUrl"></el-input>
      </el-form-item>
      <el-form-item label="图片排序" prop="orderNo">
        <el-select v-model="form.orderNo" placeholder="请选择">
          <el-option
            v-for="item in picOrder"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片URL" prop="bannerUrl">
        <el-input v-model="form.bannerUrl"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.describ"></el-input>
      </el-form-item>

      <div class="operate mt20 clearfix">
        <el-col :span="7">
          上传图片：
        </el-col>
      </div>
      <div class="operate mt20 clearfix upload">
        <el-upload
          :file-list="fileList"
          :action="UPLOAD_IMAGE_URL"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :http-request="myUpload"
          :multiple="true"
          :on:success="upLoaSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">提交</el-button>
        <el-button @click="webNews">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {uploadPic} from '@/api/uploadPic'
  import {UPLOAD_IMAGE_URL} from '@/utils/env'
  import {addBanner} from '@/api/banner'
  export default {
    data(){
      return{
        form:{
          bannerName:'',
          share:false,
          bannerUrl:'',
          title:'',
          orderNo:'',
          content:'',
          describ:'',
          pictureUrls:'',
          pathUrl:'',
          picType:''
        },
        isShare:0,
        picType: [
          {
          value: '1',
          label: '手机端'
        }, {
          value: '2',
          label: '网站首页'
        }, {
          value: '3',
          label: '专区'
        }, {
          value: '4',
          label: '登录大图'
        }, {
          value: '5',
          label: '注册图'
        }],
        picOrder: [
          {
          value: '1',
          label: '1'
        }, {
          value: '2',
          label: '2'
        }, {
          value: '3',
          label: '3'
        }, {
          value: '4',
          label: '4'
        }, {
          value: '5',
          label: '5'
        },
          {
            value: '6',
            label: '6'
          },
          {
            value: '7',
            label: '7'
          }
          ,
          {
            value: '8',
            label: '8'
          }
          ,
          {
            value: '9',
            label: '9'
          }
          ,
          {
            value: '10',
            label: '10'
          }],
        picArray: [],
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        loading: true, // 表格加载
        borrowUserList: [],
        UPLOAD_IMAGE_URL: UPLOAD_IMAGE_URL,
        // content: '',
        imgName: 'file',
        header: {'Content-Type': 'multipart/form-data'},
        imgs: [],
        imgData: {accept: 'image/gif, image/jpeg, image/png, image/jpg',},
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
          ],
          content:[
            { required: true, message: '请输入分享内容', trigger: 'blur' },
            { min:2, max:20, message: '请输入2-20位', trigger: 'blur' }
          ],bannerUrl:[
            { required: true, message: '请输入图片URL', trigger: 'blur' },
            { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
          ],pathUrl:[
            { required: true, message: '请输入分享链接', trigger: 'blur' },
            { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
          ],
          picType:[
            { required: true, message: '请选择图片类型', trigger: 'blur' }
          ],
          orderNo:[
            { required: true, message: '请选择图片排序', trigger: 'blur' }
          ],
        }
      }
    },
    methods:{
      checkShare(){
        if(this.isShare===0){
          this.isShare=1;this.form.share=true;
        }else{
          this.isShare=0;this.form.share=false;
        }
      },
      webNews(){
        this.$emit('changeAddPictureStatus');
      },
      myUpload (content) {
        uploadPic(content.file).then(res => {
          console.log('上传成功',res)
          this.picArray.push({name: res.data.data.key})
          console.log(this.picArray)
        }).catch(err => {
          console.log(err)
          content.onError(`图片上传失败${err}`)
        })
      },
      submitUpload() {
        this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
        this.picArray = fileList
      },
      handlePreview(file) {
        console.log(file);
      },
      upLoaSuccess (response, file, fileList) {
        console.log('response', response)
        console.log('file', file)
      },
      uploadChange() {},
      back () {
        console.log(1)
        this.$emit('addContractFlagClick')
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const pic = this.picArray.map(item =>{
              return item.name
            })
            const contractPicture = pic.join(',')
            console.log(pic)
            console.log(contractPicture)
            const params={
              bannerUrl:this.form.bannerUrl,
              isShare:this.isShare,
              orderNo:this.form.orderNo,
              bannerType:this.form.picType,
              pictureUrls:contractPicture,
              bannerName:this.form.bannerName,
              title:this.form.title,
              pathUrl:this.form.pathUrl,
              describ:this.form.describ,
              content:this.form.content,
              targetId:'',
              id:'',
              sysUserId:'aaaa',
              status:1,
              author:this.$store.state.name
            }
            addBanner(params).then(res=>{
              if(res.data.code===0) {
                console.log(res)
                this.$message({
                  message: '添加成功',
                  type: 'success'
                });
                this.$emit('changeAddPictureStatus');
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
    .el-input,.el-select{
      width: 300px;
    }
    .upload{
      margin-left: 50px;
    }
    .el-table{
      margin-top: 20px;
      border: 1px solid #e0e0e0
    }
    .clearfix{
      padding-left: 30px;
      margin-bottom: 20px;
      font-size: 14px;
    }
  }
</style>


