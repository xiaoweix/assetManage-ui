<template>
<div id="main-layout">
  <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
    <q-header elevated>
      <q-toolbar>
        <!-- 增加一个按钮 用来控制侧边栏的开关显示 -->
        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
        <q-toolbar-title>学院固定资产管理系统</q-toolbar-title>
        <span class="my-info">{{ $route.query.email }}</span>
        <span>注销</span>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      :width="200"
      :breakpoint="500"
      v-model="drawerLeft"
    >
      <q-scroll-area class="fit">
        <q-tree
          class="q-pl-md"
          :nodes="menu"
          node-key="label"
          no-connectors
          :selected.sync="selected"
          @click.native="getMenu"
        />
      </q-scroll-area>
    </q-drawer>

    <q-page-container style="padding-top: 50px;padding-left: 220px; padding-right: 20px">
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</div>
</template>

<script>
  export default {
    name: "MainLayout",
    data() {
      return {
        selected: '首页',
        menu: [],
        drawerLeft: false
      }
    },
    created() {
      const statusFlag = sessionStorage.getItem("userCode")
      if (statusFlag == 1) {
        this.menu = [
          {
            label: '首页'
          },
          {
            label: '资产列表'
          },
          {
            label: '个人中心'
          },
          {label: '资产地图'}
        ]
      } else if (statusFlag == 2) {
        this.menu = [
          {
            label: '首页'
          },
          {
            label: '资产列表'
          },
          {
            label: '个人中心'
          },
          {label: '资产地图'}
        ]
      } else if (statusFlag == 3) {
        this.menu = [
          {
            label: '首页'
          },
          {
            label: '资产管理',
            children: [
              {
                label: '资产列表'
              },
              {
                label: '资产入库'
              },
              {
                label: '资产使用历史'
              }
            ]
          },
          {
            label: '个人中心'
          },
          {
            label: '仓库管理',
            children: [
              {
                label: '仓库列表'
              }
            ]
          },
          {
            label: '用户管理',
            children: [
              {
                label: '用户列表'
              },
              {
                label: '添加用户'
              }
            ]
          },
          {
            label: '综合日志管理',
            children: [
              {
                label: '信息列表'
              },
              {
                label: '操作日志'
              }
            ]
          },
          {label: '资产地图'}
        ]
      } else if (statusFlag == 9) {
        this.menu = [
          {
            label: '首页'
          },
          {
            label: '资产管理',
            children: [
              {
                label: '资产列表'
              },
              {
                label: '资产入库'
              },
              {
                label: '资产使用历史'
              }
            ]
          },
          {
            label: '个人中心'
          },
          {
            label: '仓库管理',
            children: [
              {
                label: '仓库列表'
              }
            ]
          },
          {
            label: '用户管理',
            children: [
              {
                label: '用户列表'
              },
              {
                label: '添加用户'
              }
            ]
          },
          {
            label: '综合日志管理',
            children: [
              {
                label: '信息列表'
              },
              {
                label: '操作日志'
              }
            ]
          },
          {label: '资产地图'}
        ]
      } else {
        console.log(statusFlag);
        this.$q.notify({
          color: 'red-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: '服务器繁忙，请稍后再试'
        })
      }
      this.getMenu()
    },
    methods: {
      getMenu() {
        const menu = this.selected
        console.log(menu);
        if(menu == '首页') {
          this.$router.push('/main').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '资产列表') {
          this.$router.push('/main/asset-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '资产入库') {
          this.$router.push('/main/asset-warehousing').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '资产管理') {
          this.$router.push('/main/asset-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '资产使用历史') {
          this.$router.push('/main/asset-use-history').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '个人中心') {
          this.$router.push('/main/profile').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '仓库管理') {
          this.$router.push('/main/warehouse').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '仓库列表') {
          this.$router.push('/main/warehouse').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '用户管理') {
          this.$router.push('/main/user-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '用户列表') {
          this.$router.push('/main/user-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '添加用户') {
          this.$router.push('/main/add-user').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '综合日志管理') {
          this.$router.push('/main/info-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '操作日志') {
          this.$router.push('/main/lot-log').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '信息列表') {
          this.$router.push('/main/info-list').catch(err => {
            console.log('输出报错',err)
        })
        } else if (menu == '资产地图') {
          this.$router.push('/main/asset-map').catch(err => {
            console.log('输出报错',err)
        })
        }
      }
    }

  }
</script>

<style scoped lang="sass">
.q-header
  height: 50px
  background: #33CCFF
  padding: 0 20px
.my-info
  margin-right: 30px
.q-page-container
  padding: 10px 20px
</style>
