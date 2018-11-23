// 添加房源
<template>
  <div class="addHouse main_content">
    <div class="breadcrumb">
      添加房源
      <i class="el-icon-arrow-right"></i>
      <span class="pointClick" @click="back">返回列表</span>
    </div>
    <div class="mt20">
      <el-form :model="ruleForm" label-width="130px" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
        <el-row>
          <el-col :span="12">
            <el-form-item label="房源名称" prop="projectName">
              <el-input v-model="ruleForm.projectName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="发标用户" prop="borrowUserId">
              <el-select v-model="ruleForm.borrowUserId" placeholder="请选择发标用户">
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
              <el-input type="number" v-model="ruleForm.houseArea"></el-input>㎡
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出租总额" prop="rentAmount">
              <el-input type="number" v-model="ruleForm.rentAmount"></el-input>元
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="年租金" prop="houseRent">
              <el-input type="number" v-model="ruleForm.houseRent"></el-input>¥/㎡
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="租金总差额" prop="rentProfit">
              <el-input type="number" v-model="ruleForm.rentProfit"></el-input>元
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="募集总额" prop="raiseAmount">
              <el-input type="number" v-model="ruleForm.raiseAmount"></el-input>元
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最低起租面积" prop="minArea">
              <el-input type="number" v-model="ruleForm.minArea"></el-input>㎡
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="租赁期限" prop="timeImit">
              <el-input type="number" v-model="ruleForm.timeImit"></el-input>天
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高承租面积" prop="maxArea">
              <el-input type="number" v-model="ruleForm.maxArea"></el-input>㎡
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="起租日" prop="beginRentTime">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.beginRentTime" style="width: 100%;"></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="还款方式" prop="repayType">
              <el-select v-model="ruleForm.repayType" placeholder="请选择还款方式">
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
              <el-radio-group v-model="ruleForm.isNovice">
                <el-radio :label="0">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否测试标" prop="isTest">
              <el-radio-group v-model="ruleForm.isTest">
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

          <el-col :span="12">
            <el-form-item label="是否可用现金券" prop="isVouchers">
              <el-radio-group v-model="ruleForm.isVouchers">
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否首页展示" prop="isHot">
              <el-radio-group v-model="ruleForm.isHot">
                <el-radio :label="2">否</el-radio>
                <el-radio :label="1">是</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义标签1" prop="name">
              <el-input v-model="mark1"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="自定义标签2" prop="name">
              <el-input v-model="mark2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="自定义标签3" prop="name">
              <el-input v-model="mark3"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="房源图片">
          <el-upload
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
          <el-button class="ml10" type="primary" @click="submitForm('ruleForm')">添加合同</el-button>
        </el-form-item>
      </el-form>
    </div>
    

    

  </div>
</template>

<script>
import {uploadPic} from '@/api/uploadPic'
import {getUserList, createProject} from '@/api/housManagement'
import {UPLOAD_IMAGE_URL, OSS_UPLOAD_BASE_URL} from '@/utils/env'
import tinymce from '@/components/tinymce'
export default {
  components: {tinymce},
  data () {
    return {
      ruleForm: {
        projectName: '', // 房源名称
        borrowUserId: '', // 发标用户
        houseArea: '', // 房源面积
        rentAmount: '', // 出租总额
        houseRent: '', // 年租金
        rentProfit: '', // 租金总差额
        raiseAmount: '', // 募集总额
        minArea: '', // 最低起租面积
        timeImit: '', // 租赁期限
        maxArea: '', // 单笔最高面积
        beginRentTime: '', // 起租日
        repayType: '', // 还款方式
        isNovice: 0, // 是否新手标 0 否 1 是
        isTest: 2, // 否测试标 1是2否
        isVouchers: 2, // 是否可用现金券 1是2否
        isHot: 2, // 是否首页展示 1是2否
        content: '', // 项目内容
      },
      rules: {
        projectName: [
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
        raiseAmount: [
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
        beginRentTime: [
          { required: true, message: '请选择起租日', trigger: 'change' }
        ],
        repayType: [
          { required: true, message: '请选择还款方式', trigger: 'change' }
        ]
      },
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
  },
  methods: {
    back () {
      this.$emit('changeAddHouseShow')
    },
    myUpload1 (content) {
      uploadPic(content.file).then(res => {
        console.log('上传成功',res)
        this.picArray1.push({name: res.data.data.key})
        console.log(this.picArray1)
      }).catch(err => {
        this.$message.error(err)
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
        this.$message.error(err)
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
        console.log('userListArray',this.userListArray)
      }).catch(err => {
        console.lg(err)
      })
    },
    submitForm (formName) {
      const _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm.content)
          let houseLabel = [this.mark1, this.mark2 , this.mark3].join(',')  // 自定义标签
          let photoList = this.picArray1.map(item => item.name) // 房源图片
          let protocolList = this.picArray2.map(item => item.name) // 协议资料
          this.ruleForm.houseLabel = houseLabel
          this.ruleForm.photoList = photoList
          this.ruleForm.protocolList = protocolList
          this.ruleForm.userId = this.ruleForm.borrowUserId
          this.ruleForm.borrowName = ''
          this.userListArray.forEach(item => {
            if (item.id === this.ruleForm.borrowUserId) {
              this.ruleForm.borrowName = item.realName
            }
          })
          // this.ruleForm.projectName = this.ruleForm.houseName
          this.ruleForm.beginRentTime = new Date(this.ruleForm.beginRentTime).toUTCString()
          console.log(this.ruleForm)
          // return
          createProject(this.ruleForm).then(res => {
            console.log(res)
            if (res.data.success) {
              _this.$message({
                message: '添加成功',
                type: 'success'
              });
              _this.back()
            } else {
              this.$message({
                message: res.data.msg,
                type: 'warning'
              });
            }
          }).catch(err => {
            this.$message({
              message: '添加失败',
              type: 'warning'
            });
          })
        } else {
          this.$message({
            message: '信息尚未完全填写',
            type: 'warning'
          });
          /* console.log(this.userListArray)
          let houseLabel = [this.mark1, this.mark2 , this.mark3].join(',')  // 自定义标签
          let photoList = this.picArray1.map(item => item.name) // 房源图片
          let protocolList = this.picArray2.map(item => item.name) // 协议资料
          this.ruleForm.houseLabel = houseLabel
          this.ruleForm.photoList = photoList
          this.ruleForm.protocolList = protocolList
          this.ruleForm.beginRepayTime = new Date(this.ruleForm.beginRepayTime).toUTCString()
          return false; */
        }
      });
    }
  }
}
</script>


