<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="sass" scoped>
@import "css/app"
/deep/.el-input.is-disabled .el-input__inner
  background-color: transparent
  border: none
  color: #333
/deep/.el-textarea.is-disabled .el-textarea__inner
  background-color: transparent
  border: none
  color: #333
  cursor: not-allowed
</style>
