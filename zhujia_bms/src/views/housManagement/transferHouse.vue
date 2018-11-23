// 转让房源
<template>
  <div class="transferHouse main_content">
    <!-- <div class="title">查询信息</div> -->
    <div class="data_show clearfix">
      <el-col :span="6">
        所以房源出租总额：{{allRentAmount}}元
      </el-col>
      <el-col :span="6">
        所有房源待收租金总额：{{allToCollectedAmount}}
      </el-col>
    </div>
    <div class="mt20 clearfix">
      <!-- <el-col :span="6">
        房源名称：<el-input v-model="projectName"  placeholder="请输入内容"></el-input>
      </el-col> -->
      <el-col :span="6">
        转让用户：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="6">
        房源ID：<el-input v-model="projectId"  placeholder="请输入内容"></el-input>
      </el-col>  
      <el-col :span="7">
        转让状态：
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
    <div class="mt20 clearfix">
      <el-col :span="6">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
      </el-col> 
    </div>
    
    <!-- 表格 -->
    <el-table
      class="table mt20"
      v-loading="loading"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="borrName"
        label="转让用户">
      </el-table-column>
      <el-table-column
        prop="projectId"
        width="300"
        :show-overflow-tooltip="true"
        label="房源ID">
      </el-table-column>
      <el-table-column
        prop="projectName"
        width="100"
        :show-overflow-tooltip="true"
        label="房源名称">
      </el-table-column>
      <el-table-column
        width="180"
        label="转让时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="到期时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.endRentTime | timesFormart }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="转让面积">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.houseArea }}㎡
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="剩余面积">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.houseArea - scope.row.hasRentArea }}㎡
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rent"
        width="100"
        :show-overflow-tooltip="true"
        label="转让年租金">
        <template slot-scope="scope">
          <span style="">
            {{ scope.row.rent }}¥/㎡
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="转让总额">
        <template slot-scope="scope">
          <span style="" v-if="scope.row.rentAmount == null || scope.row.rentAmount == ''">
            暂无
          </span>
          <span v-else>
            {{scope.row.rentAmount}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="rentProfit"
        label="转让租差">
      </el-table-column>
      <el-table-column
        prop="remainingRentProfit"
        label="剩余租差">
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
        fixed="right"
        prop="status"
        label="转让状态">
        <template slot-scope="scope">
          <span style="">
            {{statusTransfe(scope.row.status)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作">
        <template slot-scope="scope">
          <span class="pointClick red" style="" @click="cancelTransfer(scope.row)" v-if="scope.row.status == 1">
            取消转让
          </span>
          <span style="" v-if="scope.row.status == 2 || scope.row.status == 3">
            无
          </span>
          <span style="" v-if="scope.row.status == 4">
            审核通过
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
import {transferHouse, CancelTransfer} from '@/api/housManagement'
export default {
  data () {
    return {
      allRentAmount: '', // 所有房源出租总额
      allToCollectedAmount: '', // 所有待收租金总额
      userName: '', // 转让用户
      projectId: '', // 房源id
      status: '', // 房源状态
      statusList: [
        {
          value: 1,
          label: '正在转让'
        }, {
          value: 2,
          label: '已转让'
        }, {
          value: 3,
          label: '已取消'
        }, {
          value: 4,
          label: '待审核'
        }
      ],
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0 // 表格总条目数 接口获取
    }
  },
  mounted () {
    const params = { 
    }
    this.pageInit(params)
  },
  methods: {
    // page init
    pageInit (params) {
      const _this = this
      _this.loading = true
      transferHouse(params).then(res => {
        const data = res.data
        console.log(data)
        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.allRentAmount = res.data.data[0].allRentAmount
        _this.allToCollectedAmount = res.data.data[0].allToCollectedAmount
        _this.loading = false
      }).catch(err => {
        this.$message.error('error');
        _this.loading = false
        console.log(err)
      })
    },
    // 重置
    refresh () {
      this.userName = ''
      this.projectId = ''
      this.status = ''
      this.pageInit()
    },
    statusTransfe (status) {
      if (status === 1) {
        return '正在转让'
      } else if (status === 2) {
        return '已转让'
      } else if (status === 3) {
        return '已取消'
      } else if (status === 4) {
        return '待审核'
      }
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = {
        userName: this.userName,
        projectId: this.projectId,
        status: this.status,
        pageNo: val
      }
      this.pageInit(params)
    },
    // search
    search () {
      const params = {
        userName: this.userName,
        projectId: this.projectId,
        status: this.status
      }
      this.pageInit(params)
    }, 
    // 取消转让
    cancelTransfer (val) {
      console.log(val)
      this.$confirm('是否取消转让?', '弹窗', {
        confirmButtonText: '确定取消转让',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('进入了')
        const _this = this
        CancelTransfer(val.id).then(res => {
          console.log('res',res)
          if (res.data.success) {
            this.$message({
              type: 'success',
              message: '取消转让成功!'
            });
            _this.pageInit()
            // _this.$router.push({path: '/housManagement/transferHouse?time=' + new Date().getTime()})
          }
        }).catch(err => {
          this.$message({
            type: 'error',
            message: '取消转让失败!'
          });
        })
        
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    }
  }
}
</script>


