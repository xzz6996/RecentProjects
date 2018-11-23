// 合同管理
<template>
  <div class="houseTrial main_content" v-if="!addContractFlag">
    <div class="title">合同管理</div>
    <div class="operate clearfix">
      <el-col :span="7">
        合同编号：<el-input v-model="serialNo"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        出租用户：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
    </div>
    <div class="clearfix operate mt20">
      <el-col :span="2.5" class="lh40">
        添加/结束时间：
      </el-col>
      <el-col :span="10">
        <el-date-picker
          v-model="timeSelect"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
      <el-button class="ml10" type="primary" @click="search">查询</el-button>
      <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
      <el-button class="ml10" icon="el-icon-plus" type="primary" @click="addContract">添加合同</el-button>
    </div>
    
    <el-table
      class="table"
      :data="tableData"
      stripe
      v-loading="loading"
      style="width: 100%">
      <el-table-column
        prop="serialNo"
        width="300"
        label="合同编号">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="出租用户">
      </el-table-column>
      <el-table-column
        width="200"
        :show-overflow-tooltip="true"
        label="合同详情">
        <template slot-scope="scope">
          <span class="" style="">{{ htmlPlace(scope.row.content) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="添加时间">
        <template slot-scope="scope">
          <span class="" style="">{{ scope.row.createTime | timesFormart }}</span>
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
  <add-contract @addContractFlagClick='addContract' v-else-if="addContractFlag"></add-contract>
</template>

<script>
import {contractManagement} from '@/api/contractManagement'
import addContract from './addContract'
export default {
  components: {addContract},
  data () {
    return {
      loading: true, // 表格加载
      serialNo: '', // 合同编号
      userName: '', // 借款真实名称
      timeSelect: [], // 搜索选择时间
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      addContractFlag: false
    }
  },
  created() {
    const params = {
      
    }
    this.pageInit(params)
  },
  methods: {
    pageInit (params) {
      const _this = this
      contractManagement(params).then(res => {
        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置
    refresh () {
      this.serialNo = ''
      this.userName = ''
      this.itimeSelectd = []
      this.pageInit()
    },
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
    handleEdit(index, row) {
      console.log(index, row);
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
      let params
      if (this.timeSelect === null || this.timeSelect.length === 0) {
        params = {
          serialNo: this.serialNo,
          realName: this.userName
        }
      } else {
        params = {
          serialNo: this.serialNo,
          realName: this.userName,
          startTime: new Date(this.timeSelect[0]).toUTCString(),
          endTime: new Date(this.timeSelect[1]).toUTCString()
        }
      }
      this.pageInit(params)
    },
    addContract () {
      this.pageInit()
      this.addContractFlag = !this.addContractFlag
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
    }
  }
}
</script>

