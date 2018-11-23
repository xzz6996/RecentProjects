// 提现记录
<template>
  <div class="main_content">
    <div class="title">查询信息</div>
    <div class=" clearfix">
      <el-col :span="7">
        用户名：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="7">
        真实姓名： <el-input v-model="realName"  placeholder="请输入内容"></el-input>
      </el-col>  
    </div>
    <div class="mt20 clearfix">
      <el-col :span="3" class="lh40">
        开始/结束时间：
      </el-col>
      <el-col :span="11">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="7">
        提现状态：
        <el-select v-model="status" placeholder="请选择">
          <el-option
            v-for="item in statusList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col> 
    </div>
    <div class="clearfix mt20">
      
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" @click="exportExcel" icon="el-icon-plus">导出表格</el-button>
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
      <el-table-column
        prop="userName"
        label="用户名">
      </el-table-column>
      <el-table-column
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
        label="提现状态">
        <template slot-scope="scope">
          <span style="" :class="{red: scope.row.status === 1 || scope.row.status === 3}">
            {{statusTransfer(scope.row, scope.row.status)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="withdrawalsBank"
        label="提现银行">
      </el-table-column>
      <el-table-column
        prop="withdrawalsAmount"
        label="提现总额">
      </el-table-column>
      <el-table-column
        width="120"
        prop="actualAmount"
        label=" 实际到账金额">
      </el-table-column>
      <el-table-column
        width="150"
        label="提现申请时间">
        <template slot-scope="scope">
          <span style="" >
            {{scope.row.applyTime | timesFormart}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label=" 审核打款时间">
        <template slot-scope="scope">
          <span style="" >
            {{scope.row.auditTime | timesFormart}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        prop="auditPer"
        label=" 审核打款人员">
      </el-table-column>
      <el-table-column
        fixed="right"
        label=" 操作">
        <template slot-scope="scope">
          <span style="" v-if="scope.row.status === 1" @click="auditWithdrawal(scope.row)" :class="{red: scope.row.status === 1}">
            {{statusOperate(scope.row, scope.row.status)}}
          </span>
          <span style="" v-else :class="{red: scope.row.status === 1}">
            {{statusOperate(scope.row, scope.row.status)}}
          </span>
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
import {presentRecord, AuditWithdrawal} from '@/api/presentRecord'
import {BASE_URL} from '@/utils/env'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  data () {
    return {
      id: '', // 房源id
      userName: '', // 用户名
      mobile: '', // 手机号
      realName: '', // 流水号
      createTime: '',      
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      status: '', // 状态 1待审核打款2已打款3审核不通过4用户取消
      statusList: [ // 充值类型
        {
          label: '待审核打款',
          value: 1,
        }, {
          label: '已打款',
          value: 2,
        }, {
          label: '审核不通过',
          value: 3,
        }, {
          label: '用户取消',
          value: 4,
        }
      ],
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      pageNow: 1
    }
  },
  computed: {
    paramsData () {
      const userName = this.userName
      const mobile = this.mobile
      const realName = this.realName
      // 未选择时间
      if (this.createTime === null || this.createTime === '') {
        if (this.status === '') {
          return {
            userName,
            realName,
            mobile,
            status
          }
        } else if (this.status !== '') {
          return {
            userName,
            realName,
            mobile,
            status: this.status
          }
        }
      } else {
      // 选择了时间  
        if (this.status === '') {
          return {
            userName,
            realName,
            mobile,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
        } else if (this.status !== '') {
          return {
            userName,
            realName,
            mobile,
            status: this.status,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
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
      presentRecord(params).then(res => {
        const data = res.data
        console.log(data)
        _this.tableData = res.data.data
        _this.total = res.data.count
        console.log(_this.total)
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = Object.assign({
        pageNo: val
      }, this.paramsData)
      this.pageNow = val
      this.pageInit(params)
    },
    // search
    search () {
      let params = this.paramsData
      this.pageInit(params)
    },
    statusTransfer (obj,val) {
      if (val === 1) {
        return '待审核打款'
      } else if (val === 2) {
        return '已打款'
      } else if (val === 3) {
        return '审核不通过'
      } else if (val === 4) {
        return '用户取消'
      }
    },
    statusOperate (obj,val) {
      if (val === 1) {
        return '审核打款'
      } else  {
        return '无'
      }
    },
    encodeSearchParams (obj) {
      const params = []
      Object.keys(obj).forEach((key) => {
        let value = obj[key]
        if (typeof value === 'undefined') {
          value = ''
        }
        params.push([key, encodeURIComponent(value)].join('='))
      })
      return params.join('&')
    },
    // 导出excel
    exportExcel () {
      let params = this.paramsData
      params = Object.assign({
        pageSize: 20,
        pageNo: this.pageNow,
        sort: 'create_time',
      }, params)
      window.open(`${BASE_URL}/account/exceptWithdrawalRecordList?${this.encodeSearchParams(params)}`)
    },
    // 审核打款
    auditWithdrawal (val) {
      console.log(val)
      this.$confirm('是否确认审核?', '弹窗', {
        confirmButtonText: '确定审核',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('进入了')
        const _this = this
        AuditWithdrawal(val.id).then(res => {
          console.log('res',res)
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            _this.$router.push({path: '/userManagement/presentRecord'})
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '审核失败!'
          });
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        });          
      });
    }
  }
}
</script>