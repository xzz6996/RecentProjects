<template>
  <div class="addNews">
    <div class="breadcrumb">
      添加新闻
      <i class="el-icon-arrow-right"></i>
      <span @click="webNews">返回列表</span>
    </div>
    <el-form ref="form" :model="form" label-width="80px" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="form.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="form.author"></el-input>
      </el-form-item>
      <el-form-item label="信息来源" prop="infoFrom">
        <el-input v-model="form.infoFrom"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input v-model="form.keywords"></el-input>
      </el-form-item>
      <el-form-item label="点击链接" prop="pathUrl">
        <el-input v-model="form.pathUrl"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="describ">
        <el-input v-model="form.describ"></el-input>
      </el-form-item>
      <div class="operate mt20 clearfix">
        <el-col :span="7">
          类别图：
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

      <el-form-item label="内容摘要" prop="content">
        <tinymce class="mt20" :height="300" v-model="form.content"></tinymce>
      </el-form-item>

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
  import {addNews} from '@/api/webNews'
  import tinymce from '@/components/tinymce'
export default {
    components:{
      tinymce
    },
    data(){
      return{
        form:{
            title:'',
            author:'',
            infoFrom:'',
            content:'',
            describ:'',
            pictureUrls:'',
            pathUrl:'',
            keywords:''
          },
        picArray: [],
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false,
        loading: true, // 表格加载
        borrowUserList: [],
        UPLOAD_IMAGE_URL: UPLOAD_IMAGE_URL,
        imgName: 'file',
        header: {'Content-Type': 'multipart/form-data'},
        imgs: [],
        imgData: {accept: 'image/gif, image/jpeg, image/png, image/jpg',},
        rules: {
          title: [
            { required: true, message: '请输入标题', trigger: 'blur' },
            { min:2, max:10, message: '请输入2-10位', trigger: 'blur' }
          ],
          author:[
            // { required: true, message: '请输入作者', trigger: 'blur' },
            { min: 2, max:6, message: '请输入2-6位', trigger: 'blur' }
          ],
          infoFrom:[
            // { required: true, message: '请输入信息来源', trigger: 'blur' },
            { min: 2, max:20, message: '请输入2-20位', trigger: 'blur' }
          ],
          describ:[
            //{ required: true, message: '请输入描述', trigger: 'blur' },
            { min: 2, max:20, message: '请输入2-20位', trigger: 'blur' }
          ],
          keywords:[
            //{ required: true, message: '请输入关键字', trigger: 'blur' },
            { min: 2, max:20, message: '请输入2-20位', trigger: 'blur' }
          ],
          pathUrl:[
            { required: true, message: '请输入点击链接', trigger: 'blur' },
            { min: 3, max:20, message: '请输入3-20位', trigger: 'blur' }
          ]

        }
      }
    },
  methods:{
    webNews(){
      this.$emit('changeAddNewsStatus');
    },
    myUpload (content) {
      console.log(content)
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
      console.log('fileList', fileList)
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
            pictureUrls:contractPicture,
            title:this.form.title,
            author:this.form.author,
            infoFrom:this.form.infoFrom,
            keywords:this.form.keywords,
            pathUrl:this.form.pathUrl,
            describ:this.form.describ,
            content:this.form.content,
            targetId:'',
            id:'',
            sysUserId:'aaaa',
            status:1,
          }
          addNews(params).then(res=>{
            if(res.data.code===0){
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.$emit('changeAddNewsStatus');
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
    .el-input{
      width: 280px;
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

