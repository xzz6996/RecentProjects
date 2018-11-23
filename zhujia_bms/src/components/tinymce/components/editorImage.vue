<template>
  <div class="upload-container">
    <el-button icon='el-icon-upload' size="mini" :style="{background:color,borderColor:color}" @click=" dialogVisible=true" type="primary">上传图片
    </el-button>
    <el-dialog append-to-body :visible.sync="dialogVisible">
      <el-upload class="editor-slide-upload" 
        :action="UPLOAD_IMAGE_URL" 
        :http-request="myUpload"
        :multiple="true" 
        :file-list="fileList" 
        :show-file-list="true"
        list-type="picture-card" 
        :on-remove="handleRemove" 
        :on-success="handleSuccess" 
        :before-upload="beforeUpload">
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
      <div class="mt20">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { getToken } from 'api/qiniu'
import {uploadPic} from '@/api/uploadPic'
import {UPLOAD_IMAGE_URL, OSS_UPLOAD_BASE_URL} from '@/utils/env'

export default {
  name: 'editorSlideUpload',
  props: {
    color: {
      type: String,
      default: '#1890ff'
    }
  },
  data() {
    return {
      UPLOAD_IMAGE_URL: UPLOAD_IMAGE_URL,
      dialogVisible: false,
      listObj: {},
      fileList: [],
      picArray: []
    }
  },
  methods: {
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
    handleSubmit() {
      let arr = this.picArray
      this.$emit('successCBK', arr)
      this.picArray = []
      this.listObj = {}
      this.fileList = []
      this.dialogVisible = false
    },
    handleSuccess(response, file) {
    },
    handleRemove(file) {
      this.picArray = fileList
    },
    beforeUpload(file) {
    }
  }
}
</script>
