<template>
  <div>
    <SubTitle :subTitle="subTitle"/>
    <el-button type="primary"
               style="position: absolute; top: 70px; right: 20px"
               @click="addNum">资产补货</el-button>
    <el-form ref="warehousing"
             :model="warehousing"
             label-width="80px"
             class="warehousingForm">
      <el-form-item label="资产名称">
        <el-input v-model="warehousing.name"></el-input>
      </el-form-item>
      <el-form-item label="品牌型号">
        <el-input v-model="warehousing.model"></el-input>
      </el-form-item>
      <el-form-item label="生产商">
        <el-input v-model="warehousing.factory"></el-input>
      </el-form-item>
      <el-form-item label="采购价格">
        <el-input v-model="warehousing.price"></el-input>
      </el-form-item>
      <el-form-item label="资产寿命">
        <el-input v-model="warehousing.age"></el-input>
      </el-form-item>
      <el-form-item label="采购数量">
        <el-input v-model="warehousing.num"></el-input>
      </el-form-item>
      <el-form-item label="仓库名">
        <div class="row">
          <el-select v-model="warehousing.warehouseName">
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="类型">
        <div class="row">
          <el-select v-model="warehousing.type">
            <el-option
              v-for="item in types"
              :key="item.id"
              :label="item.typeName"
              :value="item.id">
            </el-option>
          </el-select>
          <div>没有想要的类型？点击
            <el-link type="primary" @click.native="addType = true"> 添加类型 </el-link>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="资源权限">
        <template>
          <el-radio v-model="warehousing.power" label="0">借用</el-radio>
          <el-radio v-model="warehousing.power" label="1">领用</el-radio>
          <el-radio v-model="warehousing.power" label="2">使用</el-radio>
        </template>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
          action="http://39.105.45.77:8082/asset_manage/file/fileUpload"
          list-type="picture-card"
          :headers="fileHeader"
          auto-upload
          :on-success="fileSuccess"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="warehousing.remarks"></el-input>
      </el-form-item>
      <el-form-item style="margin-top: 10px" class="row justify-between">
        <el-button> 取消 </el-button>
        <el-button type="primary" @click="sureAdd">确定</el-button>
      </el-form-item>
    </el-form>
    <!--弹框-->
    <el-dialog title="资产补货"
               :visible.sync="dialogAssetAdd"
               :modal-append-to-body="false">
      <el-form :model="queryAsset" :inline="true">
        <el-form-item label="资产名" label-width="100">
          <el-input v-model="queryAsset.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-button type="primary" @click="query">查 询</el-button>
      </el-form>
      <el-table :data="queryList" highlight-current-row @current-change="handleCurrentChange">
        <el-table-column property="id" label="资产ID"></el-table-column>
        <el-table-column property="assetName" label="资产名"></el-table-column>
        <el-table-column property="version" label="型号"></el-table-column>
        <el-table-column property="assetNum" label="剩余"></el-table-column>
      </el-table>
      <div class="text-h5 q-pt-md q-pb-lg">您选择的是 {{this.id}} {{this.name}} {{this.version}}</div>
      <div class="row">
        <div class="text-h6 q-pr-lg">采购数量</div>
        <el-input v-model="needCount" autocomplete="off" style="width: 100px"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAssetAdd = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="addType"
               width="25%"
               top="30vh"
               :modal-append-to-body="false">
      <div class="row">
        <div class="text-h6 q-pr-lg">类型名</div>
        <el-input v-model="typeName" autocomplete="off" style="width: 100px"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addType = false">取 消</el-button>
        <el-button type="primary" @click="sureAddType">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "Warehousing",
    data() {
      return {
        subTitle: '资产入库',
        dialogAssetAdd: false,
        queryAsset: {},
        queryList: [],
        fileHeader: {},
        needCount: 0,
        addType: false,
        warehousing: {},
        typeName: '',
        types: [],
        dialogImageUrl: '',
        dialogVisible: false,
        warehouses: [],
        id: 0,
        name: '',
        version: '',
        num: 0,
        assetNum: 0
      }
    },
    components: {
      SubTitle
    },
    created() {
      const self = this
      this.$get('/asset_manage/assetType/assetTypeList')
        .then(data => {
          self.types = data.result
        })
      this.fileHeader = {
        'token': sessionStorage.getItem('token')
      }
      this.$get('/asset_manage/warehouse/warehouseList')
        .then(data => {
          this.warehouses = data.result
        })
    },
    methods: {
      sureAdd() {
        this.$post('/asset_manage/asset/addAsset', {
          assetName: this.warehousing.name,
          assetNum: this.warehousing.num,
          image1: this.warehousing.imgUrl1,
          image1: this.warehousing.imgUrl2,
          image3: this.warehousing.imgUrl3,
          life: this.warehousing.age,
          version: this.warehousing.model,
          manufacture: this.warehousing.factory,
          price: this.warehousing.price,
          typeId: this.warehousing.type,
          useType: this.warehousing.power,
          warehouseId: this.warehousing.warehouseName
        })
        .then(data => {
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '添加成功'
          })
        })
      },
      query() {
        this.$get('/asset_manage/asset/assetList', {
          assetName: this.queryAsset.name
        })
          .then(data => {
            this.queryList = data.result
          })
      },
      sureAddType() {
        const self = this
        this.addType = false
        console.log(this.typeName)
        this.$post('/asset_manage/assetType/addAssetType', { typeName:this.typeName})
          .then(() => {
            this.$get('/asset_manage/assetType/assetTypeList')
              .then(data => {
                self.types = data.result
              })
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '添加成功'
            })
          })
      },
      fileSuccess(response, file, fileList) {
        console.log(response, file, fileList);
        if (fileList.length == 3) {
          this.warehousing.imgUrl1 = response.result[0]
          this.warehousing.imgUrl2 = response.result[1]
          this.warehousing.imgUrl3 = response.result[2]
        } else if (fileList.length == 2) {
          this.warehousing.imgUrl1 = response.result[0]
          this.warehousing.imgUrl2 = response.result[1]
        } else if (fileList.length == 1) {
          this.warehousing.imgUrl1 = response.result[0]
        } else {
          this.warehousing.imgUrl1 = ''
          this.warehousing.imgUrl2 = ''
          this.warehousing.imgUrl3 = ''
        }
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      addNum () {
        this.dialogAssetAdd = true
      },
      handleCurrentChange(val) {
        this.currentRow = val;
        this.id = val.id
        this.name = val.assetName
        this.version = val.version
        this.assetNum = val.assetNum
      },
      sure () {
        this.$post('/asset_manage/asset/modifyAsset', {
          id: this.id,
          assetNum: parseInt(this.assetNum) + parseInt(this.needCount)
        })
          .then(data => {
            this.dialogAssetAdd = false
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '修改成功'
            })
          })
      }
    }
  }
</script>

<style scoped lang="sass">
.warehousingForm
  width: 420px
  margin-top: 10px
  margin-left: 200px
.el-form-item
  margin: 0
  padding: 0
/deep/.el-input .el-input__inner
  height: 32px
/deep/.el-select
  width: 120px
  margin-right: 20px
</style>
