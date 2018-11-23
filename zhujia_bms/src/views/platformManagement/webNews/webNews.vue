// 网站新闻
<template>
  <div class="webNews" v-if="amendNews==false && addNews==false">
    <div class="clearfix">
      <div class="title">网站新闻</div>
      <el-col :span="8.5">
        <el-button @click="addNewsClick" type="primary" icon="el-icon-plus">添加新闻</el-button>
        <el-button @click="amendNewsClick" type="primary" icon="el-icon-edit">修改新闻</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="delectNewsClick">删除新闻</el-button>
      </el-col>
      <el-col class="ml20" :span="8.5">
        新闻标题：<el-input v-model="title"  placeholder="请输入内容"></el-input>
        <el-button type="primary" icon="">查询</el-button>
      </el-col>
    </div>


    <el-table :data="tableData" stripe  tooltip-effect="dark" border style="width: 100%">
      <el-table-column type="index" width="50"  label="序号"></el-table-column>
      <el-table-column width="60" label="选中">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getCurrentRow(scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="title" :show-overflow-tooltip="true" label="新闻标题"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="keywords" label="关键字"></el-table-column>
      <el-table-column prop="describ" :show-overflow-tooltip="true" label="描述"></el-table-column>
      <el-table-column prop="infoFrom" label="信息来源"></el-table-column>
      <el-table-column width="180" prop="content" label="内容摘要" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span style="" v-if="scope.row.content != null">
            {{ htmlPlace(scope.row.content)}}
          </span>
          <span style="" v-else>
            {{ scope.row.content}}
          </span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="创新时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="mt20" v-loading="loading" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
  <add-news  v-else-if="addNews" @changeAddNewsStatus="changeAddNewsStatus"></add-news>
  <amend-news :amendNewsInfo="amendNewsInfo" v-else-if="amendNews" @changeAmendNewsStatus="changeAmendNewsStatus"></amend-news>
</template>

<script>
import {webNews,delectNews} from '@/api/webNews'
import amendNews from './amendNews'
import addNews from './addNews'
export default {
  inject:['reload'],
  components: {amendNews,addNews},
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
      amendNewsInfo: []
    }
  },
  mounted () {
    this.pageInit()
  },
  methods: {
    pageInit (params) {
      const _this = this
      _this.loading = true
      _this.tableData=[];
      webNews(params).then(res => {
        console.log(res)
        _this.tableData=res.data.data;
      
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
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
    console.log(val)
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
    changeAddNewsStatus(){
      this.reload();
      this.amendNews = false
      this.addNews = false
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
    },
    addNewsClick(){  //添加新闻
      this.addNews=true
      this.amendNews = false
    },
    delectNewsClick(){  //删除新闻
      console.log(this.amendNewsInfo)
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
        pictureUrls:this.amendNewsInfo[0].pictureUrl,
        title:this.amendNewsInfo[0].title,
        author:this.amendNewsInfo[0].author,
        infoFrom:this.amendNewsInfo[0].infoFrom,
        keywords:this.amendNewsInfo[0].keywords,
        pathUrl:this.amendNewsInfo[0].pathUrl,
        describ:this.amendNewsInfo[0].describ,
        content:this.amendNewsInfo[0].content,
        targetId:this.amendNewsInfo[0].targetId,
        id:this.amendNewsInfo[0].id,
        sysUserId:this.amendNewsInfo[0].sysUserId,
        status:this.amendNewsInfo[0].status
      }
      delectNews(params).then(res=>{
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

    }
  }
}
</script>

<style lang="scss" scoped>
.webNews{
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

