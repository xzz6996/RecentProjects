// 添加合同
<template>
  <div class="addContract main_content">
    <div class="breadcrumb">
      添加合同
      <i class="el-icon-arrow-right"></i>
      <span class="pointClick" @click="back">返回列表</span>
    </div>
    <div class="operate mt20 clearfix">
      <el-col :span="7">
        合同编号：
        <el-input v-model="serialNo"  placeholder="请输入内容"></el-input>
      </el-col>
    </div>
    <div class="operate mt20 clearfix">
      <el-col :span="7">
        借款用户：
        <el-select v-model="userId" placeholder="请选择">
          <el-option
            v-for="item in borrowUserList"
            :key="item.userId"
            :label="item.realName"
            :value="item.userId">
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div class="operate mt20 clearfix">
      <el-col :span="7">
        合同图片：
      </el-col>
    </div>

    <div class="operate mt20 clearfix">
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

    <div class="tinymce">
      <div class="operate mt20 clearfix">
        <el-col :span="7">
          合同详情：
        </el-col>
      </div>
      <tinymce class="" :value="value" :height="300" v-model="content"></tinymce>
    </div>
    <div class="clearfix operate mt20">
      <el-button class="ml10" type="primary" @click="addContract">添加合同</el-button>
    </div>
  </div>
</template>

<script>
import {contractManagement, getUserList, createContract} from '@/api/contractManagement'
import {uploadPic} from '@/api/uploadPic'
import {UPLOAD_IMAGE_URL} from '@/utils/env'
import tinymce from '@/components/tinymce'
import axios from 'axios'
export default {
  components: {tinymce},
  data () {
    return {
      value: '',
      picArray: [],
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      loading: true, // 表格加载
      serialNo: '',
      userId: '',
      borrowUserList: [],
      UPLOAD_IMAGE_URL: UPLOAD_IMAGE_URL,
      content: '',
      imgName: 'file',
      header: {
        'Content-Type': 'multipart/form-data'
      },
      imgs: [],
      imgData: {
        accept: 'image/gif, image/jpeg, image/png, image/jpg',
      }
    }
  },
  watch: {
    value (val) {
      console.log('bb',val)
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList () {
      const _this = this
      getUserList().then(res => {
        console.log(res)
        _this.borrowUserList = res.data.data
        console.log(res.data.data)
      }).catch(err => {
        console.log(err)
      })
    },
    myUpload (content) {
      uploadPic(content.file).then(res => {
        console.log('上传成功',res)
        this.picArray.push({name: res.data.data.key})
        console.log(this.picArray)
      }).catch(err => {
        this.$message.error(err)
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
    uploadChange() {   
    },
    back () {
      console.log(1)
      this.$emit('addContractFlagClick')
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 添加合同
    addContract () {
      const _this = this
      const pic = this.picArray.map(item => item.name)
      const contractPicture = pic.join(',')
      let realName = ''
      this.borrowUserList.forEach(item => {
        if (item.userId === this.userId) {
          realName = item.realName
        }
      })
      console.log('realName', realName)
      console.log(contractPicture)
      const params = {
        serialNo: this.serialNo,
        userId: this.userId,
        realName: realName,
        content: this.content,
        contractPicture: contractPicture
      }
      if (params.serialNo === '') {
        this.$message.error('合同编号不能为空');
        return
      }
      if (params.userId === '') {
        this.$message.error('借款用户不能为空');
        return
      }
      if (params.contractPicture === '') {
        this.$message.error('合同图片不能为空');
        return
      }
      if (params.content === '') {
        this.$message.error('合同详情不能为空');
        return
      }
      console.log(params)
      console.log(this.userId)
      createContract(params).then(res => {
        console.log(res)
        if (res.data.success) {
          this.$message({
            message: '添加成功',
            type: 'success'
          });
          this.$emit('addContractFlagClick')
        }
      }).catch(err => {
        this.$message.error('添加失败');
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.tinymce{
  line-height: 40px
}
</style>

