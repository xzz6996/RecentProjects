// 房源初审
<template>
  <div class="main_content" v-if="!addHouseShow && !houseDetailShow">
    <div class="title">查询信息</div>
    <div class="operate clearfix">
      <el-col :span="6">
        房源名称：<el-input v-model="projectName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="6">
        房源用户：<el-input v-model="borrName"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="6">
        房源ID：<el-input v-model="id"  placeholder="请输入内容"></el-input>
      </el-col>  
      <el-col class="mt20" :span="24">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" icon="el-icon-plus" @click="addHouseClick">添加</el-button>
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
        prop="id"
        width="300"
        label="房源ID">
      </el-table-column>
      <el-table-column
        prop="borrName"
        label="房源用户">
      </el-table-column>
      <el-table-column
        prop="projectName"
        width="200"
        label="房源名称">
      </el-table-column>
      <el-table-column
        prop="status"
        label="房源状态">
        <template slot-scope="scope">
          <span class="red" style="">{{ housStatusChange(scope.row.status) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="申请时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.beginRentTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="添加时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="计划到期时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.endRentTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="实际还款时间">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.paymentTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="timeLimit"
        label="租赁期限">
      </el-table-column>
      <el-table-column
        prop="rentProfit"
        label="总租差">
      </el-table-column>
      <el-table-column
        prop="repayType"
        label="还款方式">
      </el-table-column>
      <el-table-column
        fixed="right"
        label="房源详情">
        <template slot-scope="scope">
          <span @click="houseDetailClick(scope.$index, scope.row)" class="pointClick red">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column 
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <span  @click="auditProject(scope.row)" class="pointClick red">审核通过</span>
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
  <add-house v-else-if="addHouseShow" @changeAddHouseShow="addHouseClick"></add-house>
  <house-detail v-else-if="houseDetailShow" @houseDetailClickShow="houseDetailClickShow" :houseDetaiId="houseDetaiId"></house-detail>
</template>

<script>
import {houseTrial, AuditProject} from '@/api/housManagement'
import addHouse from './newAddHouse'
import houseDetail from './houseDetail'
export default {
  components: {addHouse, houseDetail},
  data () {
    return {
      addHouseShow: false,
      houseDetailShow: false,
      id: '', // 房源id
      projectName: '', // 房源名称
      borrName: '', // 房源用户
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      houseDetaiId: '', // 查看房源详情所需id
    }
  },
  mounted () {
    const params = {
      status: 0
    }
    this.pageInit(params)
  },
  methods: {
    // page init
    pageInit (params) {
      const _this = this
      _this.loading = true
      houseTrial(params).then(res => {
        const data = res.data
        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        this.$message.error('error');
        _this.loading = false
        console.log(err)
      })
    },
    // 重置
    refresh () {
      this.projectName = ''
      this.borrName = ''
      this.id = ''
      this.pageInit()
    },
    // 表格审核状态
    housStatusChange (status) {
      if (status === 0) {
        return '待审'
      } else if (status === 7) {
        return '审核失败'
      } else if (status === 8) {
        return '投资中'
      } else if (status === 9) {
        return '已满标'
      }
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = {
        pageNo: val
      }
      this.pageInit(params)
    },
    // search
    search () {
      const params = {
        projectId: this.id,
        projectName: this.projectName,
        borrName: this.borrName
      }
      this.pageInit(params)
    },
    // 查看详情
    houseDetailClick(index, row) {
      console.log(index, row);
      this.houseDetailShow = !this.houseDetailShow
      this.houseDetaiId = row.projectId 
    },
    houseDetailClickShow () {
      this.houseDetailShow = !this.houseDetailShow
    },
    // 审核房源
    auditProject (val) {
      console.log(val)
      AuditProject(val.projectId).then(res => {
        console.log(res)
        if (res.data.success) {
          this.$message({
            message: '审核成功',
            type: 'success'
          })
          this.pageInit()
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('审核失败');
      })
    },
    // 添加房源
    addHouseClick () {
      this.pageInit()
      this.addHouseShow = !this.addHouseShow
    }
  }
}
</script>

