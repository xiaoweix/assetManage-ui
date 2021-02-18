<template>
<div id="login">
  <div class="formArea">
    <Title></Title>
    <q-form
      @submit="onLogin"
      class="q-gutter-md"
    >
      <q-input
        filled
        v-model="account"
        label="请输入您的邮箱 *"
        lazy-rules
        :rules="[ val => val && val.length > 0 || '请输入正确的邮箱']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="请输入您的密码 *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || '请输入正确的密码'
        ]"
      />

      <div class="register" @click="$router.push('/register')">注册</div>
      <br>
      <div class="forgetPsd" @click="$router.push('/forget-password')">忘记密码</div>

      <div>
        <q-btn label="登录" type="submit" color="primary"/>
      </div>
    </q-form>
</div>
</div>
</template>

<script>
import Title from 'components/common/Title'
import { mapMutations } from 'vuex'

export default {
  name: "Login",
  data() {
    return {
      account: '',
      password: ''
    }
  },
  components: {
    Title
  },
  methods: {
    ...mapMutations(['changeLogin']),
    onLogin() {
      const self = this;
      const email = this.account
      const password = this.password
      this.$get('/login', { email,password })
        .then(res => {
          if(res.code == 200) {
            this.$router.push({ path: '/main', query: { email } })
            this.userToken = res.result.token
            this.userEmail = email
            this.userCode = res.result.code
            // 将用户token保存到vuex中
            this.changeLogin({
              token: this.userToken,
              userEmail: this.userEmail,
              userCode: this.userCode
            })
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'green-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: '登录成功'
            })
          }
          else if(res.code == 500) {
            this.$q.notify({
              position: 'top',
              timeout: 250,
              color: 'red-4',
              textColor: 'white',
              icon: 'cloud_done',
              message: res.msg
            })
          }
        })
        .catch(err =>  {
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'red-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '服务器繁忙，稍后再试'
          })
        })
    }
  }
}
</script>

<style scoped lang="sass">
.formArea
  position: relative
.q-form
  width: 400px
  position: absolute
  left: 50%
  margin-left: -200px
  margin-top: 100px
.q-btn
  width: 100%
.forgetPsd, .register
  float: right
  display: block
  margin: 0
  color: #31CCEC
  cursor: pointer
.forgetPsd:hover
  color: #1976D2
</style>
