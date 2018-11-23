<template>
  <div class="role">
    <div class="clearfix">
      <el-col :span="8.5">
        <el-button @click="addRoleClick" type="primary" icon="el-icon-plus">新增角色</el-button>
        <!--<el-button @click="" type="primary" icon="el-icon-edit">修改角色</el-button>-->
        <el-button type="primary" icon="el-icon-delete" @click="deleteRole">删除角色</el-button>
      </el-col>
    </div>
    <!--<el-table :data="tableData" ref="multipleTable" tooltip-effect="dark" border style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" label="序号"></el-table-column>
      <el-table-column type="index" width="58" label="选中"></el-table-column>-->
      <el-table :data="tableData" stripe  tooltip-effect="dark" border style="width: 100%">
        <el-table-column type="index" width="50"  label="序号"></el-table-column>

        <el-table-column width="60" label="选中">
          <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getCurrentRow(scope.$index,scope.row)">&nbsp;</el-radio>
          </template>
        </el-table-column>

      <el-table-column prop="roleName" label="角色" width="250"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码" width="250"></el-table-column>
      <el-table-column prop="" label="是否有效" width="238">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">有效</span>
          <span v-if="scope.row.status===0">无效</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="210">
        <template slot-scope="scope">
          <el-button  type="text" size="small" @click="update(scope.row)">修改</el-button>

          <el-button type="text" size="small" @click="stopUse(scope.row,0)" v-if="scope.row.status===0">禁用</el-button>
          <el-button type="text" size="small" @click="stopUse(scope.row,1)" v-if="scope.row.status===1">开启</el-button>

        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination class="mt20" v-loading="loading" @size-change="handleSizeChange" @current-change="handleCurrentChange" :page-size="pageSize" layout="prev, pager, next, jumper" :total="total">
    </el-pagination>
    <amend-role v-if="amendRoles" :info="info" @amendRoleStatus="amendRoleStatus"></amend-role>
  <add-role v-if="addRoles" @addRoleStatus="addRoleStatus"></add-role>
  </div>
  
</template>

<script>
  import addRole from './addRole'
  import amendRole from './amendRole'
  import {roleList,deleteRole,stopRole} from '@/api/systemManagement'
  export default {
    inject:['reload'],
    components:{
      addRole,amendRole
    },
    data(){
      return{
        info:[],//修改的值
        infos:null,
        templateRadio:null,
        departments:"",
        user:"",
        tableData:[],//表格
        loading: true,
        pageSize: 20, // 每页条目数
        total: 0, // 表格总条目数 接口获取
        addRoles:false,
        amendRoles:false
      }
    },
    mounted(){
      this.pageInit();
    },
    methods:{
      pageInit(params){
        const _this = this
        _this.loading = true
        roleList(params).then(res=>{
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
          pageNo: val
        }
        this.pageInit(params)
      },
      addRoleClick(){
        this.addRoles=true;
        this.amendRoles=false;
      },
      update(item){
        this.info.push(item);
        this.addRoles=false;
       this.amendRoles=true;
      },
      addRoleStatus(){
        this.addRoles=false;
        this.amendRoles=false;
        this.reload();
      },
      amendRoleStatus(){
        this.addRoles=false;
        this.amendRoles=false;
        this.reload();
      },
      getCurrentRow(val){
        if (val > 0) {
          this.$message({
            message: '一次只能删除一条',
            type: 'warning'
          });
          return
        }
        if (val.length === 0) {
          this.$message({
            message: '尚未选择要删除的内容',
            type: 'warning'
          });
          return
        }
        this.infos= val;
      },
      deleteRole(){  //删除
        if (this.infos > 1) {
          this.$message({
            message: '一次只能删除一条',
            type: 'warning'
          });
          return
        }
        if (this.infos === 0 || this.infos===null) {
          this.$message({
            message: '尚未选择要删除的内容',
            type: 'warning'
          });
          return
        }
          this.infos[0].type=1;
          deleteRole(this.infos[0]).then(res=>{
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
      stopUse(item,index){  //禁用
        var x=null;
        if(index===0){
          x="开启成功";item.status=1;
        }else{
          x="禁用成功";item.status=0;
        }
        stopRole(item).then(res=>{
          if(res.data.code===0){
            this.$message({
              message: x,
              type: 'success'
            });
            this.reload();
          }else{
            this.$message.error(res.data.msg);
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .role{
    width: 1100px;
    color: #4a4a4a;
    float: right;
    background-color: #fff;
    padding: 20px;
    .clearfix{
      margin: 20px auto;
    }
  }
</style>

