<template>
    <div class="record">
      <div class="breadcrumb">
        还款中列表
        <i class="el-icon-arrow-right"></i>
        <span @click="addNews">返回列表</span>
      </div>
      <div class="title">
        {{recordInfo[0].projectName}}    租赁期限：{{recordInfo[0].timeLimit}}{{types}}  期数单位：{{recordInfo[0].type}}{{types}}
      </div>

      <el-table class="table"  :data="recordInfo" stripe style="width: 50%" >
        <el-table-column type="index" width="40"></el-table-column>
        <el-table-column prop="timeLimit" width="120" label="出租总期数"></el-table-column>
        <el-table-column width="120" label="收租期数">
          <template slot-scope="scope">
            <span style="">{{scope.row.hasRepayLimit}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="hasRepayAmount" width="120" label="收租金额"></el-table-column>
        <el-table-column prop="status" width="120" label="收租状态">
          <template slot-scope="scope">
            <el-button   type="text" size="small">
              {{htmlPlace('已结清')}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
    export default {
        name: "record",
      data(){
        return{

        }
      },
      computed:{
        types(){
          if(this.recordInfo[0].type===1){
            return '天'
          }
          if(this.recordInfo[0].type===2){
            return '月'
          }
        }
      },
        props:{
          recordInfo:{
            type:Array
          }
        },
        methods:{
          addNews(){
            this.$emit('changeRecordStatus');
          },
          htmlPlace (content) {
            return content.replace(/<[^>]+>/g,"")
          },
        }
    }
</script>

<style lang="scss" scoped>
  .record{
    color: #4a4a4a;
    width: 1100px;
    float: right;
    background-color: #fff;
    width: 1100px;
    padding: 20px;
    .title{
      font-size: 16px;
      line-height: 40px;
      font-weight: bold;
      margin: 20px 0;
    }
    .el-table{
      margin-top: 20px;
      border: 1px solid #e0e0e0
    }
  }
</style>
