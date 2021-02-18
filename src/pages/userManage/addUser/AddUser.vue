<template>
  <div class="add-user">
    <sub-title :subTitle="subTitle"></sub-title>
    <div class="add-user-form">
      <el-form :model="addUserForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="addUserForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="addUserForm.telephone"></el-input>
        </el-form-item>
        <el-form-item label="电子邮箱">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="身份">
          <el-select v-model="addUserForm.jobLevel" placeholder="请选择">
            <el-option
              v-for="item in statuses"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="个人签名">
          <el-input  type="textarea" v-model="addUserForm.signature"></el-input>
        </el-form-item>
        <el-form-item class="row justify-between">
          <el-button>取消</el-button>
          <el-button type="primary" @click="addUser">确定</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "AddUser",
    data() {
      return {
        subTitle: '添加用户',
        addUserForm: {},
        statuses: [
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
        ],
        jobLevel: ''
      }
    },
    components: {
      SubTitle
    },
    methods: {
      addUser () {
        let { email, password, signature, telephone, userName, jobLevel } = this.addUserForm
        let jobLevels = [[1, 2, 3, 9], ['普通学生用户', '教师用户', '管理员', '超级管理员']];
        // for(let i = 0; i < jobLevels[1].length; i++) {
        //   if(jobLevel == jobLevels[1][i]) {
        //     jobLevel = jobLevels[0][i]
        //   }
        // }
        console.log(email, password, signature, jobLevel, telephone, userName);
        this.$post('/asset_manage/user/addUser', {
          email, password, signature, jobLevel, telephone, userName
        })
          .then(data => {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
          })
          .catch(err => {
            this.$q.notify({
              position: 'top',
              color: 'red-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '服务器繁忙，稍后再试'
            })
          })
      }
    }
  }
</script>

<style scoped lang="sass">
.add-user-form
  width: 400px
  margin-top: 30px
  position: relative
  left: 50%
  margin-left: -200px
/deep/.el-button
  width: 120px
</style>
