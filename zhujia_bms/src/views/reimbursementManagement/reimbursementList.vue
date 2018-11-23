<!--还款中列表-->
<template>
  <div class="main_content" v-if="record===true">
    <div class=" clearfix">
      <el-col :span="7">
        房源用户：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        收租状态：
        <el-select v-model="status" placeholder="请选择" @change="statusLists">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-col>
    </div>
    <div class="mt20 clearfix">
      <el-col :span="4" class="lh40">到期开始/结束时间</el-col>
      <el-col :span="10">
        <el-date-picker v-model="createTime" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
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
      <el-table-column  width="120" label="出租期限">
        <template slot-scope="scope">
          <span style="">{{scope.row.timeLimit+'天'}}</span>
        </template>
      </el-table-column>
      <el-table-column  width="120" label="出租面积">
        <template slot-scope="scope">
          <span style="">{{scope.row.houseArea+'㎡'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rentAmount" width="120" label="出租金额"></el-table-column>
      <el-table-column prop="rentProfit" width="120" label="应收租差"></el-table-column>
      <el-table-column prop="hasRepayAmount" width="150" label="已收金额(租金）"></el-table-column>
      <el-table-column prop="underRepayAmount" width="150" label="待收金额(租金）"></el-table-column>
      <el-table-column  width="120" label="到期时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.repayTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120" label="已收期数">
        <template slot-scope="scope">
          <span style="">{{scope.row.hasRepayLimit+'/'+scope.row.timeLimit}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="120" label="收租状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 3"  type="text" size="small">
            {{htmlPlace('待收租')}}
          </el-button>
          <el-button v-if="scope.row.status === 4"  type="text" size="small" style="color: red">
            {{htmlPlace('收租中')}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="status" width="120" label="操作">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 3"  type="text" size="small" style="color: red" @click="affirmRepayClick(scope.row)">
            {{htmlPlace('确认还款收租')}}
          </el-button>
          <el-button v-if="scope.row.status !== 3"  type="text" size="small">
            {{htmlPlace('无')}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column  width="120" label="收租记录" style="color: red" >
        <template slot-scope="scope">
         <el-button  type="text" size="small" style="color: red" @click="showRecord(scope.row)">{{htmlPlace('查看收租记录')}}</el-button>
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
  <record v-else-if="record===false" @changeRecordStatus="changeRecordStatus" :recordInfo="recordInfo"></record>
</template>

<script>
import {repayList,affirmRepay,repayRecord} from '@/api/repayList'
import record from './record'
export default {
  inject:['reload'],
  components:{
    record
  },
  data () {
    return {
      userName: '', // 用户名
      mobile: null, // 手机号
      status: null, // 状态 3 待收租 5 收租中
      record:true,
      recordInfo:[],
      statusList: [
        {
          value: 3,
          label: '待收租'
        }, {
          value: 5,
          label: '收租中'
        }
      ],
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
      const status=this.status
      // 未选择时间
      if (this.createTime === '') {
        return {
          userName,
          mobile,
          status
        }
      } else {
      // 选择了时间
        return {
          userName,
          mobile,
          status,
          startTime: this.getNowFormatDate(this.createTime[0]),
          endTime: this.getNowFormatDate(this.createTime[1])
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
      repayList(params).then(res => {
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
    handleSizeChange (val){},
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = this.paramsData
      this.pageInit(params)
    },
    search () {
      const params = this.paramsData
      this.pageInit(params)
    },
    statusLists (val) {
     this.status=val;
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
    },
    affirmRepayClick(item){   //还款
      console.log(item)
      affirmRepay(item).then(res=>{
          if(res.data.code===0){
             this.$message({
              message: '还款成功',
              type: 'success'
            });
            this.reload();
          }else{
            this.$message.error(res.data.msg);
          }
      })
    },
    changeRecordStatus(){
      this.record=true;
    },
    showRecord(item){
      const params={
          projectId:item.projectId
      };
      this.record=false;
      repayRecord(params).then(res=>{
        console.log(res)
        if(res.data.code===0){
          this.recordInfo=res.data.data;
        }else{
          this.$message.error(res.data.msg);
        }
      })
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





