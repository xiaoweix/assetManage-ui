<template>
  <div class="lot-log">
    <sub-title :subTitle="subTitle"></sub-title>
    <div class="query">
      <el-form :inline="true" :model="queryList" class="demo-form-inline">
        <el-form-item label="操作人">
          <el-input v-model="queryList.name" placeholder="输入操作人进行查询"></el-input>
        </el-form-item>
        <el-form-item label="操作起止时间">
          <el-date-picker
            v-model="queryList.date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table :data="lotLogTable" >
      <el-table-column
        type="index"
        align="center">
      </el-table-column>
      <el-table-column
        prop="userName"
        label="操作人"
        align="center">
      </el-table-column>
      <el-table-column
        prop="remarks"
        label="操作内容"
        align="center">
      </el-table-column>
      <el-table-column
        prop="startTime"
        label="操作时间"
        align="center">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "LotLog",
    data() {
      return {
        subTitle: '操作日志',
        queryList: {},
        lotLogTable: []
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
      getList () {
        let dataFrom, dataEnd;
        if(this.queryList.date) {
          dataFrom = this.dateFormat(this.queryList.date[0])
          dataEnd = this.dateFormat(this.queryList.date[1])
        }
        this.$get('/asset_manage/logInfo/assetLogList', {
          currPage: 1,
          pageSize: 20,
          userName: this.queryList.name ? this.queryList.name : '',
          dataFrom,
          dataEnd
        })
          .then(data => {
            for(let i = 0; i < data.result.length; i++) {
              data.result[i].startTime = this.dateFormat(data.result[i].startTime)
            }
            this.lotLogTable = data.result
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

<style scoped>

</style>
