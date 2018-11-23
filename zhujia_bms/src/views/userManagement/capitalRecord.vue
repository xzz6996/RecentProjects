// 用户资金记录
<template>
  <div class="capitalRecord main_content">
    <div class="title">查询信息</div>
    <div class=" clearfix">
      <el-col :span="7">
        用户名：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="7">
        用户类型：
        <el-select v-model="userType" placeholder="请选择">
          <el-option
            v-for="item in userTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
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
        交易类型：
        <el-select v-model="transferType" placeholder="请选择">
          <el-option
            v-for="item in transferTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col> 
    </div>
    <div class="clearfix mt20">
      
      <el-col :span="12">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" @click="exportExcel" icon="el-icon-plus">
          导出表格
        </el-button>
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
        width="120"
        prop="userName"
        :show-overflow-tooltip="true"
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
        width="90"
        prop="userType"
        label="用户类型">
        <template slot-scope="scope">
          <span style="">
            {{userTypeTransfer(scope.row.userType)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="交易类型">
        <template slot-scope="scope">
          <span style="">
            {{transferTypeTransfer(scope.row.type)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="交易时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="交易金额">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.applyAmount != '' && scope.row.applyAmount != null">
            {{ scope.row.applyAmount | moneyFormart }}
          </span>
          <span style="margin-left: 10px" v-else>
            无
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        :show-overflow-tooltip="true"
        label="可用余额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.accountUsable | moneyFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        :show-overflow-tooltip="true"
        label=" 账户总额">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.accountTotal | moneyFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="150"
        prop="remark"
        :show-overflow-tooltip="true"
        label="备注">
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
import {capitalRecord} from '@/api/capitalRecord'
import {BASE_URL} from '@/utils/env'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  data () {
    return {
      id: '', // 房源id
      userName: '', // 用户名
      mobile: '', // 手机号
      userType: '', // 用户类型
      userTypeList: [ // 用户类型列表
        {
          label: '投资客',
          value: 1,
        }, {
          label: '个人出租人 ',
          value: 2,
        }, {
          label: '企业出租人 ',
          value: 3,
        }
      ],
      createTime: '',      
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      transferType: '', // 交易类型
      transferTypeList: [ // 交易类型列表
        {
          label: '充值',
          value: 1,
        }, {
          label: '提现',
          value: 2,
        }, {
          label: '承租',
          value: 3,
        }, {
          label: '转让',
          value: 4,
        }, {
          label: '租金收益',
          value: 5,
        }
        , {
          label: '收取租金',
          value: 6,
        }
        , {
          label: '奖励承租',
          value: 30,
        }
      ],
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      pageNow: 1 // 当前页
    }
  },
  computed: {
    paramsData () {
      const userName = this.userName
      const mobile = this.mobile
      // 未选择时间
      if (this.createTime === '' || this.createTime === null) {
        if (this.userType === '' && this.transferType === '') {
          return {
            userName,
            mobile
          }
        } else if (this.userType !== '' && this.transferType === '') {
          return {
            userName,
            mobile,
            userType: this.userType
          }
        } else if (this.userType === '' && this.transferType !== '') {
          return {
            userName,
            mobile,
            transferType: this.transferType
          }
        } else if (this.userType !== '' && this.transferType !== '') {
          return {
            userName,
            mobile,
            userType: this.userType,
            transferType: this.transferType
          }
        }
      } else {
      // 选择了时间  
        if (this.userType === '' && this.transferType === '') {
          return {
            userName,
            mobile,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
        } else if (this.userType !== '' && this.transferType === '') {
          return {  
            userName,
            mobile,
            userType: this.userType,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
        } else if (this.userType === '' && this.transferType !== '') {
          return {
            userName,
            mobile,
            transferType: this.transferType,
            startTime: new Date(this.createTime[0]).toUTCString(),
            endTime: new Date(this.createTime[1]).toUTCString()
          }
        } else if (this.userType !== '' && this.transferType !== '') {
          return {
            userName,
            mobile,
            userType: this.userType,
            transferType: this.transferType,
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
    console.log(document.body.offsetHeight)
  },
  methods: {
    // page init
    pageInit (params) {
      const _this = this
      _this.loading = true
      capitalRecord(params).then(res => {
        const data = res.data
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
      this.userName = ''
      this.mobile = ''
      this.userType = ''
      this.createTime = ''
      this.transferType = ''
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
      console.log(this.paramsData)
      const params = Object.assign({
        pageNo: val
      }, this.paramsData)
      console.log(params)
      this.pageNow = val
      this.pageInit(params)
    },
    // search
    search () {
      let params = this.paramsData
      console.log(this.createTime)
      this.pageInit(params)
    },
    userTypeTransfer (val) {
      if (val === 1) {
        return '投资客'
      } else if (val === 2) {
        return '个人出租人'
      } else if (val === 3) {
        return '企业出租人'
      }
    },
    transferTypeTransfer (val) {
      if (val === 1) {
        return '充值'
      } else if (val === 2) {
        return '提现 '
      } else if (val === 3) {
        return '承租'
      } else if (val === 4) {
        return '转让'
      } else if (val === 5) {
        return '租金收益'
      } else if (val === 6) {
        return '收取租金'
      } else if (val === 10) {
        return '奖励'
      }
    }, 
    // 导出表格拼接字符串
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
      window.open(`${BASE_URL}/account/exceptAccountLogList?${this.encodeSearchParams(params)}`)
    }
  }
}
</script>

