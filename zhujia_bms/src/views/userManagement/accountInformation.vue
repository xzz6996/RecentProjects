// 用户账户信息
<template>
  <div class="accountInformation main_content" v-if="!updateUserFlag">
    <!-- <div class="title">查询信息</div> -->
    <div class=" clearfix">
      <el-col :span="7">
        用户名：<el-input v-model="userName"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        手机号：<el-input v-model="mobile"  placeholder="请输入内容"></el-input>
      </el-col>
      <el-col :span="7">
        用户类型：
        <el-select v-model="userType" placeholder="请选择">
          <el-option
            v-for="item in userTypeList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </div>
    <div class="mt20 clearfix">
      <el-col :span="3" class="lh40">
        开始/结束时间：
      </el-col>
      <el-col :span="11">
        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-col>
    </div>
    <div class="clearfix mt20">

      <el-col :span="12">
        <el-button type="primary" @click="search">查询</el-button>
        <el-button type="primary" icon="el-icon-refresh" @click="refresh">重置</el-button>
        <el-button type="primary" @click="deleteAccount" icon="el-icon-delete">删除账户</el-button>
        <el-button type="primary" @click="editorAccount" icon="el-icon-edit">修改账户信息</el-button>
      </el-col>
    </div>

    <!-- 表格 -->
    <el-table id="excelExportTable" class="table" v-loading="loading" :data="tableData" stripe style="width: 100%">
      <el-table-column type="index" label='序号'>
      </el-table-column>
      <el-table-column
        width="60"
        label="选中">
        <template slot-scope="scope">
            <el-radio :label="scope.$index" v-model="templateRadio" @change.native="getTemplateRow(scope.$index,scope.row)">&nbsp;</el-radio>
        </template>
      </el-table-column>
      <el-table-column
        prop="userName"
        width="140"
        :show-overflow-tooltip="true"
        label="用户名">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="mobile"
        width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="userType"
        label="用户类型">
        <template slot-scope="scope">
          <span style="">
            {{userTypeTransfer(scope.row.userType)}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sex"
        label="性别">
        <template slot-scope="scope">
          <span style="">
            <template v-if="scope.row.sex === 0">
              未知
            </template>
            <template v-if="scope.row.sex === 1">
              男
            </template>
            <template v-if="scope.row.sex === 2">
              女
            </template>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="180"
        label="交易时间">
        <template slot-scope="scope">
          <span style="">{{ scope.row.createTime | timesFormart }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="documentCode"
        :show-overflow-tooltip="true"
        width="120"
        label="证件号">
      </el-table-column>
      <el-table-column
        width="120"
        label="用户状态 ">
        <template slot-scope="scope">
          <span style="">
            <template v-if="scope.row.status === 1">
              正常
            </template>
            <template v-if="scope.row.status === 2">
              注销
            </template>
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
  <update-user v-else-if="updateUserFlag" @editorAccountClick="editorAccount" :selectedInfo="selectedInfo"></update-user>
</template>

<script>
import {accountInformation, deleteUser} from '@/api/accountInformation'
import {BASE_URL} from '@/utils/env'
import updateUser from './updateUser'
// import FileSaver from 'file-saver'
// import XLSX from 'xlsx'
export default {
  components: {updateUser},
  data () {
    return {
      templateRadio: '', // radio值
      selectedIndex: 0, // 选中行index
      selectedInfo: null, // 选中行信息
      updateUserFlag: false,
      id: '', // 房源id
      userName: '', // 用户名
      mobile: '', // 手机号
      userType: '', // 用户类型
      userTypeList: [ // 用户类型列表
        {
          label: '投资客',
          value: 1,
        }, {
          label: '个人出租人 ',
          value: 2,
        }, {
          label: '企业出租人 ',
          value: 3,
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
      accountInformation(params).then(res => {
        const data = res.data
        _this.tableData = res.data.data
        _this.total = res.data.count
        _this.loading = false
      }).catch(err => {
        console.log(err)
      })
    },
    // 重置
    refresh () {
      this.userName = ''
      this.mobile = ''
      this.userType = ''
      this.createTime = ''
      this.pageInit()
    },
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleSizeChange (val){
    },
    // 分页
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`);

      let params
      if (this.createTime === null || this.createTime === '') {
        params = {
          userName: this.userName,
          mobile: this.mobile,
          userType: this.userType,
          pageNo: val
        }
      } else {
        params = {
          userName: this.userName,
          mobile: this.mobile,
          userType: this.userType,
          pageNo: val,
          startTime: new Date(this.createTime[0]).toUTCString(),
          endTime: new Date(this.createTime[1]).toUTCString()
        }
      }
      this.pageInit(params)
    },
    // search
    search () {
      let params
      if (this.createTime === null || this.createTime === '') {
        params = {
          userName: this.userName,
          mobile: this.mobile,
          userType: this.userType
        }
      } else {
        params = {
          userName: this.userName,
          mobile: this.mobile,
          userType: this.userType,
          startTime: new Date(this.createTime[0]).toUTCString(),
          endTime: new Date(this.createTime[1]).toUTCString()
        }
      }
      this.pageInit(params)
    },
    userTypeTransfer (val) {
      if (val === 1) {
        return '投资客'
      } else if (val === 2) {
        return '个人出租人'
      } else if (val === 3) {
        return '企业出租人'
      }
    },
    // 删除账户
    deleteAccount () {
      if (this.templateRadio !== '') {
        this.$confirm('是否确认删除?', '弹窗', {
          confirmButtonText: '确认删除',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log('进入了')
          const _this = this
          deleteUser(_this.selectedInfo.id).then(res => {
            console.log('res',res)
            if (res.data.success) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              _this.tableData.splice(_this.selectedIndex, 1)
            }
          }).catch(err => {
            this.$message({
              type: 'error',
              message: '删除失败!'
            });
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          });
        });
      }
    },
    getTemplateRow (index, val) {
      this.selectedInfo = val
      this.selectedIndex = index
      console.log(this.selectedInfo)
      return val
    },
    // 编辑账户
    editorAccount () {
      if (this.templateRadio !== '') {
        this.updateUserFlag = !this.updateUserFlag
      } else {
        this.$message({
          type: 'info',
          message: '尚未选中要修改的条目'
        });
      }
    }
  }
}
</script>


