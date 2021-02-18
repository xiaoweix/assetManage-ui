<template>
  <div id="forgetPassword" class="relative-position">
    <Title></Title>
    <q-form
      class="q-gutter-md"
    >
      <div class="row justify-between my-email-row">
        <q-input
          filled
          type="email"
          v-model="email"
          label="请输入电子邮箱 *"
          lazy-rules
          :rules="[ val => val && val.length > 0 || '请输入正确邮箱']"
        />
        <q-btn label="获取邮箱验证码" @click="sendCode"/>
      </div>


      <q-input
        filled
        type="text"
        v-model="code"
        label="请输入邮箱验证码 *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || '请输入邮箱验证码'
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="newPassword"
        label="请输入新密码 *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || '请输入新密码'
        ]"
      />

      <q-input
        filled
        type="password"
        v-model="newPassword2"
        label="请确认密码 *"
        lazy-rules
        :rules="[
          val => val !== null && val !== '' || '请确认密码'
        ]"
      />

      <div class="row justify-between my-select" >
        <q-btn label="确认" type="sure" color="primary"/>
        <q-btn label="取消" type="cancel"/>
      </div>
    </q-form>
  </div>
</template>

<script>
import Title from "components/common/Title"
export default {
  name: "ForgetPwd",
  data() {
    return {
      email: '',
      code: '',
      newPassword: '',
      newPassword2: ''
    }
  },
  components: {
    Title
  },
  methods: {
    sendCode() {
      this.$get('/email/send', {
        email: this.email
      })
        .then(() => {
          this.$q.notify({
            position: 'top',
            timeout: 250,
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: '发送成功'
          })
        })
    },
    sendpsd() {
      if(this.newPassword == this.newPassword2) {
        this.$get('/email/checkEmail', {
          email: this.email,
          code: this.code
        })
          .then((data) => {
            if(data.code == 200) {
              this.$get('/password', {
                password: this.newPassword
              })
                .then(data => {
                  if(data.code == 200) {
                    this.$q.notify({
                      position: 'top',
                      timeout: 250,
                      color: 'green-4',
                      textColor: 'white',
                      icon: 'cloud_done',
                      message: data.msg
                    })
                  } else {
                    this.$q.notify({
                      position: 'top',
                      timeout: 250,
                      color: 'red-4',
                      textColor: 'white',
                      icon: 'cloud_done',
                      message: data.msg
                    })
                  }
                })
                .catch(err => {
                  this.$q.notify({
                    position: 'top',
                    timeout: 250,
                    color: 'red-4',
                    textColor: 'white',
                    icon: 'cloud_done',
                    message: err.msg
                  })
                })
            }
            else if (data.code == 500) {
              this.$q.notify({
                position: 'top',
                timeout: 250,
                color: 'red-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: '验证码错误'
              })
            }
          })
          .catch(err => {
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
}
</script>

<style scoped lang="sass">
.q-form
  width: 400px
  position: absolute
  left: 50%
  margin-left: -150px
  margin-top: 50px
.my-select .q-btn
  width: 40%
.my-email-row .q-btn
  height: 50px
</style>
