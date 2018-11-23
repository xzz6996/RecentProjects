<template>
  <div class="user" >
    <div class="clearfix">
      <el-col :span="24" >
        <el-button @click="addUserClick" type="primary" icon="el-icon-plus">新增用户</el-button>
        <el-button @click="amendUserClick" type="primary" icon="el-icon-edit">修改用户</el-button>
        <el-button type="primary" icon="el-icon-delete" @click="deleteUser">删除用户</el-button>
      </el-col>
      <el-col class="ml20" :span="8.5">
       <!-- 部门：
        <el-select v-model="departments" placeholder="请选择">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>-->
        角色
        <el-select v-model="departments[0]" placeholder="请选择">
          <el-option v-for="item in department" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
        用户<el-input v-model="userName" style="width: 200px"></el-input>
        <el-button type="primary" icon="" @click="query">查询</el-button>
      </el-col>
    </div>


      <el-table :data="tableData"  v-loading="loading" stripe  tooltip-effect="dark" border style="width: 100%">
        <el-table-column type="index" width="50"  label="序号"></el-table-column>
        <el-table-column width="60" label="选中">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getCurrentRow(scope.index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>

      <el-table-column prop="userName" label="用户名" width="130"></el-table-column>
     <!-- <el-table-column prop="realName" label="真实姓名" width="100"></el-table-column>-->
     <!-- <el-table-column prop="" label="部门" width="100"></el-table-column>-->
      <el-table-column prop="roleName" label="角色" width="100"></el-table-column>
      <!--<el-table-column prop="sex" label="性别" width="100"></el-table-column>-->
      <el-table-column prop="phone" label="手机号" width="120"></el-table-column>
      <el-table-column prop="mailbox" label="邮箱地址" width="170"></el-table-column>
      <el-table-column prop="" label="创新时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.gmtCreate | timesFormart }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="mt20"  @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
    </el-pagination>

  <add-user v-if="addUsers" @addUserStatus="addUserStatus"></add-user>
  <amend-user v-if="amendUsers" :info="info" @amendUserStatus="amendUserStatus"></amend-user>
  </div>

</template>

<script>
  import {querySysUserList,deleteSysUser} from '@/api/systemManagement'
  import addUser from './addUser'
  import amendUser from './amendUser'
export default {
    inject:['reload'],
    components:{
      addUser,amendUser
    },
    data(){
      return{
        templateRadio:"",
        selectedIndex: 0, // 选中行index
        departments:[],
        userName:"",
        amendUsers:false,
        addUsers:false,
        tableData:[],
        loading: true,
        info:[],//删除获得的数据
        pageSize: 20, // 每页条目数
        total: 0, // 表格总条目数 接口获取
        department:[
          {
            label:"技术",
            value:"technology"
          },
          {
            label:"产品",
            value: "product"
          },
          {
            label:"运营",
            value: "operate"
          },
          {
            label:"风控",
            value: "risk"
          },
          {
            label:"财务",
            value: "finance"
          },
        ]
      }
    },
  mounted(){
    const params = {
      pageSize: 20,
      pageNo: 1,
      sort: 'create_time'
    }
    this.pageInit(params);
  },
  methods:{
    getCurrentRow(index,val){
      this.selectedIndex=index;
      console.log(val)
      if (val > 0) {
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
      this.info[0]=val;
      console.log(val)
      if(this.info[0].roleCode){
        this.info[0].roleCode=this.info[0].roleCode.split(',');
      }else{
        this.info[0].roleCode=[];
      }
      console.log(this.info)
    },
    pageInit(params){
        const _this = this
        //_this.loading = true
        querySysUserList(params).then(res=>{
          console.log(res)
          _this.tableData=res.data.data
          _this.total = res.data.count
          _this.loading = false
        })
      },
    //分页
    handleSizeChange (val){},
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);
      const params = {
        pageNo: val,
        pageSize: 20
      }
      this.pageInit(params)
    },
    addUserClick(){  //新增用户
        this.addUsers=true;
        this.amendUsers=false;
    },
    amendUserClick(){
      if (this.info > 1) {
        this.$message({
          message: '一次只能修改一条',
          type: 'warning'
        });
        return
      }
      if (this.info === 0 || this.info === null ||this.info.length===0) {
        this.$message({
          message: '尚未选择要修改的内容',
          type: 'warning'
        });
        return
      }
      this.addUsers=false;
      this.amendUsers=true;
    },
    addUserStatus(){
      this.addUsers=false;
      this.amendUsers=false;
      this.reload();
    },
    amendUserStatus(){
      this.addUsers=false;
      this.amendUsers=false;
      this.reload();
    },
    deleteUser(){   //删除用户
        console.log(this.info)
      if (this.info > 1) {
        this.$message({
          message: '一次只能删除一条',
          type: 'warning'
        });
        return
      }
      if (this.info=== 0 || this.info===null||this.info.length===0) {
        this.$message({
          message: '尚未选择要删除的内容',
          type: 'warning'
        });
        return
      }
        const params={
          id:this.info[0].id,
          type:1,
          accountId:'aaaa'  //这个为超级管理员
        }
      deleteSysUser(params).then(res=>{
        if(res.data.code===0){
          this.$message({
            message: '删除成功',
            type: 'success'
          });
          this.reload();
        }else{
          this.$message.error(res.data.msg);
        }
      })
    },
    query(){ //查询
      /*if(this.userName===null){
        this.$message({message: '请输入用户', type: 'warning'}); return
      }
      if(this.departments.length===0){
        this.$message({message: '请选择角色', type: 'warning'}); return
      }*/
      if(this.departments.length===0&&this.userName===null){
        this.pageInit(params);
      }else{
        const params = {
          key: this.userName,
          roleCodes:this.departments,
          pageSize: 20,
          pageNo: 1,
          sort: 'create_time'
        }
        this.pageInit(params);
      }

    }

  }
}
</script>

<style lang="scss" scoped>
  .user{
    width: 1100px;
    color: #4a4a4a;
    float: right;
    background-color: #fff;
    padding: 20px;
    .ml20{
      margin: 20px auto;
    }
  }
</style>

