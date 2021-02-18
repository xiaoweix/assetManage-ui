const Login = () => import("pages/login/Login")
const ForgetPwd = () => import("pages/forgetPwd/ForgetPwd")
const Register = () => import("pages/register/Register")
const Main = () => import("layouts/MainLayout")
const AssetProfile = () => import("pages/assetProfile/AssetProfile")
const AssetsList = () => import("pages/assetManage/assetList/AssetList")
const Warehousing = () => import("pages/assetManage/assetWarehousing/Warehousing")
const AssetUseHistory = () => import("pages/assetManage/assetUseHietory/AssetUseHistory")
const Profile = () => import("pages/profile/Profile")
const Warehouse = () => import("pages/warehouse/Warehouse")
const UserList = () => import("pages/userManage/userList/UserList")
const AddUser= () => import("pages/userManage/addUser/AddUser")
const AssetMap = () => import("pages/asetMap/AssetMap")
const InfoList = () => import("pages/logManage/infoList/InfoList")
const LotLog = () => import("pages/logManage/lotLog/LotLog")



const routes = [
  {
    path: '',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/forget-password',
    component: ForgetPwd
  },
  {
    path: '/register',
    component: Register
  },
  {
    path: '/main',
    component: Main,
    redirect: '/main/asset-profile',
    children: [
      {
        path: 'asset-profile',
        component: AssetProfile
      },
      {
        path: 'asset-list',
        component: AssetsList
      },
      {
        path: 'asset-warehousing',
        component: Warehousing
      },
      {
        path: 'asset-use-history',
        component: AssetUseHistory
      },
      {
        path: 'profile',
        component: Profile
      },
      {
        path: 'warehouse',
        component: Warehouse
      },
      {
        path: 'user-list',
        component: UserList
      },
      {
        path: 'add-user',
        component: AddUser
      },
      {
        path: 'asset-map',
        component: AssetMap
      },
      {
        path: 'lot-log',
        component: LotLog
      },
      {
        path: 'info-list',
        component: InfoList
      },
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
