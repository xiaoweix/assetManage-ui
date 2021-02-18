<template>
  <div id="sub-title">
    <div class="text-h4">{{subTitle}}</div>
    <q-separator/>
  </div>
</template>

<script>
  export default {
    name: "SubTitle",
    props: {
      subTitle: String
    }
  }
</script>

<style scoped lang="sass">
#sub-title
  margin-top: 15px
.text-h4
  padding: 10px 0
.q-separator
  background: #aaa
  margin-bottom: 10px
</style>
