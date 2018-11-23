// 活动消息
<template>
  <div class="activityMessage" v-if="amendNews==false && addNews==false">
    <div class="clearfix">
      <div class="title">活动消息</div>
      <el-col :span="8.5">
        <el-button type="primary" icon="el-icon-plus" @click="addMessage">添加消息</el-button>
        <el-button @click="amendNewsClick" type="primary" icon="el-icon-edit">修改消息</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteClick">删除消息</el-button>
      </el-col>
      <el-col class="ml20" :span="8.5">
        消息标题：
        <el-input v-model="title"  placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="" @click="queryMessage">查询</el-button>
      </el-col>
    </div>


    <el-table :data="tableData" stripe  tooltip-effect="dark" border style="width: 100%">
      <el-table-column type="index" width="50"  label="序号"></el-table-column>
      <el-table-column width="60" label="选中">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getCurrentRow(scope.row)">&nbsp</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="消息标题">
      </el-table-column>
      <el-table-column prop="author" label="创建者">
      </el-table-column>
      <el-table-column prop="keywords" label="内容摘要">
      </el-table-column>
      <el-table-column
        prop="status"
        label="显示状态">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status === 1"  type="text" size="small" @click="showClick(scope.row,2)">
            {{htmlPlace('显示')}}
          </el-button>
          <el-button v-if="scope.row.status === 2"  type="text" size="small" style="color: red" @click="showClick(scope.row,1)">
            {{htmlPlace('隐藏')}}
          </el-button>
        </template>
      </el-table-column>

      <el-table-column
        prop="createTime"
        label="创新时间">
        <template slot-scope="scope">
          <span style="" v-if="scope.row.createTime != null">
            {{ scope.row.createTime|timesFormart}}
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
  <add-message v-else-if="addNews" @changeAddMessage="changeAddMessage"></add-message>
  <amend-message :amendNewsInfo="amendNewsInfo" v-else-if="amendNews" @changeAmendNewsStatus="changeAmendNewsStatus"></amend-message>

</template>

<script>
import {activityMessage,deleteMessage} from '@/api/activityMessage'
import addMessage from './addMessage'
import amendMessage from './amendMessage'
export default {
  inject:['reload'],
  components: {amendMessage, addMessage},
  data () {
    return {
      templateRadio:"",
      title: '', // 新闻标题
      loading: true,
      tableData: [],
      pageSize: 20, // 每页条目数
      total: 0, // 表格总条目数 接口获取
      amendNews: false,
      addNews: false,
      amendNewsInfo: null,
      picType: '',
      picTypeArry: [
        {
          value: '1',
          label: '首页banner'
        },
        {
          value: '2',
          label: '活动'
        },
        {
          value: '3',
          label: 'ios端'
        }, {
          value: '4',
          label: 'android'
        }
      ]
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    pageInit (params) {
      const _this = this
      _this.loading = true
      activityMessage(params).then(res => {
        if(res.data.count>0){
            this.tableData=[];
        }
        _this.tableData=res.data.data;
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    addMessage(){
      this.addNews=true;
      this.amendNews=false;
    },
    // 选择新闻
    getCurrentRow(val) {
      if (val.length > 1) {
        this.$message({
          message: '一次只能修改一条',
          type: 'warning'
        });
        return
      }
      if (val.length === 0) {
        this.$message({
          message: '尚未选择要修改的内容',
          type: 'warning'
        });
        return
      }

      this.amendNewsInfo.push(val);
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
    // 点击修改新闻操作
    amendNewsClick () {
      console.log(this.amendNewsInfo)
      if (this.amendNewsInfo > 1) {
        this.$message({
          message: '一次只能修改一条',
          type: 'warning'
        });
        return
      }
      if (this.amendNewsInfo === 0 || this.amendNewsInfo === null||this.amendNewsInfo.length===0) {
        this.$message({
          message: '尚未选择要修改的内容',
          type: 'warning'
        });
        return
      }
      this.amendNews = true
      this.addNews = false
    },
    // 接受修改新闻组件传回的状态控制修改新闻显示隐藏
    changeAmendNewsStatus () {
      this.reload();
      this.amendNews = false
      this.addNews = false
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
    },
    deleteClick(){
      if (this.amendNewsInfo > 1) {
        this.$message({
          message: '一次只能删除一条',
          type: 'warning'
        });
        return
      }
      if (this.amendNewsInfo === 0 || this.amendNewsInfo === null||this.amendNewsInfo.length===0) {
        this.$message({
          message: '尚未选择要删除的内容',
          type: 'warning'
        });
        return
      }
      const params={
        title:this.amendNewsInfo[0].title,
        content:this.amendNewsInfo[0].content,
        describ:this.amendNewsInfo[0].describ,
        id:this.amendNewsInfo[0].id,
        status:this.amendNewsInfo[0].status,
        sysUserId:'aaaa'
      }
      deleteMessage(params).then(res=>{
        if(res.data.code===0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.reload();
        }else{
          this.$message.error(res.data.msg);
        }
      }).catch(err=>{
        this.$message.error(err);
      })
    },
    changeAddMessage(){
      this.reload();
      this.amendNews = false
      this.addNews = false
    },
    showClick(params,status){
      if(status===2){
        params.status=2;var message='隐藏成功';
      }
      if(status===1){
        params.status=1;var message='显示成功';
      }
      deleteMessage(params).then(res=>{
        this.$message({
          message: message,
          type: 'success'
        });
      }).catch(err=>{
        this.$message.error(err);
      })
    },
    queryMessage(){
      if(this.title===""){
        this.$message.error('请输入标题')
        return
      }
      const params={
        title:this.title,
        status:1,
        sysUserId:'aaaa'
      };
      this.pageInit(params);
    }
  }
}
</script>

<style lang="scss" scoped>
.activityMessage{
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
}
</style>



