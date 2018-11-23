<template>
  <div class="houseTrial main_content" v-if="!showTenantDetail">
    <div class="title">查询信息</div>
    <div class="operate clearfix">
      <el-col :span="6" >
        房源名称：<el-input v-model="projectName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="6">
        房源用户：<el-input v-model="borrName"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="6">
        房源ID：<el-input v-model="id"  placeholder="请输入内容"></el-input>
      </el-col>  
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
      </el-col> 
    </div>
    
    
    <el-table
      class="table"
      :data="tableData"
      stripe
      v-loading="loading"
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
        width="180"
        label="申请时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="添加时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.endRentTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="房屋面积 ">
        <template slot-scope="scope">
          <span style="">{{ scope.row.houseArea }}㎡</span>
        </template>
      </el-table-column>
      <el-table-column
        label="年租金">
        <template slot-scope="scope">
          <span style="">{{ scope.row.rent }}¥/㎡</span>
        </template>
      </el-table-column>
      <el-table-column
        label="租赁总额 ">
        <template slot-scope="scope">
          <span style="">{{ scope.row.rentAmount | moneyFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rentProfit"
        label="总租差">
      </el-table-column>
      <el-table-column
        label="收租方式">
        <template slot-scope="scope">
          <span>每日收租</span>
        </template>
      </el-table-column>
      <el-table-column
        label="租金收益">
        <template slot-scope="scope">
          <span>按日分配</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110"
        label="是否新手专享">
        <template slot-scope="scope">
          <span v-if="scope.row.isNovice == 1">是</span>
          <span v-if="scope.row.isNovice == 0">不是</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="租赁记录">
        <template slot-scope="scope">
          <span class="red pointClick" style="text-decoration: underline;" @click="tenantDetail(scope.row)">查看详情</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <span class="red pointClick" @click="cancelProject(scope.row)">
            撤回
          </span>
        </template>
      </el-table-column>
    </el-table>
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
  <tenant-record v-else-if="showTenantDetail" @houseDetailClickShow="changeShowTenantDetail" :detailProjectId="detailProjectId"></tenant-record>
</template>

<script>
import {houseTrial, CancelProject} from '@/api/housManagement'
import tenantRecord from './allHouse/tenantRecord'
export default {
  components: {tenantRecord},
  data () {
    return {
      showTenantDetail: false,
      detailProjectId: '',
      id: '', // 房源id
      projectName: '', // 房源名称
      borrName: '', // 房源用户
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0 // 表格总条目数 接口获取
    }
  },
  mounted () {
    // table init
    const params = {
      status: 2
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
      this.projectName = ''
      this.borrName = ''
      this.id = ''
      this.pageInit()
    },
    // table 审核状态
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
    handleEdit (index, row) {
      console.log(index, row);
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = {
        projectId: this.id,
        projectName: this.projectName,
        borrName: this.borrName,
        pageNo: val,
        status: 2
      }
      this.pageInit(params)
    },
    // search
    search () {
      const params = {
        projectId: this.id,
        projectName: this.projectName,
        borrName: this.borrName,
        status: 2
      }
      this.pageInit(params)
    },
    // 查看详情
    tenantDetail (val) {
      console.log(val)
      this.detailProjectId = val.projectId
      this.showTenantDetail = true
    },
    cancelProject (val) {
      console.log(val)
      this.$confirm('是否撤回?', '弹窗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('进入了')
        const _this = this
        CancelProject(val.id).then(res => {
          console.log('res',res)
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '撤回成功!'
            });
            _this.pageInit()
            // _this.$router.push({path: '/housManagement/transferHouse?time=' + new Date().getTime()})
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '撤回失败!'
          });
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消审核'
        });          
      });
    },
    changeShowTenantDetail () {
      this.showTenantDetail = !this.showTenantDetail
    }
  }
}
</script>

