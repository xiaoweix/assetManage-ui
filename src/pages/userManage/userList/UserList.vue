<template>
  <div class="user-list">
    <sub-title :subTitle="subTitle"></sub-title>
    <div class="query">
      <el-form :inline="true" :model="queryList" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="queryList.id" placeholder="输入编号进行查询"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="queryList.phone" placeholder="输入手机号进行查询"></el-input>
        </el-form-item>
        <el-form-item label="级别">
          <el-select v-model="queryList.level" placeholder="请选择">
            <el-option
              v-for="item in levels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="queryList.name" placeholder="输入姓名进行查询"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryList.status" placeholder="请选择">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="user-list">
      <el-table :data="userList" >
        <el-table-column
          align="center"
          prop="id"
          width="50">
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="email"
          align="center"
          label="邮箱">
        </el-table-column>
        <el-table-column
          prop="telephone"
          align="center"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="jobLevel"
          align="center"
          label="级别">
        </el-table-column>
        <el-table-column
          label="状态" align="center">
          <template slot-scope="scope">
            <el-button @click="changeStatus(scope.row)" type="text" size="small">{{scope.row.status}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          label="操作" align="center">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small" :style="{ display: isSysAdmin ? 'inline-block':'none' }">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row, scope.$index, userList)" :style="{ display: isSysAdmin ? 'inline-block':'none' }">删除</el-button>
            <el-button @click="handleView(scope.row)" type="text" size="small">资料详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogDelete"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <span>确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="sureDelete()">确 定</el-button>
      </span>
    </el-dialog>
    <!--申请通过-->
    <el-dialog
      title="申请信息"
      :visible.sync="dialogDeal"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <el-form :model="applyUser" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="applyUser.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="applyUser.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="applyUser.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="applyUser.signature" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passApply(userId)">通过申请</el-button>
        <el-button @click="notApply(userId)">拒绝申请</el-button>
      </span>
    </el-dialog>
    <!--资料详情-->
    <el-dialog
      title="资料详情"
      :visible.sync="dialogDetail"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <el-form :model="user" label-width="100px" disabled>
        <el-form-item label="姓名">
          <el-input v-model="user.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="user.signature" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogDetail = false">确定</el-button>
      </span>
    </el-dialog>
    <!--编辑-->
    <el-dialog
      title="编辑资料"
      :visible.sync="dialogEdit"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <el-form :model="userEdit" label-width="100px">
        <el-form-item label="姓名">
          <el-input v-model="userEdit.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="userEdit.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userEdit.telephone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userEdit.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="userEdit.jobLevel" placeholder="请选择">
            <el-option
              v-for="item in jobLevels"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-input v-model="userEdit.signature" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "UserList",
    data() {
      return {
        subTitle: '用户列表',
        dialogDelete: false,
        currentRow: {},
        total: 9,
        pageSize: 10,
        levels: [
          {
            value: '1',
            label: '普通学生用户'
          },
          {
            value: '2',
            label: '教师用户'
          },
          {
            value: '3',
            label: '管理员'
          },
          {
            value: '9',
            label: '超级管理员'
          }
        ],
        statuses: [
          {
            value: '2',
            label: '正常'
          },
          {
            value: '1',
            label: '锁定'
          },
          {
            value: '0',
            label: '待处理'
          }
        ],
        queryList: {
          id: '',
          phone: '',
          level: '',
          name: '',
          status: ''
        },
        userList: [],
        userId: 1,
        deleteId: '',
        currentPage: 1,
        isSysAdmin: true,
        dialogDeal: false,
        dialogDetail: false,
        dialogEdit: false,
        user: {},
        applyUser: {},
        userEdit: {},
        editId: 0,
        jobLevels: [
          {
            value: 1,
            label: '普通学生用户'
          },
          {
            value: 2,
            label: '教师用户'
          },
          {
            value: 3,
            label: '管理员'
          },
          {
            value: 9,
            label: '超级管理员'
          }
        ]
      }
    },
    components: {
      SubTitle
    },
    created() {
      const userCode = sessionStorage.getItem('userCode')
      if(userCode == 9) {
        this.isSysAdmin = true
      } else {
        this.isSysAdmin = false
      }
      this.queryUserList()
    },
    methods: {
      onSubmit() {
        this.queryUserList()
      },
      handleDelete(row, index, rows) {
        this.dialogDelete = true;
        this.currentRow.id = row.id
        this.currentRow.index = index
      },
      sureDelete () {
        this.userList.splice(this.currentRow.index, 1)
        this.$get('/asset_manage/user/removeUser', {
          userId: this.currentRow.id
        }).then(data => {
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: data.msg
          })
        })
        this.dialogDelete = false
      },
      handleEdit (row) {
        this.dialogEdit = true
        let { id } = row
        this.editId = id
        this.$get('/asset_manage/user/userDetail', { userId: id })
          .then(data => {
            switch (data.result.jobLevel) {
              case 1:
                data.result.jobLevel = '普通学生用户'
                break
              case 2:
                data.result.jobLevel = '教师用户'
                break
              case 3:
                data.result.jobLevel = '管理员'
                break
              case 9:
                data.result.jobLevel = '超级管理员'
                break
            }
            this.userEdit = data.result
          })
      },
      sureEdit () {
        this.dialogEdit = false
        let { email, jobLevel, password, signature, telephone, userName } = this.userEdit
        let id = this.editId
        this.$get('/asset_manage/user/userDetail', { userId: id, email, jobLevel, password, signature, telephone, userName })
          .then(data => {
            this.queryUserList()
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
          })
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      queryUserList() {
        let jobLevel = [['1', '2', '3', '9'], ['普通学生用户', '教师用户', '管理员', '超级管理员']]
        let userStatus = [['2', '1', '0'], ['正常', '锁定', '待处理']]
        for(let j = 0; j < jobLevel[1].length; j++) {
          if (this.queryList.level == jobLevel[1][j]) {
            this.queryList.level = jobLevel[0][j]
          }
        }
        for(let j = 0; j < userStatus[1].length; j++) {
          if (this.queryList.status == userStatus[1][j]) {
            this.queryList.status = userStatus[0][j]
          }
        }
        this.$get('/asset_manage/user/userList', {
          pageSize: this.pageSize,
          currPage: this.currentPage,
          userId: this.queryList.id ? this.queryList.id : '',
          userName: this.queryList.name ? this.queryList.name : '',
          status: this.queryList.status ? this.queryList.status : '',
          telephone: this.queryList.phone ? this.queryList.phone : '',
          jobLevel: this.queryList.level ? this.queryList.level : '',
        })
          .then(data => {
            this.total = data.result.length
            for(let i = 0; i < data.result.length; i++) {
              for(let j = 0; j < jobLevel[0].length; j++) {
                if (data.result[i].jobLevel == jobLevel[0][j]) {
                  data.result[i].jobLevel = jobLevel[1][j]
                }
              }
              for(let j = 0; j < userStatus[0].length; j++) {
                if (data.result[i].status == userStatus[0][j]) {
                  data.result[i].status = userStatus[1][j]
                }
              }
            }
            this.userList = data.result
          })
          .catch(err => {
            console.log(err);
          })
      },
      changeStatus(row) {
        this.userId = row.id
        let { status, id } = row
        if (status == '正常') {
          status = 1
        } else if (status == '锁定') {
          status = 2
        } else if (status == '待处理') {
          this.dialogDeal = true
          this.$get('/asset_manage/user/userDetail', { userId: id })
           .then(data => {
             this.applyUser = data.result
             this.$q.notify({
               position: 'top',
               timeout: 250,
               color: 'green-4',
               textColor: 'white',
               icon: 'cloud_done',
               message: data.msg
             })
           })
        }
        if (status == 1 || status == 2) {
          this.dialogDeal = false
          this.$post('/asset_manage/user/modifyUser', {
            id, status
          })
            .then(data => {
              this.queryUserList()
              this.$q.notify({
                position: 'top',
                timeout: 250,
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: data.msg
              })
            })
        }
      },
      passApply (userId) {
        this.$get('/asset_manage/user/agreeUser', {
          userId: this.userId
        })
          .then(data => {
            this.queryUserList()
            this.dialogDeal = false
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
          })
      },
      notApply (row) {
        this.$get('/asset_manage/user/disagreeUser', {
          userId: this.userId
        })
          .then(data => {
            this.dialogDeal = false
            this.queryUserList()
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
          })
      },
      handleView (row) {
        this.dialogDetail = true
        let { id } = row
        this.$get('/asset_manage/user/userDetail', { userId: id })
          .then(data => {
            this.user = data.result
          })
      }
    }
  }
</script>

<style scoped>

</style>
