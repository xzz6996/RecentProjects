<!-- 已结清列表-->
<template>
  <div class="main_content">
    <div class=" clearfix">
      <el-col :span="7">
        用户名：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col>
    </div>
    <div class="mt20 clearfix">
      <el-col :span="4" class="lh40">注册开始/结束时间</el-col>
      <el-col :span="10">
        <el-date-picker v-model="createTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" :default-time="['00:00:00', '23:59:59']">
        </el-date-picker>
      </el-col>
      <el-col :span="7">
        <el-button type="primary" @click="search">查询</el-button>
      </el-col>
    </div>

    <!-- 表格 -->
    <el-table class="table" v-loading="loading" :data="tableData" stripe style="width: 100%" >
      <el-table-column type="index" width="40"></el-table-column>
      <el-table-column prop="userName" width="120" label="借款房源用户"></el-table-column>
      <el-table-column prop="projectName" width="120" label="房源名称"></el-table-column>
      <el-table-column prop="timeLimit" width="120" label="出租期限"></el-table-column>
      <el-table-column prop="houseArea" width="120" label="出租面积"></el-table-column>
      <el-table-column prop="rentAmount" width="120" label="出租金额"></el-table-column>
      <el-table-column prop="rentProfit" width="120" label="应收租差"></el-table-column>
      <el-table-column prop="hasRepayAmount" width="150" label="已收金额(租金）"></el-table-column>
      <el-table-column prop="underRepayAmount" width="150" label="待收金额(租金）"></el-table-column>
      <el-table-column  width="120" label="到期时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.repayTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="hasRepayLimit" width="120" label="已收期数"></el-table-column>
      <el-table-column prop="status" width="120" label="收租状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 0"  type="text" size="small" >
            {{htmlPlace('还款中')}}
          </el-button>
          <el-button v-if="scope.row.status === 1"  type="text" size="small" style="color: red">
            {{htmlPlace('已结清')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="mt20" v-loading="loading" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import {repayListEnd} from '@/api/repayList'
export default {
  data(){
    return{
      userName:null,
      mobile:null,
      createTime:'',
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      loading: true, // 表格加载
      tableData: null, // 表格数据
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      pageNow: 1 // 当前页
    }
  },
  mounted () {
    const params = {}
    this.pageInit(params)
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
          startTime: this.getNowFormatDate(this.createTime[0]),
          endTime: this.getNowFormatDate(this.createTime[1])
        }
      }
    }
  },
  methods:{
    pageInit (params) {
      const _this = this
      _this.loading = true

      console.log(params)
      repayListEnd(params).then(res => {
        const data = res.data
        console.log(data)
        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    search () {
      const params = this.paramsData
      console.log(params)
      this.pageInit(params)
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
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
  }
}
</script>
<style lang="scss" scoped>
  .line{
    text-align: center;
    line-height: 40px;
  }
</style>
