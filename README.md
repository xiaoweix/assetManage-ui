

# Quasar App (cfams_quasar)

A Quasar Framework app

## Install the dependencies
```bash
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```


### Build the app for production
```bash
quasar build
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).



windows 配制 vscode 打开

```bash
npm install -g @quasar/cli
```

解决vue多次点击同一个路由报错问题

```javascript
.catch(err => {
            console.log('输出报错',err)
        })
```

/layouts/MainLayout.vue

添加一个  v-model 用来控制 <q-drawer></q-drawer>

```html
 <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
```

v-model 属性

```html
v-model="drawerLeft"
```

return data

```js
drawerLeft: false
```

/pages/assetManage/assetList  添加滑动条

```html
<div class="list" style="width: 100%; height: 600px;overflow: scroll;">
```

解决历史资产问题  

/pages/assetUseHistory/assetUserHistory.vue

```javascript
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
      方法：
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
      
```



后端：AssetInfoController.java 、AssetInfoService.java、AssetInfoserviceImpl.java、AssetApplyMapper.java 、 AssetApplyMapper.xml

这几个文件找到 History 然后修改一下 assetId 变为 applyId  、xml 文件中把 aa.asset_id 变为 aa.id

这几个





----

![image-20200611131002506](C:\Users\老白\AppData\Roaming\Typora\typora-user-images\image-20200611131002506.png)

![image-20200611131024782](C:\Users\老白\AppData\Roaming\Typora\typora-user-images\image-20200611131024782.png)

---

![image-20200611132319646](C:\Users\老白\AppData\Roaming\Typora\typora-user-images\image-20200611132319646.png)

---

