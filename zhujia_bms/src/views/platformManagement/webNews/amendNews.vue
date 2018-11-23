<template>
  <div class="amendNews">
    <div class="breadcrumb">
      修改新闻
      <i class="el-icon-arrow-right"></i>
      <span @click="amendNews">返回列表</span>
    </div>

    <el-form class="mt20" ref="form" :model="amendNewsContent" label-width="80px" :rules="rules">
      <el-form-item label="新闻标题" prop="title">
        <el-input v-model="amendNewsContent.title"></el-input>
      </el-form-item>
      <el-form-item label="作者" prop="author">
        <el-input v-model="amendNewsContent.author"></el-input>
      </el-form-item>
      <el-form-item label="信息来源" prop="infoFrom">
        <el-input v-model="amendNewsContent.infoFrom"></el-input>
      </el-form-item>
      <el-form-item label="关键字" prop="keywords">
        <el-input v-model="amendNewsContent.keywords"></el-input>
      </el-form-item>
      <el-form-item label="点击链接" prop="pathUrl">
        <el-input v-model="amendNewsContent.pathUrl"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="describ">
        <el-input v-model="amendNewsContent.describ"></el-input>
      </el-form-item>

      <div class="operate mt20 clearfix">
        <el-col :span="7">
          类别图片：
        </el-col>
      </div>

      <div class="operate mt20 clearfix upload">
        <el-upload :file-list="newFileList" :action="uploadImageUrl" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="myUpload" :multiple="true" :on:success="upLoaSuccess">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </div>

      <el-form-item label="内容摘要" prop="content">
        <tinymce class="mt20" :height="300" v-model="amendNewsContent.content"></tinymce>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit('form')">修改</el-button>
        <el-button @click="amendNews">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import {uploadPic} from '@/api/uploadPic'
import {upDateNews} from '@/api/webNews'
import {UPLOAD_IMAGE_URL, OSS_UPLOAD_BASE_URL} from '@/utils/env'
import tinymce from '@/components/tinymce'
export default {
  components: {tinymce},
  props: {
    amendNewsInfo: {
      type: Array
    }
  },
  data () {
    return {
      content: '',
      uploadImageUrl:UPLOAD_IMAGE_URL,
      ossBaseUrl: OSS_UPLOAD_BASE_URL,
      imgName: 'file',
      userUpload: [],
      picArray: [],
      dialogImageUrl: '',
      dialogVisible: false,
      demo:false,
      loading: true, // 表格加载
      borrowUserList: [],
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
  computed: {
    amendNewsContent(){
      return this.amendNewsInfo[0]
    },
    newFileList () {
      var obj={};
      if (this.amendNewsInfo[0].pictureUrl === null || this.amendNewsInfo[0].pictureUrl === '' || this.amendNewsInfo[0].pictureUrl === undefined) {
        this.userUpload=[];
        return [];
      } else {
       if(this.amendNewsInfo[0].pictureUrl.indexOf(',')===-1){
         obj.name=this.amendNewsInfo[0].pictureUrl;
         obj.url=this.ossBaseUrl+this.amendNewsInfo[0].pictureUrl;
         this.userUpload.push(obj);
         return this.userUpload
       }else{
         //多张图片
         var arr=this.amendNewsInfo[0].pictureUrl.split(',');
         console.log(arr); var arr1=[];
         for(var i=0;i<arr.length;i++){
           arr1.push({name:arr[i],url:this.ossBaseUrl+arr[i]});
         }
         this.userUpload=arr1;
         return this.userUpload;
       }
      }
    }
  },
  mounted() {
    console.log(this.amendNewsInfo)
    if(this.amendNewsInfo[0].pictureUrl===null||this.amendNewsInfo[0].pictureUrl===''){
      this.demo=true;
    }
  },
  methods: {
    amendNews () {
      this.$emit('changeAmendNewsStatus')
    },
    // 上传图片
    myUpload (content) {
      uploadPic(content.file).then(res => {
        console.log('上传成功',res)
        console.log(this.picArray)
        this.picArray.push({name: res.data.data.key,url:this.ossBaseUrl+res.data.data.key});
        var x='';
       if(this.amendNewsInfo[0].pictureUrl===null||this.amendNewsInfo[0].pictureUrl===''){ //没有默认图片
           const pic = this.picArray.map(item =>{return item.name})
           x+=pic.join(',');
           this.amendNewsInfo[0].pictureUrl=x;
           console.log(x)
        // }
       }else{  //有默认图片 添加新图片
            const pics = this.picArray.map(item =>{return item.name})
             x+=pics.join(',');
            if(this.demo){
              this.amendNewsInfo[0].pictureUrl=x;
            }else{
              this.amendNewsInfo[0].pictureUrl=x+','+this.amendNewsInfo[0].pictureUrl;
            }
           console.log(x,this.amendNewsInfo[0].pictureUrl)
       }
      }).catch(err => {
        content.onError(`图片上传失败${err}`)
      })
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.changeImg(fileList);
    },
    changeImg(params){   //把域名+图片名 转换为 图片名
      if(params.length==1){
        this.amendNewsInfo[0].pictureUrl=params[0].name;
      }else{
        const pic = params.map(item =>{
          return item.name
        })
        this.amendNewsInfo[0].pictureUrl = pic.join(',');
      }
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
    // 修改
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const updateInfo = this.amendNewsInfo[0];
          console.log(this.amendNewsInfo[0].pictureUrl)
          const params = {
            author: updateInfo.author,
            content: updateInfo.content,
            describ: updateInfo.describ,
            id: updateInfo.id,
            infoFrom: updateInfo.infoFrom,
            keywords: updateInfo.keywords,
            pathUrl: updateInfo.pathUrl,
            pictureUrls:this.amendNewsInfo[0].pictureUrl,
            status: updateInfo.status,
            sysUserId: 'aaaa',
            targetId: updateInfo.targetId,
            title: updateInfo.title
          }
          upDateNews(params).then(res => {
            console.log(res)
            if(res.data.code===0){
              this.$message({
                message: '修改成功',
                type: 'success'
              });
              this.$emit('changeAmendNewsStatus');
            }else{
              this.$message.error(res.data.msg);
            }
          }).catch(err => {
            this.$message.error(err);
          })
        } else {
          console.log('error submit!!');
          return false;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.amendNews{
  color: #4a4a4a;
  width: 1100px;
  float: right;
  background-color: #fff;
  padding: 20px;
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
  .upload{
    margin-left: 50px;
  }
  .clearfix{
    padding-left: 30px;
    margin-bottom: 20px;
    font-size: 14px;
  }
}
</style>

