// 所有房源
<template>
  <div class="allHouse main_content" v-if="!showTenantDetail">
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
      <el-col :span="6">
        房源用户：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col> 
      <el-col :span="6">
        房源ID：<el-input v-model="projectId"  placeholder="请输入内容"></el-input>
      </el-col>  
      <el-col :span="7">
        房源状态：
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
        label="房源用户">
      </el-table-column>
      <el-table-column
        prop="projectId"
        width="300"
        :show-overflow-tooltip="true"
        label="房源ID">
      </el-table-column>
      <el-table-column
        prop="projectName"
        width="150"
        :show-overflow-tooltip="true"
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
        label="到期时间">
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
        label="房源状态">
        <template slot-scope="scope">
          <span >
            {{statusTransfer(scope.row.status)}}
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
  <tenant-record v-else-if="showTenantDetail" @houseDetailClickShow="changeShowTenantDetail" :detailProjectId="detailProjectId"></tenant-record>
</template>

<script>
import {allHouse} from '@/api/housManagement'
import tenantRecord from './tenantRecord'
export default {
  components: {tenantRecord},
  data () {
    return {
      showTenantDetail: false,
      detailProjectId: '',
      allRentAmount: '', // 所有房源出租总额
      allToCollectedAmount: '', // 所有待收租金总额
      userName: null, // 转让用户
      projectId: null, // 房源id
      status: 0, // 房源状态
      createTime: [],      
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      statusList: [
        {
          value: 0,
          label: '待审核'
        }, {
          value: 2,
          label: '募集中'
        }, {
          value: 3,
          label: '收租中'
        }, {
          value: 4,
          label: '转让中'
        }, {
          value: 5,
          label: '已结束'
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
      allHouse(params).then(res => {
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
      this.userName = null
      this.projectId = null
      this.status = 0
      this.createTime = []
      this.pageInit()
    },
    statusTransfer (status) {
      if (status === 0) {
        return '待审核'
      } else if (status === 2) {
        return '募集中'
      } else if (status === 3) {
        return '收租中'
      } else if (status === 4) {
        return '转让中'
      } else if (status === 5) {
        return '已结束'
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
      let params
      // console.log(this.createTime)
      // return
      if (this.createTime === null || this.createTime.length === 0) {
        params = {
          userName: this.userName,
          projectId: this.projectId,
          status: this.status
        }
      } else {
        params = {
          userName: this.userName,
          projectId: this.projectId,
          status: this.status,
          startTime: new Date(this.createTime[0]).toUTCString(),
          endTime: new Date(this.createTime[1]).toUTCString()
        }
      }
      this.pageInit(params)
    },
    // 查看详情
    tenantDetail (val) {
      console.log(val)
      this.detailProjectId = val.projectId
      this.showTenantDetail = true
    },
    changeShowTenantDetail () {
      this.showTenantDetail = !this.showTenantDetail
    }
  }
}
</script>


