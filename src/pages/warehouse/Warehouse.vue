<template>
  <div>
    <SubTitle :subTitle="subTitle"/>
    <q-btn color="primary"
           text-color="white"
           label="新建仓库"
           @click="handleAddWarehouse"
           class="add-warehouse"/>
    <div class="query">
      <el-form :inline="true" :model="queryList" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="queryList.id" placeholder="输入编号进行查询"></el-input>
        </el-form-item>
        <el-form-item label="仓库名">
          <el-input v-model="queryList.warehouse" placeholder="输入仓库名进行查询"></el-input>
        </el-form-item>
        <el-form-item label="所在地名">
          <el-input v-model="queryList.address" placeholder="输入所在地名进行查询"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="wareList">
      <el-table :data="wareList" >
        <el-table-column
          prop="id"
          align="center"
          label="仓库编号">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          label="地图名">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="仓库所在地">
        </el-table-column>
        <el-table-column
          prop="assetNum"
          align="center"
          label="仓库资源数">
        </el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="count"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.row)" type="text" size="small">编辑</el-button>
            <el-button type="text" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--对话框-->
<!--    删除提示-->
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
<!--    修改-->
    <el-dialog
      title="编辑仓库"
      :visible.sync="dialogEdit"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <el-form :model="editRow" label-width="100px">
        <el-form-item label="仓库名">
          <el-input v-model="editRow.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库地点">
          <el-input v-model="editRow.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEdit = false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">确 定</el-button>
      </span>
    </el-dialog>
<!--    新建仓库-->
    <el-dialog
      title="添加仓库"
      :visible.sync="dialogAdd"
      :modal-append-to-body="false"
      top="120px"
      width="30%">
      <el-form :model="addRow" label-width="100px">
        <el-form-item label="仓库名">
          <el-input v-model="addRow.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库地点">
          <el-input v-model="addRow.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="仓库名">
          <el-select v-model="addRow.mapId" placeholder="请选择">
            <el-option
              v-for="item in maps"
              :key="item.id"
              :label="item.mapName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="addRow.remarks" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAdd = false">取 消</el-button>
        <el-button type="primary" @click="sureAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "Warehouse",
    data() {
      return {
        subTitle: '仓库列表',
        editRow: {},
        queryList: {},
        deleteId: '',
        currentRow: {},
        editId: 0,
        dialogEdit: false,
        dialogDelete: false,
        dialogAdd: false,
        wareList: [],
        maps: [],
        addRow: {}
      }
    },
    components: {
      SubTitle
    },
    created() {
      this.getWareList()
    },
    methods: {
      handleAddWarehouse() {
        this.dialogAdd = true
        this.$get('/asset_manage/dataMap/assetMapList')
          .then(data => {
            this.maps = data.result;
          })
      },
      onSubmit() {
        this.getWareList()
      },
      // 修改
      handleEdit (row) {
        this.dialogEdit = true
        this.editId = row.id
        this.$get('/asset_manage/warehouse/warehouseList',{assetId: row.id})
          .then(data => {
            this.editRow = data.result[0]
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
      sureEdit() {
        this.dialogEdit = false
        this.$post('/asset_manage/warehouse/modifyWarehouse',{id: this.editId,address: this.editRow.address,name:this.editRow.name})
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
      },
      // 删除
      handleDelete (row) {
        this.dialogDelete = true
        this.deleteId = row.id
        this.currentRow = row
      },
      sureDelete () {
        const id = this.deleteId
        this.dialogDelete = false
        this.$get('/asset_manage/warehouse/removeWarehouse', {
          warehouseId: id
        })
        .then(() => {
          for (let item in this.wareList) {
            if(this.wareList[item].id = id) {
              this.wareList.splice(item, 1)
              return this.wareList
            }
          }
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: data.msg
          })
        })
        this.currentRow = ''
      },

      sureAdd () {
        this.$post('/asset_manage/warehouse/addWarehouse', {
          name: this.addRow.name,
          address: this.addRow.address,
          remarks: this.addRow.remarks,
          mapId: this.addRow.mapId
        })
          .then(data => {
            this.wareList.push(this.addRow)
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
            console.log(err);
          })
        this.dialogAdd = false
      },
      getWareList() {
        this.$get('/asset_manage/warehouse/warehouseList', {
          currPage: 1,
          pageSize: 50,
          warehouseName: this.queryList.warehouse,
          assetId: this.queryList.id,
          address: this.queryList.address
        }).then(data => {
          for(let i = 0; i < data.result.length; i++) {
            // data.result[i].createTime = new Date(data.result[i].createTime)
            data.result[i].createTime = this.dateFormat(data.result[i].createTime)
          }
          this.wareList = data.result
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
.add-warehouse
  float: right
  margin-top: -45px
</style>
