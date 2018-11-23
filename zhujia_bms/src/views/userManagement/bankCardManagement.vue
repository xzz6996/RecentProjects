// 银行银行卡管理
<template>
  <div class="main_content">
    <div class=" clearfix">
      <el-col :span="7">
        银行名称：<el-input v-model="bankName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="7">
        银行账号：<el-input v-model="cardNo"  placeholder="请输入内容"></el-input>
      </el-col>  
    </div>
    <div class="mt20 clearfix">
      <el-col :span="3" class="lh40">
        开始/结束时间：
      </el-col>
      <el-col :span="9">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="2">&nbsp;</el-col>
      
    </div>
    <div class="clearfix mt20">
      <el-col :span="12">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" @click="deleteBankCard" icon="el-icon-delete">删除银行卡</el-button>
      </el-col> 
    </div>
    
    <!-- 表格 -->
    <el-table
      id="excelExportTable"
      class="table"
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column type="index" label='序号'>
      </el-table-column>
      <el-table-column 
        width="60"
        label="选中">
        <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <!-- <el-table-column
        prop="userName"
        label="用户名">
      </el-table-column> -->
      <el-table-column
        width="100"
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        width="100"
        prop="userType"
        label="用户类型">
        <template slot-scope="scope">
          <span style="">
            {{userTypeTransfer(scope.row.userType)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cardNo"
        width="330"
        label="银行账号">
      </el-table-column>
      <el-table-column
        prop="bankName"
        width="120"
        label="银行名称">
      </el-table-column>
      <el-table-column
        width="180"
        label="创建时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="mt20"
      v-loading="loading"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-size="pageSize"
      layout="prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import {getBankcardListH5, DeleteBankcard} from '@/api/bankCardManagement'
export default {
  data () {
    return {
      templateRadio: '', // radio值
      selectedIndex: 0, // 选中行index
      selectedInfo: null, // 选中行信息
      userName: '', // 用户名
      mobile: null, // 手机号
      cardNo: null, // 银行卡号 
      createTime: '',
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      bankName: null, // 银行名称
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      pageNow: 1 // 当前页
    }
  },
  computed: {
    paramsData () {
      // const userName = this.userName
      const mobile = this.mobile
      const cardNo = this.cardNo
      const bankName = this.bankName
      // 未选择时间
      if (this.createTime === '') {
        return {
          mobile,
          cardNo,
          bankName
        }
      } else {
      // 选择了时间  
        return {
          mobile,
          cardNo,
          bankName,
          startTime: new Date(this.createTime[0]).toUTCString(),
          endTime: new Date(this.createTime[1]).toUTCString()
        }
      }
    }
  },
  mounted () {
    const params = {}
    this.pageInit(params)
  },
  methods: {
    // page init
    pageInit (params) {
      const _this = this
      _this.loading = true
      getBankcardListH5(params).then(res => {
        const data = res.data.data
        console.log(data)

        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置
    refresh () {
      this.bankName = null
      this.mobile = null
      this.cardNo = null
      this.createTime = ''
      this.pageInit()
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = this.paramsData
      this.pageInit(params)
    },
    // 表格用户类型转换
    userTypeTransfer (val) {
      if (val === 1) {
        return '投资客'
      } else if (val === 2) {
        return '个人出租人'
      } else if (val === 3) {
        return '企业出租人'
      }
    },
    // search
    search () {
      const params = this.paramsData
      this.pageInit(params)
    },
    // 删除账户
    deleteBankCard () {
      if (this.templateRadio !== '') {
        this.$confirm('是否确认删除?', '删除银行卡', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log('进入了')
          const _this = this
          const params = {
            id: _this.selectedInfo.id
          }
          DeleteBankcard(params).then(res => {
            console.log('res',res)
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.tableData.splice(_this.selectedIndex, 1)
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });          
        });
      } else {
        this.$message({
          type: 'error',
          message: '未选择任何条目!'
        });
      }
    },
    getTemplateRow (index, val) {
      this.selectedInfo = val
      this.selectedIndex = index
      console.log(this.selectedInfo)
      return val
    }
  }
}
</script>

<style scoped lang="scss">
.line{
  text-align: center;
  line-height: 40px;
}
</style>



