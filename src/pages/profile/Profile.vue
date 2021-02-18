<template>
  <div class="my-profile">
    <SubTitle :subTitle="subTitle"/>
    <el-link class="edit-profile" type="primary" @click="editForm" v-if="formDisabled">编辑资料</el-link>
    <el-link class="edit-profile" type="primary" @click="sureEdit" v-else>确定</el-link>
    <el-form :model="profile" label-width="80px" :disabled="formDisabled">
      <el-form-item label="姓名">
        <el-input v-model="profile.userName" disabled></el-input>
      </el-form-item>
      <el-form-item label="手机">
        <el-input v-model="profile.telephone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="profile.email" disabled></el-input>
      </el-form-item>
      <el-form-item label="个性签名">
        <el-input v-model="profile.signature"></el-input>
      </el-form-item>
      <q-separator></q-separator>
      <el-form-item label="资源使用历史" label-width="160">
        <el-table
          :data="history"
          style="width: 100%">
          <el-table-column
            prop="id"
            align="center"
            label="申请编号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="assetName"
            align="center"
            label="资产名"
            width="180">
          </el-table-column>
          <el-table-column
            prop="applyType"
            align="center"
            label="使用方式">
          </el-table-column>
          <el-table-column
            prop="startTime"
            align="center"
            label="使用时间"
            width="210">
          </el-table-column>
          <el-table-column
            prop="result"
            align="center"
            label="使用状态">
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "Profile",
    data() {
      return {
        subTitle: '个人中心',
        formDisabled: true,
        profile: {},
        history: [],
        id: ''
      }
    },
    created() {
      // 1:借用、2:申领、3:使用、4:采购、5:反馈
      const types = [['1', '2', '3', '4', '5'], ['借用', '申领', '使用', '采购', '反馈']]
      const results = [['0', '1', '2', '3'], ['待处理', '同意', '拒绝', '完成']]
      this.$get('/asset_manage/user/personalZone')
        .then(data => {
          this.profile = data.result
          this.id = data.result.id
          for(let i = 0; i < data.result.assetUseHistoryBOList.length; i++) {
            for(let j = 0; j < types[0].length; j++) {
              if(data.result.assetUseHistoryBOList[i].applyType == types[0][j]) {
                data.result.assetUseHistoryBOList[i].applyType = types[1][j]
              }
            }
            for(let j = 0; j < results[0].length; j++) {
              if(data.result.assetUseHistoryBOList[i].result == results[0][j]) {
                data.result.assetUseHistoryBOList[i].result = results[1][j]
              }
            }
          }
          this.history = data.result.assetUseHistoryBOList
        })
    },
    components: {
      SubTitle
    },
    methods: {
      editForm() {
        this.formDisabled = false
      },
      sureEdit() {
        const id = this.id
        const {telephone, signature} = this.profile
        this.$post('/asset_manage/user/modifyUser', {
          telephone, signature, id
        })
          .then(res => {
            this.formDisabled = true
            if(res.code == 200) {
              this.$q.notify({
                position: 'top',
                timeout: 250,
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: '修改成功'
              })
            }
            else {
              this.$q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: res.msg
              })
            }
          })
      }
    }
  }
</script>

<style scoped lang="sass">
.my-profile
  position: relative
.el-form
  margin-top: 30px
  width: 800px
/deep/.el-input__inner
  border: none
  background: none

/deep/.el-input.is-disabled .el-input__inner
  color: slategrey

.edit-profile
  position: absolute
  top: 80px
  right: 0
  margin-right: 40px
</style>
