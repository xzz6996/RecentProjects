// 房源详情
<template>
  <div class="addHouse">
    <div class="breadcrumb">
      房源详情
      <i class="el-icon-arrow-right"></i>
      <span class="pointClick" @click="back">返回列表</span>
    </div>
    <div class="mt20">
      <el-form :model="ruleForm" label-width="130px" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="房源名称" prop="houseName">
              <el-input v-model="ruleForm.houseName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发标用户" prop="borrowUserId">
              <el-select v-model="ruleForm.borrowUserId" placeholder="请选择发标用户" disabled>
                <el-option
                  v-for="item in userListArray"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="房屋面积" prop="houseArea">
              <el-input v-model="ruleForm.houseArea" disabled></el-input>㎡
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出租总额" prop="rentAmount">
              <el-input v-model="ruleForm.rentAmount" disabled></el-input>元
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年租金" prop="houseRent">
              <el-input v-model="ruleForm.houseRent" disabled></el-input>¥/㎡
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="租金总差额" prop="rentProfit">
              <el-input v-model="ruleForm.rentProfit" disabled></el-input>元
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="募集总额" prop="raiseAmount">
              <el-input v-model="ruleForm.raiseAmount" disabled></el-input>元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低起租面积" prop="minArea">
              <el-input v-model="ruleForm.minArea" disabled></el-input>㎡
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="租赁期限" prop="timeImit">
              <el-input v-model="ruleForm.timeImit" disabled></el-input>天
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高承租面积" prop="maxArea">
              <el-input v-model="ruleForm.maxArea" disabled></el-input>㎡
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起租日" prop="beginRepayTime">
              <el-col :span="11">
                <el-date-picker disabled type="date" placeholder="选择日期" v-model="ruleForm.beginRepayTime" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款方式" prop="repayType">
              <el-select disabled v-model="ruleForm.repayType" placeholder="请选择还款方式">
                <el-option
                  v-for="item in repayTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否新手标" prop="isNovice">
              <el-radio-group v-model="ruleForm.isNovice" disabled>
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否测试标" prop="isTest">
              <el-radio-group v-model="ruleForm.isTest" disabled>
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="是否可用现金券" prop="isVouchers">
              <el-radio-group v-model="ruleForm.isVouchers" disabled>
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否首页展示" prop="isHot">
              <el-radio-group v-model="ruleForm.isHot" disabled>
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> 
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义标签" prop="name">
              <el-input v-model="mark" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="房源图片">
          <el-upload
            disabled
            :file-list="photoList"
            :action="UPLOAD_IMAGE_URL"
            list-type="picture-card"
            :on-remove="handleRemove1"
            :http-request="myUpload1"
            :multiple="true"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible1">
            <img width="100%" :src="dialogImageUrl1" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="协议资料">
          <el-upload
            disabled
            :file-list="protocolList"
            :action="UPLOAD_IMAGE_URL"
            list-type="picture-card"
            :on-remove="handleRemove2"
            :http-request="myUpload2"
            :multiple="true"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible2">
            <img width="100%" :src="dialogImageUrl2" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="产品详情" prop="name">
          <tinymce v-model="ruleForm.content"></tinymce>
        </el-form-item>
        <el-form-item label="" prop="name">
          <el-button class="ml10" type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
    

    

  </div>
</template>

<script>
import {uploadPic} from '@/api/uploadPic'
import {getUserList, createProject, getProjectInfo} from '@/api/housManagement'
import {UPLOAD_IMAGE_URL, OSS_UPLOAD_BASE_URL} from '@/utils/env'
import tinymce from '@/components/tinymce'
export default {
  components: {tinymce},
  props: {
    houseDetaiId: {
      type: String
    }
  },
  data () {
    return {
      ruleForm: {
        houseName: '', // 房源名称
        borrowUserId: '', // 发标用户
        houseArea: '', // 房源面积
        rentAmount: '', // 出租总额
        houseRent: '', // 年租金
        rentProfit: '', // 租金总差额
        raiseAmount: '', // 募集总额
        minArea: '', // 最低起租面积
        timeImit: '', // 租赁期限
        maxArea: '', // 单笔最高面积
        beginRepayTime: '', // 起租日
        repayType: '', // 还款方式
        isNovice: 0, // 是否新手标 0 否 1 是
        isTest: 2, // 否测试标 1是2否
        isVouchers: 2, // 是否可用现金券 1是2否
        isHot: 2, // 是否首页展示 1是2否
        content: '', // 项目内容
      },
      rules: {},
      /* rules: {
        houseName: [
          { required: true, message: '请输入房源名称', trigger: 'blur' }
        ],
        borrowUserId: [
          { required: true, message: '请选择发标用户', trigger: 'change' }
        ],
        houseArea: [
          { required: true, message: '请输入房屋面积', trigger: 'blur' }
        ],
        rentAmount: [
          { required: true, message: '请输入出租总额', trigger: 'blur' }
        ],
        houseRent: [
          { required: true, message: '请输入年租金', trigger: 'blur' }
        ],
        rentProfit: [
          { required: true, message: '请输入租金总差额', trigger: 'blur' }
        ],
        amount: [
          { required: true, message: '请输入募集总额', trigger: 'blur' }
        ],
        minArea: [
          { required: true, message: '请输入最低起租面积', trigger: 'blur' }
        ],
        timeImit: [
          { required: true, message: '请输入租赁期限', trigger: 'blur' }
        ],
        maxArea: [
          { required: true, message: '请输入最高承租面积', trigger: 'blur' }
        ],
        beginRepayTime: [
          { required: true, message: '请选择起租日', trigger: 'change' }
        ],
        repayType: [
          { required: true, message: '请选择还款方式', trigger: 'change' }
        ]
      }, */
      userListArray: [],
      repayTypeList: [
        {
          value: 1,
          label: '等额本息'
        }, {
          value: 2,
          label: '等额本金'
        }, {
          value: 3,
          label: '先息后本'
        }, {
          value: 4,
          label: '到期结清'
        }
      ],
      mark: '',
      mark1: '',
      mark2: '',
      mark3: '',
      photoList: [], // 房源图片
      protocolList: [], // 协议图片
      dialogImageUrl1: '',
      dialogVisible1: false,
      dialogImageUrl2: '',
      dialogVisible2: false,
      picArray1: [],
      picArray2: [],
      content: '',
      UPLOAD_IMAGE_URL: UPLOAD_IMAGE_URL,
      imgName: 'file',
      userUpload: []
    }
  },
  mounted() {
    this.userList()
    const params = {
      projectId: this.houseDetaiId
    }
    getProjectInfo(params).then(res => {
      console.log(res)
      const data = res.data.data.project
      this.ruleForm = data
      this.ruleForm.houseName = data.projectName
      this.ruleForm.borrowUserId = data.borrUserId
      this.ruleForm.houseRent = data.rent
      this.ruleForm.beginRepayTime = data.beginRentTime
      this.mark = data.houseLabel
      let arr1 = []
      let arr2 = []
      res.data.data.projectImgList.forEach(function(item,index) {
        console.log('item', item)
        console.log(index)
        arr1[index] = {'name': index, url: item}
      })
      res.data.data.dataImgList.forEach(function(item,index) {
        arr2[index] = {'name': index, url: item}
      })
      console.log('res',arr1)
      this.photoList = arr1
      this.protocolList = arr2
    }).catch(err => {
      console.log(err)
    })
  },
  methods: {
    back () {
      this.$emit('houseDetailClickShow')
    },
    myUpload1 (content) {
      uploadPic(content.file).then(res => {
        console.log('上传成功',res)
        this.picArray1.push({name: res.data.data.key})
        console.log(this.picArray1)
      }).catch(err => {
        console.log(err)
        content.onError(`图片上传失败${err}`)
      })
    },
    myUpload2 (content) {
      uploadPic(content.file).then(res => {
        console.log('上传成功',res)
        this.picArray2.push({name: res.data.data.key})
        console.log(this.picArray2)
      }).catch(err => {
        console.log(err)
        content.onError(`图片上传失败${err}`)
      })
    },
    handleRemove1(file, fileList) {
      console.log(file, fileList);
      this.picArray1 = fileList
    },
    handleRemove2(file, fileList) {
      console.log(file, fileList);
      this.picArray2 = fileList
    },
    userList () {
      getUserList().then(res => {
        console.log(res)
        this.userListArray = res.data.data
      }).catch(err => {
        console.lg(err)
      })
    },
    submitForm (formName) {
      this.$emit('houseDetailClickShow')
    }
  }
}
</script>

<style lang="scss" scoped>
.addHouse{
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
}
</style>


