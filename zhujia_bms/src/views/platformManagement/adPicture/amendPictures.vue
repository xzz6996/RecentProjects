<template>
  <div class="amendPic">
    <div class="breadcrumb">
      修改图片
      <i class="el-icon-arrow-right"></i>
      <span @click="amendPic">返回列表</span>
    </div>
    <el-form ref="form" :model="amendNewsInfo[0]" label-width="80px" :rules="rules">
      <el-form-item label="图片名称">
        <el-input v-model="amendNewsInfo[0].bannerName"></el-input>
      </el-form-item>
      <el-form-item label="图片类型" prop="picType">
        <el-select v-model="picType" placeholder="请选择" @change="getValue">
          <el-option
            v-for="item in picTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否分享">
        <el-checkbox  v-model="share"  @change="checkShare()"></el-checkbox>
      </el-form-item>
      <el-form-item label="分享标题" prop="title">
        <el-input v-model="amendNewsInfo[0].title"></el-input>
      </el-form-item>
      <el-form-item label="分享内容" prop="content">
        <el-input v-model="amendNewsInfo[0].content"></el-input>
      </el-form-item>
      <el-form-item label="分享链接" prop="pathUrl">
        <el-input v-model="amendNewsInfo[0].pathUrl"></el-input>
      </el-form-item>
      <el-form-item label="图片排序" prop="picOrder">
        <el-select v-model="amendNewsInfo[0].picOrder" placeholder="请选择" @change="changeOrder">
          <el-option
            v-for="item in picOrders"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="图片URL" prop="bannerUrl">
        <el-input v-model="amendNewsInfo[0].bannerUrl"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="amendNewsInfo[0].describ"></el-input>
      </el-form-item>

      <div class="operate mt20 clearfix">
        <el-col :span="7">
          上传图片：
        </el-col>
      </div>
      <div class="operate mt20 clearfix upload">
        <el-upload
          :file-list="newFileList"
          :action="uploadImageUrl"
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
        <el-button @click="amendPic">取消</el-button>
      </el-form-item>
    </el-form>


  </div>
</template>

<script>
  import {uploadPic} from '@/api/uploadPic'
  import {UPLOAD_IMAGE_URL, OSS_UPLOAD_BASE_URL} from '@/utils/env'
  import {upDateNews} from '@/api/webNews'
  import {updateBanner} from '@/api/banner'
  export default {
    props:{
      amendNewsInfo:{
        type: Array
      }
    },
    data(){
      return{
        share:null,
        picType:null,
        picTypes: [
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
        picOrders: [
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
        userUpload: [],
        demo:false,
        fileList: [],
        picOrder:null,
        dialogImageUrl: '',
        test:[],
        dialogVisible: false,
        loading: true, // 表格加载
        borrowUserList: [],
        uploadImageUrl: UPLOAD_IMAGE_URL,
        ossBaseUrl: OSS_UPLOAD_BASE_URL,
        // content: '',
        imgName: 'file',
        header: {
          'Content-Type': 'multipart/form-data'
        },
        imgs: [],
        imgData: {
          accept: 'image/gif, image/jpeg, image/png, image/jpg',
        },
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
          picOrder:[
            { required: true, message: '请选择图片排序', trigger: 'blur' }
          ],
        }
      }
    },
    computed:{
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
    created(){
      console.log(this.amendNewsInfo)
      this.share=this.amendNewsInfo[0].isShare;
      if(this.amendNewsInfo[0].isShare===0){this.share=false}else{this.share=true}
      if(this.amendNewsInfo[0].bannerType===1){
        this.picType='手机端';
      }
      if(this.amendNewsInfo[0].bannerType===2){
        this.picType='网站首页';
      }
      if(this.amendNewsInfo[0].bannerType===3){
        this.picType='专区';
      }
      if(this.amendNewsInfo[0].bannerType===4){
        this.picType='登录大图';
      }
      if(this.amendNewsInfo[0].bannerType===5){
        this.picType='注册图';
      }
    },
    methods:{
      getValue(value){
        this.amendNewsInfo[0].picType=value;
      },
      changeOrder(value){
        this.amendNewsInfo[0].orderNo=value;
      },
      checkShare(){
        if(this.amendNewsInfo[0].isShare===0){
          this.amendNewsInfo[0].isShare=1;this.share=true;
        }else{
          this.amendNewsInfo[0].isShare=0;this.share=false;
        }
      },
      amendPic(){
        this.$emit('changeAmendNewsStatus');
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
      onSubmit(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const params={
              bannerUrl:this.amendNewsInfo[0].bannerUrl,
              isShare:this.amendNewsInfo[0].isShare,
              orderNo:this.amendNewsInfo[0].orderNo,
              picType:this.amendNewsInfo[0].picType,
              pictureUrls:this.amendNewsInfo[0].pictureUrl,
              bannerName:this.amendNewsInfo[0].bannerName,
              title:this.amendNewsInfo[0].title,
              pathUrl:this.amendNewsInfo[0].pathUrl,
              describ:this.amendNewsInfo[0].describ,
              content:this.amendNewsInfo[0].content,
              targetId:'',
              id:this.amendNewsInfo[0].id,
              sysUserId:'aaaa',//这个先传aaaa
              status:1,
            }
            updateBanner(params).then(res=>{
              if(res.data.code===0){
                console.log(res)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .amendPic{
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


