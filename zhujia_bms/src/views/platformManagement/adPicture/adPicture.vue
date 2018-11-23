<template>
  <div class="adPicture" v-if="amendNews==false && addNews==false">
    <div class="clearfix">
      <div class="title">广告图片</div>
      <el-col :span="8.5">
        <el-button type="primary" icon="el-icon-plus" @click="addNewsClick">添加图片</el-button>
        <el-button @click="amendNewsClick" type="primary" icon="el-icon-edit">修改图片</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteBanner">删除图片</el-button>
      </el-col>
      <el-col class="ml20" :span="8.5">
        图片类型：
        <el-select v-model="picType" placeholder="请选择">
          <el-option
            v-for="item in picTypeArry"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-button type="primary" icon="" @click="query">查询</el-button>
      </el-col>
    </div>

    <el-table :data="tableData" stripe  tooltip-effect="dark" border style="width: 100%">
      <el-table-column type="index" width="50"  label="序号"></el-table-column>
      <el-table-column width="60" label="选中">
        <template slot-scope="scope">
          <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getCurrentRow(scope.row)">&nbsp</el-radio>
        </template>
      </el-table-column>

      <el-table-column
        prop="bannerName"
        label="图片名称">
      </el-table-column>
      <el-table-column
        prop="bannerType"
        label="图片类型">
      </el-table-column>
      <el-table-column
        prop="bannerUrl"
        label="图片链接">
      </el-table-column>
      <el-table-column
        width="180"
        label="创新时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="author"
        label="创建人">
      </el-table-column>
      <el-table-column
        width="180"
        prop="orderNo"
        label="当前排序">
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

  <add-pictures v-else-if="addNews" @changeAddPictureStatus="changeAddPictureStatus"></add-pictures>
  <amend-pictures :amendNewsInfo="amendNewsInfo" v-else-if="amendNews" @changeAmendNewsStatus="changeAmendNewsStatus"></amend-pictures>
</template>

<script>
import {bannerList,deleteBanner} from '@/api/banner'
import addPictures from './addPictures'
import amendPictures from './amendPictures'
export default {
  inject:['reload'],
  components: {addPictures,amendPictures},
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
      amendNewsInfo: [],
      picType: '',
      picTypeArry: [
        {
          value: '1',
          label: '手机端'
        }, {
          value: '2',
          label: '网站首页'
        }, {
          value: '3',
          label: '专区'
        }, {
          value: '4',
          label: '登录大图'
        }, {
          value: '5',
          label: '注册图'
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
      bannerList(params).then(res => {
        if(res.data.count>0){
          this.tableData=[];
        }
        console.log(res)
        _this.tableData=res.data.data
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

      this.amendNewsInfo.push(val);
    },
    handleSizeChange (val){},
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
    addNewsClick(){
      this.amendNews = false
      this.addNews = true
    },
    // 接受修改新闻组件传回的状态控制修改新闻显示隐藏
    changeAmendNewsStatus () {
      this.reload();
      this.amendNews = false
      this.addNews = false
    },
    changeAddPictureStatus(){
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
      deleteBanner(params).then(res=>{
        this.$message({
          message: message,
          type: 'success'
        });
      }).catch(err=>{
        this.$message.error(err);
      })
    },
    htmlPlace (content) {
      return content.replace(/<[^>]+>/g,"")
    },
    deleteBanner(){
      const params={
        sysUserId:'aaaa',//这个先传aaaa
        status:1,
        id:this.amendNewsInfo[0].id
      }
      deleteBanner(params).then(res=>{
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
    query(){
      if(this.picType===""){
        this.$message.error('请选择图片类型')
        return
      }
      const params={
        bannerType:this.picType,
        status:1,
        sysUserId:'aaaa'
      };
      this.pageInit(params);

    }
  }
}
</script>

<style lang="scss" scoped>
.adPicture{
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


