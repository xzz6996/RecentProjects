// 用户承租记录
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
        承租状态：
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
        width="150"
        prop="projectName"
        :show-overflow-tooltip="true"
        label="承租房源名称">
      </el-table-column>
      <el-table-column
        width="160"
        label="承租时间">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.beginRentTime | timesFormart }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rentAmount"
        label="承租金额">
      </el-table-column>
      <el-table-column
        label="承租期限">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.rentTerm }}天
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="160"
        label="承租到期时间">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.endRentTime | timesFormart }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="承租状态">
        <template slot-scope="scope">
          <span style="">
            {{ rentStatusTransfer(scope.row.rentStatus) }}
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
import {tenantRecord} from '@/api/tenantRecord'
import {BASE_URL} from '@/utils/env'
export default {
  data () {
    return {
      userName: null, // 用户名
      mobile: null, // 手机号
      createTime: '',      
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      status: null, // 承租状态
      statusList: [ // 承租状态列表
        {
          label: 'all',
          value: null,
        }, {
          label: '承租中',
          value: 0,
        }, {
          label: '承租成功',
          value: 1,
        }, {
          label: '已结束',
          value: 2,
        }, {
          label: '已取消',
          value: 3,
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
      const status = this.status
      // 未选择时间
      if (this.createTime === null ||this.createTime === '') {
        return {
          userName,
          mobile,
          status
        }
      } else {
        return {
          userName,
          mobile,
          status,
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
      tenantRecord(params).then(res => {
        const data = res.data
        console.log(data)
        _this.tableData = res.data.data
        _this.total = res.data.count
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
      console.log('userName',this.userName)
      let params = this.paramsData
      console.log(params)
      this.pageInit(params)
    },
    rentStatusTransfer (val) {
      if (val === 1) {
        return '承租中'
      } else if (val === 2) {
        return '取消承租'
      } else if (val === -2) {
        return '取消承租'
      } else if (val === 3) {
        return '成功承租'
      } else if (val === 4) {
        return '成功承租'
      } else if (val === 5) {
        return '已结束'
      } else {
        return '未知'
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
      window.open(`${BASE_URL}/rentUser/exceptRentProjectRecordList?${this.encodeSearchParams(params)}`)
    }
  }
}
</script>


