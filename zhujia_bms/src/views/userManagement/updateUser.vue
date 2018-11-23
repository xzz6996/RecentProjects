<template>
  <div class="updateUser">
    <div class="breadcrumb">
      修改账户信息
      <i class="el-icon-arrow-right"></i>
      <span class="pointClick" @click="back">返回列表</span>
    </div>

    <el-form :model="selectedInfo" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm mt20">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="selectedInfo.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model="selectedInfo.realName"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="number" maxlength="11" v-model="selectedInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item label="用户类型" prop="userType">
        <el-input v-model="selectedInfo.userType" disabled></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-select v-model="selectedInfo.sex" placeholder="性别">
          <el-option
            v-for="item in sexList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="证件号" prop="documentCode">
        <el-input v-model="selectedInfo.documentCode" type="number"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="back">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {updateUser} from '@/api/accountInformation'
export default {
  props: {
    selectedInfo: {
      type: Object
    }
  },
  data () {
    let checkPhone = (rule, value, callback) => {
      if (value.length < 11 && value > 0) {
        return callback(new Error('手机格式不正确'));
      } else {
        callback();
      }
    }
    return {
      rules: {
        mobile: [
          {validator: checkPhone, trigger: 'blur'}
        ]
      },
      sexList: [
        {
          value: 0,
          label: '未知'
        }, {
          value: 1,
          label: '男'
        }, {
          value: 2,
          label: '女'
        }
      ]
      
    }
  },
  methods: {
    back () {
      this.$emit('editorAccountClick')
    },
    submitForm (ruleForm) {
      console.log(this.selectedInfo)
      this.$confirm('是否确认修改?', '弹窗', {
        confirmButtonText: '确认修改',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('进入了')
        const _this = this
        _this.selectedInfo.createTime = new Date(_this.selectedInfo.createTime).toUTCString()
        updateUser(_this.selectedInfo).then(res => {
          console.log('res',res)
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '修改成功!'
            });
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '修改失败!'
          });
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消修改'
        });          
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.updateUser{
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
  .red{
    color: red
  }
}
</style>
