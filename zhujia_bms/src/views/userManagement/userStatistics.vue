// 用户统计
<template>
  <div class="main_content">
    <div class=" clearfix">
      <el-col :span="7">
        未对接口
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
      <el-col :span="10">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
    </div>
    
    <!-- 表格 -->
    <el-table
      class="table"
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      
      <el-table-column
        prop=""
        label="渠道来源">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop=""
        width="120"
        label="姓名">
      </el-table-column>
      <el-table-column
        width="180"
        label="注册时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="首次承租时间">
      </el-table-column>
      <el-table-column
        prop=""
        label="承租次数">
      </el-table-column>
      <el-table-column
        prop=""
        label="承租总金额">
      </el-table-column>
      <el-table-column
        prop=""
        label="收租中金额">
      </el-table-column>
      <el-table-column
        prop=""
        label="充值金额">
      </el-table-column>
      <el-table-column
        prop=""
        label="提现金额">
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
import {accountInformation, deleteUser} from '@/api/accountInformation'
export default {
  data () {
    return {
      userName: '', // 用户名
      mobile: '', // 手机号
      createTime: '',
      startTime: '', // 开始时间
      endTime: '', // 结束时间

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
      if (this.createTime === '') {
        return {
          userName,
          mobile
        }
      } else {
      // 选择了时间  
        return {
          userName,
          mobile,
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
      accountInformation(params).then(res => {
        const data = res.data
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
      const params = this.paramsData
      this.pageInit(params)
    },
    // search
    search () {
      const params = this.paramsData
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



