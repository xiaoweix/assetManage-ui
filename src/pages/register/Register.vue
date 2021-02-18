<template>
  <div>
    <Title></Title>
    <div class="text-h6 my-title" align="center">欢迎注册学院固定资产管理系统</div>
    <div id="register-form">
      <q-form
        class="q-gutter-md"
        @submit="onSubmit"
      >
        <!--用户名-->
        <q-input filled v-model="nickname" type="text">
          <template v-slot:before>
            用户名：
          </template>
        </q-input>
        <!--密码-->
        <q-input filled v-model="password" type="password">
          <template v-slot:before>
            密码：
          </template>
        </q-input>
        <!--确认密码-->
        <q-input filled v-model="password2" type="password">
          <template v-slot:before>
            确认密码：
          </template>
        </q-input>
        <!--手机号码-->
        <q-input filled v-model="phone" type="text">
          <template v-slot:before>
            手机号码：
          </template>
        </q-input>
        <!--电子邮箱-->
        <div class="row justify-between email-btn">
          <q-input filled v-model="email" type="email">
            <template v-slot:before>
              电子邮箱：
            </template>
          </q-input>
          <q-btn color="primary" @click="sendCode">获取验证码</q-btn>
        </div>

        <!--验证码-->
        <q-input filled v-model="code" type="text" class="myinput">
          <template v-slot:before>
            验证码：
          </template>
        </q-input>
        <!--个人签名-->
        <q-input filled v-model="mySay" type="textarea">
          <template v-slot:before>
            个人签名：
          </template>
        </q-input>

        <q-btn type="submit" color="primary" class="submit">提交</q-btn>
      </q-form>
    </div>
  </div>

</template>

<script>
  import Title from "components/common/Title";
  export default {
    name: "Register",
    data() {
      return {
        nickname: '',
        password: '',
        mySay: '',
        password2: '',
        phone: '',
        email: '',
        code: ''
      }
    },
    components: {
      Title
    },
    methods: {
      onSubmit() {
        this.$get('/email/checkEmail', {
          email: this.email,
          code: this.code
        })
          .then((data) => {
            if(data.code == 200) {
              this.$post('/register', {
                email: this.email,
                password: this.password,
                telephone: this.phone,
                signature: this.mySay,
                userName: this.nickname
              })
                .then(data => {
                  if(data.code == 200) {
                    this.$q.notify({
                      position: 'top',
                      timeout: 250,
                      color: 'green-4',
                      textColor: 'white',
                      icon: 'cloud_done',
                      message: data.msg + ",即将跳转注册页面"
                    })
                    setTimeout(function () {
                      self.$router.push('/login')
                    },5000);
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
                message: "验证码错误"
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
              message: "服务器繁忙，稍后再试"
            })
          })
      },
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
              message: "发送成功"
            })
          })
      }
    }
  }
</script>

<style scoped lang="sass">
#register-form
  width: 450px
  margin: 0 auto
.q-input
  margin: 0
.q-input/deep/.q-field__control
  height: 40px
.q-input/deep/.q-field__before
  width: 150px
  font-size: 20px
.email-btn
  margin: 0
  padding: 0
  .q-btn
    height: 40px
    margin-top: 5px
.q-textarea/deep/.q-field__before
  font-size: 20px
.submit
  width: 300px
  float: right
.my-title
  margin: 20px 0
</style>
