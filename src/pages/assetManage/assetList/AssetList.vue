<template>
  <div id="assets-list">
    <SubTitle :subTitle="subTitle"/>
    <q-btn color="primary"
           text-color="white"
           :style="{display: isShowButton ? 'inline-block': 'none'}"
           label="申请采购"
           @click="handleApply"
           class="apply"/>
    <div class="query">
      <el-form :inline="true" :model="queryList" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="queryList.id" placeholder="输入编号进行查询"></el-input>
        </el-form-item>
        <el-form-item label="仓库名">
          <el-input v-model="queryList.warehouse" placeholder="输入仓库名进行查询"></el-input>
        </el-form-item>
        <el-form-item label="资产名">
          <el-input v-model="queryList.asset" placeholder="输入资产名进行查询"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="queryList.status">
            <el-option label="" value=""></el-option>
            <el-option label="空闲" value="0"></el-option>
            <el-option label="使用中" value="使用中"></el-option>
            <el-option label="借用中" value="借用中"></el-option>
            <el-option label="维修中" value="维修中"></el-option>
            <el-option label="报废" value="报废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list" style="width: 100%; height: 600px;overflow: scroll;">
      <el-table
        :data="assetList"
        border
        style="width: 100%">
        <el-table-column
          fixed
          prop="id"
          align="center"
          label="资产编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="assetName"
          label="资产名"
          align="center"
          width="160">
        </el-table-column>
        <el-table-column
          prop="version"
          label="资产类型"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="status"
          label="资产状态"
          align="center"
          width="140">
        </el-table-column>
        <el-table-column
          prop="assetNum"
          label="资产数量"
          align="center"
          width="80">
        </el-table-column>
        <el-table-column
          prop="warehouseName"
          label="仓库"
          align="center"
          width="180">
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作">
          <template slot-scope="scope">
            <el-button @click="handleUse(scope.row)" type="text" size="small">详情</el-button>
            <el-button type="text" size="small" @click="handleBorrow(scope.row)" :disabled="scope.row.isD">借用</el-button>
            <el-button @click="handleEmploy(scope.row)" type="text" size="small" :style="{display: isShowApply ? 'inline-block': 'none'}" :disabled="scope.row.isU">使用</el-button>
            <el-button @click="handleReceive(scope.row)" type="text" size="small" :disabled="scope.row.isA">申领</el-button>
            <el-button type="text" size="small" @click="handleBad(scope.row)">反馈</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--弹框-->
    <!--资产借用申请-->
    <el-dialog title="资产借用申请"
               :modal-append-to-body="false"
               :visible.sync="dialogBorrowVisible">
      <el-form :model="assetBorrow" label-width="100px">
        <el-form-item label="资产名" disabled="true">
          <el-input v-model="assetBorrow.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号" disabled="true">
          <el-input v-model="assetBorrow.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用地点">
          <el-input v-model="assetBorrow.useAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="借用时间">
              <el-date-picker
                v-model="assetBorrow.borrowDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归还时间">
              <el-date-picker
                v-model="assetBorrow.sendDate"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="紧急程度">
          <template>
            <el-radio v-model="assetBorrow.urgent" label="1">不急</el-radio>
            <el-radio v-model="assetBorrow.urgent" label="2">一般</el-radio>
            <el-radio v-model="assetBorrow.urgent" label="3">急用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetBorrow.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBorrowVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBorrow">确 定</el-button>
      </div>
    </el-dialog>
    <!--资产领用申请-->
    <el-dialog title="资产领用申请"
               :modal-append-to-body="false"
               :visible.sync="dialogReceiveVisible">
      <el-form :model="assetReceive" label-width="100px">
        <el-form-item label="资产名">
          <el-input v-model="assetReceive.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetReceive.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用地点">
          <el-input v-model="assetReceive.useAddress" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="assetReceive.number" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="紧急程度">
          <template>
            <el-radio v-model="assetReceive.urgent" label="1">不急</el-radio>
            <el-radio v-model="assetReceive.urgent" label="2">一般</el-radio>
            <el-radio v-model="assetReceive.urgent" label="3">急用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetReceive.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogReceiveVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureReceive">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 使用 -->
    <el-dialog title="资产使用"
               :modal-append-to-body="false"
               :visible.sync="dialogEmploy">
      <el-form :model="assetEmploy" label-width="100px">
        <el-form-item label="资产名">
          <el-input v-model="assetEmploy.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetEmploy.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用地点">
          <el-input v-model="assetEmploy.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产地图">
          <el-select v-model="assetEmploy.mapId" placeholder="请选择">
            <el-option
              v-for="item in maps"
              :key="item.id"
              :label="item.mapName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetEmploy.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBadVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureEmploy">确 定</el-button>
      </div>
    </el-dialog>
    <!--资产损坏反馈-->
    <el-dialog title="资产损坏反馈"
               :modal-append-to-body="false"
               :visible.sync="dialogBadVisible">
      <el-form :model="assetBad" label-width="100px">
        <el-form-item label="资产名">
          <el-input v-model="assetBad.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetBad.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="损坏地点">
          <el-input v-model="assetBad.address" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="损坏程度">
          <template>
            <el-radio v-model="assetBad.badLevel" label="1">普通</el-radio>
            <el-radio v-model="assetBad.badLevel" label="2">一般</el-radio>
            <el-radio v-model="assetBad.badLevel" label="3">严重</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="损坏图片">
          <el-upload
            action="http://127.0.0.1:8092/asset_manage/file/fileUpload"
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
          <el-input v-model="assetBad.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBadVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureBad">确 定</el-button>
      </div>
    </el-dialog>
    <!--申请采购-->
    <el-dialog title="申请采购"
               :modal-append-to-body="false"
               :visible.sync="dialogApplyVisible">
      <el-form :model="assetApply" label-width="100px">
        <el-form-item label="资产名">
          <el-input v-model="assetApply.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetApply.model" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="生产厂家">
          <el-input v-model="assetApply.factory" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="紧急程度">
          <template>
            <el-radio v-model="assetApply.urgent" label="1">不急</el-radio>
            <el-radio v-model="assetApply.urgent" label="2">一般</el-radio>
            <el-radio v-model="assetApply.urgent" label="3">急用</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="数量">
          <el-input v-model="assetApply.count" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源图片">
          <el-upload
            action="http://127.0.0.1:8092/asset_manage/file/fileUpload"
            list-type="picture-card"
            :headers="fileHeader"
            auto-upload
            :on-success="fileSuccess"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="applyVisible">
            <img width="100%" :src="applyImg" alt="">
          </el-dialog>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetApply.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogApplyVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureApply">确 定</el-button>
      </div>
    </el-dialog>
    <!--资产详情-->
    <el-dialog title="资产详情"
               :modal-append-to-body="false"
               :visible.sync="dialogUseVisible">
      <el-form :model="assetUse" label-width="100px" :disabled="detail">
        <el-form-item label="资产名">
          <el-input v-model="assetUse.assetName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资产型号">
          <el-input v-model="assetUse.version" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="assetUse.manufacture" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单价">
          <el-input v-model="assetUse.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="资源类型">
          <el-input v-model="assetUse.useType" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="购买日期">
          <el-input v-model="assetUse.purchaseDate" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="使用年限">
          <el-input v-model="assetUse.life" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assetUse.remarks"
                    autocomplete="off"
                    type="textarea"
                    autosize></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogUseVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  export default {
    name: "AssetsList",
    data() {
      return {
        subTitle: '资产列表',
        detail: true,
        dialogBorrowVisible: false,
        dialogReceiveVisible: false,
        dialogBadVisible: false,
        dialogApplyVisible: false,
        dialogUseVisible: false,
        maps: [],
        queryList: {
          id: '',
          warehouse: '',
          asset: '',
          status: ''
        },
        fileHeader: {},
        assetList: [],
        dialogEmploy: false,
        assetEmploy: {},
        // 借用
        assetBorrow: {},
        // 申领
        assetReceive: {},
        assetBad: {},
        assetApply: {},
        assetUse: {},
        isShowButton: false,
        isShowApply: false,
        dialogImageUrl: '',
        dialogVisible: false,
        applyVisible: false,
        applyImg: '',
        employId: 0,
      }
    },
    components: {
      SubTitle
    },
    created() {
      this.getList()
      this.$get('/asset_manage/dataMap/assetMapList')
        .then(data => {
          this.maps = data.result
        })
      this.fileHeader = {
        'token': sessionStorage.getItem('token')
      }
      const code = sessionStorage.getItem('userCode')
      if(code == 1) {
        this.isShowButton = false
        this.isShowApply = false
      } else if (code == 2) {
        this.isShowButton = true
        this.isShowApply = false
      } else {
        this.isShowButton = true
        this.isShowApply = true
      }
    },
    methods: {
      onSubmit() {
        this.getList()
      },
      // 使用
      handleEmploy(asset) {
        this.dialogEmploy = true
        this.employId = asset.id
        this.assetEmploy.name = asset.assetName
        this.assetEmploy.model = asset.version
      },
      sureEmploy() {
        this.dialogEmploy = false
        this.$post('/asset_manage/apply/postApply', {
          assetId: this.employId,
          version: this.assetEmploy.model,
          remarks: this.assetEmploy.remarks,
          mapId: this.assetEmploy.mapId,
          type: 3,
        })
          .then((data) => {
            if(data.code == 200) {
              this.$q.notify({
                position: 'top',
                timeout: 250,
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: '提交成功'
              })
            }
          })
      },
      // 借用
      handleBorrow(asset) {
        this.dialogBorrowVisible = true
        this.assetBorrow.id = asset.id
        this.assetBorrow.name = asset.assetName
        this.assetBorrow.model = asset.version
      },
      sureBorrow() {
        this.dialogBorrowVisible = false
        this.$post('/asset_manage/apply/postApply', {
          address: this.assetBorrow.useAddress,
          assetId: this.assetBorrow.id,
          endTime: this.dateFormat(this.assetBorrow.sendDate),
          startTime: this.dateFormat(this.assetBorrow.borrowDate),
          urgency: this.assetBorrow.urgent,
          type: 1,
        })
        .then((data) => {
          if(data.code == 200) {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '提交成功'
            })
          }
        })
      },

      // 申领
      handleReceive(asset) {
        this.dialogReceiveVisible = true
        this.assetReceive.id = asset.id
        this.assetReceive.name = asset.assetName
        this.assetReceive.model = asset.version
      },
      sureReceive() {
        this.dialogReceiveVisible = false
        this.$post('/asset_manage/apply/postApply', {
          address: this.assetReceive.useAddress,
          assetId: this.assetReceive.id,
          urgency: this.assetReceive.urgent,
          remarks: this.assetReceive.remarks,
          number: this.assetReceive.number,
          type: 2,
        })
          .then(data => {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '提交成功'
            })
          })
      },

      // 详情
      handleUse(asset) {
        let useTypeArr = [['1', '2', '3'], ['借用', '领用', '使用']]
        this.dialogUseVisible = true
        this.assetUse.name = asset.assetName
        this.$get('/asset_manage/asset/assetDetail', {id: asset.id})
        .then(data => {
          for (let i = 0; i < useTypeArr[0].length; i++) {
            if (data.result.useType == useTypeArr[0][i]) {
              data.result.useType = useTypeArr[1][i]
            }
          }
          this.assetUse = data.result
        })
        .catch(err => console.log(err))
      },

      // 申请采购
      handleApply() {
        this.dialogApplyVisible = true
      },
      sureApply () {
        this.dialogApplyVisible = false
        this.$post('/asset_manage/apply/postApply', {
          address: this.assetApply.address,
          assetName: this.assetApply.name,
          manufacture: this.assetApply.factory,
          version: this.assetApply.model,
          urgency: this.assetApply.badLevel,
          remarks: this.assetApply.remarks,
          image1: this.assetApply.imgUrl1,
          image2: this.assetApply.imgUrl2,
          image3: this.assetApply.imgUrl3,
          type: 4,
        })
          .then(data => {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '提交成功'
            })
          })
      },
      // 反馈
      handleBad(asset) {
        this.dialogBadVisible = true
        this.assetBad.id = asset.id
        this.assetBad.name = asset.assetName
        this.assetBad.model = asset.version
      },
      sureBad() {
        this.dialogBadVisible = false
        this.$post('/asset_manage/apply/postApply', {
          address: this.assetBad.address,
          assetId: this.assetBad.id,
          urgency: this.assetBad.badLevel,
          remarks: this.assetBad.remarks,
          image1: this.assetBad.imgUrl1,
          image2: this.assetBad.imgUrl2,
          image3: this.assetBad.imgUrl3,
          type: 5,
        })
          .then(data => {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '提交成功'
            })
          })
      },
      // 我的图片上传
      fileSuccess(response, file, fileList) {
        console.log(response, file, fileList);
        if (fileList.length == 3) {
          this.assetBad.imgUrl1 = response.result[0]
          this.assetBad.imgUrl2 = response.result[1]
          this.assetBad.imgUrl3 = response.result[2]
        } else if (fileList.length == 2) {
          this.assetBad.imgUrl1 = response.result[0]
          this.assetBad.imgUrl2 = response.result[1]
        } else if (fileList.length == 1) {
          this.assetBad.imgUrl1 = response.result[0]
        } else {
          this.assetBad.imgUrl1 = ''
          this.assetBad.imgUrl2 = ''
          this.assetBad.imgUrl3 = ''
        }
      },

      getList() {
        let useTypeArr = [['1', '2', '3'], ['借用', '领用', '使用']]
        let statusArr = [['0', '1', '2', '3', '4', '5'], ['空闲中', '借用中', '使用中', '维修中', '报废']]
        let myStatus = this.queryList.status
        for (let i = 0; i < statusArr[0].length; i++) {
          if (myStatus == statusArr[1][i]) {
            myStatus = statusArr[0][i]
          }
        }
        this.$get('/asset_manage/asset/assetList', {
          currPage: 1,
          pageSize: 50,
          assetName: this.queryList.asset,
          assetId: this.queryList.id,
          warehouseName: this.queryList.warehouse,
          status: myStatus
        })
          .then(data => {
            for (let i = 0; i < data.result.length; i++) {
              if (data.result[i].useType == 1 && data.result[i].status == 0) {
                data.result[i].isD = false
                data.result[i].isU = true
                data.result[i].isA = true
              } else if (data.result[i].useType == 2 && data.result[i].status == 0) {
                data.result[i].isD = true
                data.result[i].isU = true
                data.result[i].isA = false
              } else if (data.result[i].useType == 3 && data.result[i].status == 0) {
                data.result[i].isD = true
                data.result[i].isU = false
                data.result[i].isA = true
              } else {
                data.result[i].isD = true
                data.result[i].isU = true
                data.result[i].isA = true
              }
          }
            for(let j = 0; j < statusArr[0].length; j++) {
              for (let i = 0; i < data.result.length; i++) {
                if (data.result[i].status == statusArr[0][j]) {
                  data.result[i].status = statusArr[1][j]
                }
              }
            }
            this.assetList = data.result
          })
        .catch(err => console.log(err))
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
      },

      // 图片上传测试
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      }
    }
  }
</script>

<style scoped lang="sass">
.apply
  margin-top: -50px
  float: right
.my-page
  position: fixed
  bottom: 20px
  left: 50%
  margin-left: -100px
.query
  margin-top: 30px
</style>
