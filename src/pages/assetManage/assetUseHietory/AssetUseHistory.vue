<template>
  <div>
    <SubTitle :subTitle="subTitle"/>
    <div class="query">
      <el-form :inline="true" :model="queryList" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="queryList.id" placeholder="输入编号进行查询"></el-input>
        </el-form-item>
        <el-form-item label="使用人">
          <el-input v-model="queryList.user" placeholder="输入使用人进行查询"></el-input>
        </el-form-item>
        <el-form-item label="资产名">
          <el-input v-model="queryList.asset" placeholder="输入资产名进行查询"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="queryList.status">
            <el-option label="申领" value="申领"></el-option>
            <el-option label="使用" value="使用"></el-option>
            <el-option label="借用" value="借用"></el-option>
            <el-option label="维修" value="维修"></el-option>
            <el-option label="报废" value="报废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <el-table
        :data="assetList"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="id"
          align="center"
          label="申请编号"
          width="120">
        </el-table-column>
        <el-table-column
          prop="assetName"
          align="center"
          label="资产名">
        </el-table-column>
        <el-table-column
          prop="userName"
          align="center"
          label="使用人">
        </el-table-column>
        <el-table-column
          prop="startTime"
          align="center"
          label="开始时间">
        </el-table-column>
        <el-table-column
          prop="applyType"
          align="center"
          label="类型">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="180">
          <template slot-scope="scope">
            <el-button @click="handleView(scope.row)" type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog :modal-append-to-body="false"
               width="40%"
               :visible.sync="dialogView"
               title="资产申请详情">
      <el-form :model="assetDetail" label-width="120px" disabled>
        <el-form-item label="资产名">
          <el-input v-model="assetDetail.assetName"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetDetail.assetVersion"></el-input>
        </el-form-item>
        <el-form-item label="使用地点">
          <el-input v-model="assetDetail.address"></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-input v-model="assetDetail.startTime"></el-input>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-input v-model="assetDetail.endTime"></el-input>
        </el-form-item>
        <el-form-item label="紧急程度">
          <el-input v-model="assetDetail.urgency"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="assetDetail.count"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetDetail.remarks" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogView = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "AssetUseHistory",
    data() {
      return {
        subTitle: '资产使用历史',
        dialogView: false,
        queryList: {
          id:'',
          user:'',
          asset:'',
          status: ''
        },
        assetList: [],
        assetDetail: {}
      }
  },
    created() {
      this.getList()
    },
    components: {
      SubTitle
    },
    methods: {
      onSubmit() {
        this.getList()
      },
      handleView(row) {
        this.dialogView = true
        this.$get('/asset_manage/apply/assetApplyDetail', {
          id: row.id
        })
        .then(data => {
          this.assetDetail = data.result
        })
      },
      getList() {
        const types = [['1', '2', '3', '4', '5'], ['借用', '申领', '使用', '采购', '反馈']]
        let myStatus = this.queryList.status
        for (let i = 0; i < types[0].length; i++) {
          if (myStatus == types[1][i]) {
            myStatus = types[0][i]
          }
        }
        this.$get('/asset_manage/asset/getHistoryList', {
          applyId: this.queryList.id,
          assetName: this.queryList.asset,
          userName: this.queryList.user,
          type: myStatus
        }).then(data => {
          for(let i = 0; i < data.result.length; i++) {
            data.result[i].startTime = this.dateFormat(data.result[i].startTime)
            for (let j = 0; j < types[0].length; j++) {
              if (data.result[i].applyType == types[0][j]) {
                data.result[i].applyType = types[1][j]
              }
            }
          }
          this.assetList = data.result
        })
      },
      dateFormat:function(time) {
        var date=new Date(time);
        var year=date.getFullYear();
        /* 在日期格式中，月份是从0开始的，因此要加0
         * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
         * */
        var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
        var day=date.getDate()<10 ? "0"+date.getDate() : date.getDate();
        var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
        var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
        var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
        // 拼接
        return year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
      }
    }
  }
</script>

<style scoped lang="sass">
.query
  margin-top: 20px
/deep/.el-input .el-input__inner
  height: 32px
.el-form-item
  margin: 0 5px
.list
  margin-top: 20px
</style>
