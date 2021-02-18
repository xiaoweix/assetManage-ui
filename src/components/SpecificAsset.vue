<template>
  <div class="specific-box row">
    <div class="point-box" :style="{ background:myColor }"></div>
    <div class="point-number column">
      <div class="text-h6">{{ number }}</div>
      <div>{{ title }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SpecificAsset",
    data() {
      return {

      }
    },
    props: {
      myColor: String,
      number: String,
      title: String
    }
  }
</script>

<style scoped lang="sass">
.point-box
  width: 50px
  height: 50px
.point-number
  margin-left: 20px
</style>
