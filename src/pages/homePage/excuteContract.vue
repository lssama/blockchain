<template>
  <ve-ring height="370px" :series="series" :legend="legend"></ve-ring>
</template>

<script>
  import ServerAddress from '../../api/serverAddress.js'
  import http from '../../api/http.js'
  import api from '../../api/api.js'
  export default {
    name: 'excuteContract',
    data() {
      return {
        legend: {
          textStyle: {
            color: '#fff',
          },
          bottom: '0',
          itemWidth: 12,
          itemHeight: 12,
          icon: 'circle',
          data: [],
        },
        series: {
          type: 'pie',
          selectedMode: 'single',
          selectedOffset: 20,
          center: ['50%', '40%'],
          radius: ['70', '100'],
          label: {
            show: false,
          },
          labelLine: {
            show: false
          },
          itemStyle:{
              borderWidth:5, //设置border的宽度有多大
              borderColor:'#fff',
          },
          itemStyle: {
            color: function (params){
              const colorList = ['#80E6DC', '#005DFF', '#0087DC', '#FFBF00','#21DFB4', '#417505', '#B8E986', '#F8F81C'];
              return colorList[params.dataIndex];
            }
          },
          data: []
        }
      }
    },
    methods: {
      async getData() {
        try {
          const response = await http(ServerAddress.getContractExecTop, {}, 'get')
          const { data: { data, code }} = response;
          _.forEach(data, (item, index) => {
            this.series.data.push({
              name: item.name,
              value: item.num
            });
            this.legend.data.push({
              name: item.name
            });
          });
        } catch (e) {
          console.log(e)
        }
      }
    },
    created() {
      this.getData();
    },
    components: {
    }
  }
</script>

<style lang="less">
  .excuteContract {}
</style>