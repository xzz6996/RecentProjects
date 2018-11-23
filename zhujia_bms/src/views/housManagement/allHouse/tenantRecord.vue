<template>
  <div class="houseTrial">
    <div class="breadcrumb">
      <span class="pointClick" @click="back">返回列表</span>
    </div>
    <el-table
      class="table"
      :data="tableData"
      stripe
      style="width: 100%">
      <el-table-column
        prop="userName"
        label="用户名称">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="rentArea"
        width="200"
        label="租赁面积">
      </el-table-column>

      <el-table-column
        prop="rentAmount"
        label="租赁金额">
      </el-table-column>

      <el-table-column
        prop="rentTotalAmount"
        label="应收总金额">
        
      </el-table-column>


      <el-table-column
        label="每日返还金额">
        <template slot-scope="scope">
          <span style="">{{ scope.row.returnDaliyAmount | moneyFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="租赁时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.rentTime | timesFormart }}</span>
        </template>
      </el-table-column>

      
    </el-table> 
  </div>
</template>

<script>
import {houseTenantRecord} from '@/api/housManagement'
export default {
  data () {
    return {
      input: '',
      tableData: null
    }
  },
  props: {
    detailProjectId: {
      type: String
    }
  },
  mounted () {
    // 32ac73468f0343a18e4b84395b74ff68
    const projectId = this.detailProjectId
    if (!projectId) {
      return
    }
    const params = {
      pageSize: 20,
      pageNo: 1,
      sort: 'create_time',
      projectId: projectId
    }
    this.pageInit(params)
  },
  methods: {
    pageInit (params) {
      const _this = this
      houseTenantRecord(params).then(res => {
        _this.tableData = res.data.data
        console.log(_this.tableData)
      }).catch(err => {
        console.log(err)
      })
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
    back () {
      this.$emit('houseDetailClickShow')
    }
  }
}
</script>

<style lang="scss" scoped>
.houseTrial{
  color: #4a4a4a;
  width: 1100px;
  float: right;
  background-color: #fff;
  padding: 20px;
  .title{
    font-size: 16px;
    line-height: 40px;
  }
  .el-input{
    width: 180px;
  }
  .el-table{
    margin-top: 20px;
    border: 1px solid #e0e0e0
  }
  .red{
    color: red
  }
}
</style>

