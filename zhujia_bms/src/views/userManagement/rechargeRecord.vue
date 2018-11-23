// 用户充值记录
<template>
  <div class="rechargeRecord main_content">
    <div class="title">查询信息</div>
    <div class=" clearfix">
      <el-col :span="7">
        用户名：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="7">
        流水号： <el-input v-model="mchntorderId"  placeholder="请输入内容"></el-input>
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
        充值类型：
        <el-select v-model="rechargeType" placeholder="请选择">
          <el-option
            v-for="item in rechargeTypeList"
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
        width="100"
        prop="mchntorderId"
        :show-overflow-tooltip="true"
        label="流水号">
      </el-table-column>
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
        label="充值类型">
        <template slot-scope="scope">
          <span style="" >
            {{rechargeTypeTransfer(scope.row.rechargeType)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="money"
        label="充值金额">
        <template slot-scope="scope">
          <span style="" >
            {{scope.row.money | moneyFormart}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        label="充值时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.rechargeTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="充值接口">
        <template slot-scope="scope">
          <span style="" >
            {{typeTransfer(scope.row.type)}}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        width="150"
        label="审核时间">
        <template slot-scope="scope">
          <span style="color: red" v-if="scope.row.auditTime === ''">
            待审核
          </span>
          <span style="" v-else>
            {{scope.row.auditTime |timesFormart}}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        label="审核人员">
        <template slot-scope="scope">
          <span style="" v-if="scope.row.auditPer === ''">
            暂无
          </span>
          <span style="">
            {{scope.row.auditPer}}
          </span>
        </template>
      </el-table-column>

      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <span class="pointClick red" @click="auditRecharge(scope.row)"  v-if="scope.row.status == 2">
            审核通过
          </span>
          <span v-else>
            {{statusTransfer(scope.row,scope.row.status)}}
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
import {rechargeRecord, AuditRecharge} from '@/api/rechargeRecord'
import {BASE_URL} from '@/utils/env'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  data () {
    return {
      id: '', // 房源id
      userName: '', // 用户名
      mobile: '', // 手机号
      mchntorderId: '', // 流水号
      createTime: '',      
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      rechargeType: '', // 充值类型1线上充值2线下充值
      rechargeTypeList: [ // 充值类型
        {
          label: '线上充值充值',
          value: 1,
        }, {
          label: '线下充值',
          value: 2,
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
      const mchntorderId = this.mchntorderId
      // 未选择时间
      if (this.createTime === null || this.createTime === '') {
        if (this.rechargeType === '') {
          return {
            userName,
            mobile,
            mchntorderId
          }
        } else if (this.rechargeType !== '') {
          return {
            userName,
            mobile,
            mchntorderId,
            rechargeType: this.rechargeType
          }
        }
      } else {
      // 选择了时间  
        if (this.rechargeType === '') {
          return {
            userName,
            mobile,
            mchntorderId,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
        } else if (this.rechargeType !== '') {
          return {
            userName,
            mobile,
            mchntorderId,
            rechargeType: this.rechargeType,
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
      rechargeRecord(params).then(res => {
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
    rechargeTypeTransfer (val) {
      if (val === 1) {
        return '线上充值'
      } else if (val === 2) {
        return '线下充值'
      }
    },
    typeTransfer (val) {
      if (val === 1) {
        return '富友'
      }
    },
    statusTransfer (obj,val) {
      if (val === 0) {
        return '失败'
      } else if (val === 1) {
        return '成功'
      } else if (val === 2) {
        return '审核中'
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
    exportExcel () {
      let params = this.paramsData
      params = Object.assign({
        pageSize: 20,
        pageNo: this.pageNow,
        sort: 'create_time',
      }, params)
      window.open(`${BASE_URL}/account/exceptRechargeRecordList?${this.encodeSearchParams(params)}`)
    },
    // 审核充值
    auditRecharge (val) {
      console.log(val)
      this.$confirm('是否确认审核?', '弹窗', {
        confirmButtonText: '确认审核',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('进入了')
        const _this = this
        AuditRecharge(val.id).then(res => {
          console.log('res',res)
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '审核成功!'
            });
            _this.$router.go(0)
            // _this.$router.push({path: '/housManagement/transferHouse?time=' + new Date().getTime()})
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

