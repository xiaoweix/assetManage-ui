<template>
  <div class="info-list">
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
    <div class="info-list">
      <el-table :data="infoList" >
        <el-table-column
          prop="id"
          label="申请ID"
          align="center">
        </el-table-column>
        <el-table-column
          prop="assetId"
          width="80"
          label="资产编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="userName"
          label="申请人"
          align="center">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          label="申请类型">
        </el-table-column>
        <el-table-column
          prop="assetName"
          label="资产名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="number"
          label="申请数量"
          align="center">
        </el-table-column>
        <el-table-column
          prop="startTime"
          width="210"
          label="申请时间"
          align="center">
        </el-table-column>
        <el-table-column
          prop="result"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button @click="handleAgree(scope.row, scope.row.isDeal)" type="text" size="small" :disabled="scope.row.isDeal">同意</el-button>
            <el-button type="text" size="small" @click="handleReject(scope.row, scope.row.isDeal)" :disabled="scope.row.isDeal">拒绝</el-button>
            <el-button type="text" size="small" @click="handleBack(scope.row, scope.row.isDeal)" :disabled="scope.row.isBrow">归还</el-button>
            <el-button @click="handleView(scope.row)" type="text" size="small">申请详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="信息详情"
               :modal-append-to-body="false"
               :visible.sync="dialogBadVisible">
      <el-form :model="detail" label-width="100px" disabled>
        <el-form-item label="资产名">
          <el-input v-model="detail.assetName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="detail.assetVersion" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用地点">
          <el-input v-model="detail.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="申请人">
          <el-input v-model="detail.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="detail.startTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="detail.endTime" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="detail.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogBadVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "InfoList",
    data() {
      return {
        subTitle: '信息列表',
        dialogBadVisible: false,
        detail: {},
        infoList: [],
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
            value: '1',
            label: '正常'
          },
          {
            value: '2',
            label: '锁定'
          },
          {
            value: '3',
            label: '待处理'
          }
        ],
        queryList: {},
        isDeal: false,
        imgs: []
      }
    },
    components: {
      SubTitle
    },
    created() {
      this.getList()
    },
    methods: {
      onSubmit() {
        this.getList()
      },
      getList() {
        let urgencyArr = [['1', '2', '3'], ['不急', '一般', '急用']]
        let resultArr = [['0', '1', '2', '3'], ['待处理', '同意', '拒绝', '已归还']]
        let typeArr = [['1', '2', '3', '4', '5'], ['借用', '领用', '使用', '采购', '反馈']]
        this.$get('/asset_manage/apply/assetLogList', {
          assetId: this.queryList.id,
          userName: this.queryList.name,
          status: this.queryList.status,
          telephone: this.queryList.phone,
          jobLevel: this.queryList.level
        })
          .then(data => {
            for(let i = 0; i < data.result.length; i++) {
              for(let j = 0; j < urgencyArr[0].length; j++) {
                if(urgencyArr[0][j] == data.result[i].urgency) {
                  data.result[i].urgency = urgencyArr[1][j]
                }
              }
              for(let j = 0; j < resultArr[0].length; j++) {
                if(resultArr[0][j] == data.result[i].result) {
                  data.result[i].result = resultArr[1][j]
                }
              }
              for(let j = 0; j < typeArr[0].length; j++) {
                if(typeArr[0][j] == data.result[i].type) {
                  data.result[i].type = typeArr[1][j]
                }
              }
            }
            this.infoList = data.result;
            for(let i = 0; i < data.result.length; i++) {
              if (data.result[i].type == '借用' && data.result[i].result == '同意') {
                console.log(i)
                data.result[i].isBrow = false;
              } else {
                data.result[i].isBrow = true;
              }
              if(data.result[i].result == '同意' || data.result[i].result == '拒绝' || data.result[i].result == '已归还') {
                data.result[i].isDeal = true;
              } else {
                data.result[i].isDeal = false;
              }
            }
          })
      },
      handleAgree(row) {
        this.getList()
        this.$get('/asset_manage/apply/agreeApply', {
          applyId: row.id
        })
          .then(data => {
            this.getList()
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
          })
        row.isDeal = true
      },
      handleReject(row) {
        this.$get('/asset_manage/apply/disagreeApply', {
          applyId: row.id
        })
          .then(data => {
            this.getList()
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: data.msg
            })
            row.isDeal = true
          })
      },
      handleView(row) {
        const self = this
        this.dialogBadVisible = true
        this.$get('/asset_manage/apply/assetApplyDetail', {id: row.id})
        .then(data => {
          this.detail = data.result
          // if (data.result.image3) {
          //   self.imgs = ["file://" + data.result.image1, "file://" + data.result.image2, "file://" + data.result.image3]
          // } else if(data.result.image2){
          //   self.imgs = ["file://" + data.result.image1, "file://" + data.result.image2]
          // } else if (data.result.image1) {
          //   self.imgs = ["file://" + data.result.image1]
          // }
        })
      },
      handleBack(row) {
        this.$get('/asset_manage/apply/returnAsset', {
          applyId: row.id
        })
        .then(data => {
          this.getList()
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '归还成功'
          })
        })
      }
    }
  }
</script>

<style scoped>

</style>

