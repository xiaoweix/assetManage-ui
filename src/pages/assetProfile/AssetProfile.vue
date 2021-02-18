<template>
  <div id="asset-profile">
    <SubTitle :subTitle="subTitle"/>
    <div id="all-count" class="row justify-between">
      <SpecificAsset :myColor="allColor" :title="allTitle" :number="allNum"/>
      <SpecificAsset :myColor="useColor" :title="useTitle" :number="useNum"/>
      <SpecificAsset :myColor="borrowColor" :title="borrowTitle" :number="borrowNum"/>
      <SpecificAsset :myColor="badColor" :title="badTitle" :number="badNum"/>
    </div>
    <div class="bar-box row justify-between q-mt-lg">
      <div id="assetsUse" style="width: 500px;height: 400px"></div>
      <div id="assetsBorrow" style="width: 500px;height: 300px"></div>
    </div>
    <div id="halfYearUse" style="width: calc(100vw - 300px);height: 400px"></div>
  </div>
</template>

<script>
  import SubTitle from "components/common/SubTitle";
  import SpecificAsset from "components/SpecificAsset";
  export default {
    name: "AssetProfile",
    data() {
      return {
        subTitle: '资产概况',
        allColor: '#FFDF25',
        allTitle: '资产总数量',
        allNum: '',
        useColor: '#36A9CE',
        useTitle: '投入使用的资源数量',
        useNum: '',
        borrowColor: '#D0E17D',
        borrowTitle: '出借资源数量',
        borrowNum: '',
        badColor: '#EF5AA1',
        badTitle: '损坏资源数量',
        badNum: '',
        pieData: [],
        xBarData: [],
        yBarData: []
      }
    },
    components: {
      SubTitle,
      SpecificAsset
    },
    mounted(){
    },
    created() {
      this.$get('/asset_manage/dataVisible/index')
        .then(data => {
          let res = data.result;
          this.badNum = res.assetDamageNum.toString();
          this.useNum = res.assetInUse.toString();
          this.borrowNum = res.lendAssetNum.toString();
          this.allNum = res.assetSum.toString();
          const { assetUseLend, assetUseReceive, assetUseConstant, assetUserRepair } = res
          this.pieData = [
            {value: assetUseLend, name: '借用'},
            {value: assetUseReceive, name: '领用'},
            {value: assetUserRepair, name: '维修'},
            {value: assetUseConstant, name: '固定使用'}
          ]
          for(let i = 0; i < res.assetLendRankList.length; i++) {
            this.xBarData.push(res.assetLendRankList[i].assetName)
            this.yBarData.push(res.assetLendRankList[i].assetNum)
          }
          // if(res.assetUseHalfYearBOList) {
          //   for(let i = 0; i < res.assetUseHalfYearBOList.length; i++) {
          //     this.xLineData.push(res.assetUseHalfYearBOList[i].assetName)
          //     this.yLineData.push(res.assetUseHalfYearBOList[i].assetNum)
          //   }
          //   this.drawLine();
          // } else {
          //   let halfYearDiv = document.getElementById('halfYearUse')
          //   let pDiv = document.getElementById('asset-profile')
          //   pDiv.removeChild(halfYearDiv)
          // }
          this.drawPie();
          this.drawBar();
          this.drawLine();
        })
    },
    methods: {
      drawPie() {
        // 基于准备好的dom，初始化echarts实例
        let myPie = this.$echarts.init(document.getElementById('assetsUse'))
        // 绘制图表
        myPie.setOption({
          title: {
            text: '资源使用情况',
            left: 'left'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          grid: {
            top: 10
          },
          legend: {
            orient: 'vertical',
            right: 'right',
            data: ['借用', '领用', '维修', '固定使用']
          },
          series: [
            {
              type: 'pie',
              radius: '55%',
              center: ['40%', '40%'],
              label:{
                position: 'inside',
                formatter: '{b}: {d}%'
              },
              data: this.pieData,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ],
          color: ['#749f83','#36AACE', '#ca8622', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3']
        });
      },
      drawBar() {
        let myBar = this.$echarts.init(document.getElementById('assetsBorrow'))
        myBar.setOption({
          title: {
            text: '资源借用排行'
          },
          color: ['#36A9CE'],
          tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
          },
          grid: {
            top: 80,
            bottom: 40
          },
          xAxis: [
            {
              type: 'category',
              data: this.xBarData,
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          series: [
            {
              type: 'bar',
              barWidth: '40%',
              data: this.yBarData
            }
          ]
        })
      },
      drawLine() {
        let myLine = this.$echarts.init(document.getElementById('halfYearUse'))
        myLine.setOption({
          title: {
            text: '最近半年资源使用情况'
          },
          xAxis: {
            type: 'category',
            data: ['2019-11', '2019-12', '2020-01', '2020-02', '2020-03', '2020-04', '2020-05']
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: [20, 32, 26, 10, 20, 28, 30],
            type: 'line'
          }],
          color: '#36A9CE'
        })
      }
    }
  }
</script>

<style scoped lang="sass">
#all-count
  margin-top: 30px
  padding: 10px 20px
  border: 1px solid #1D1D1D
</style>
