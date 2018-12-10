<template>
  <ve-bar height="440px" :series="series" :legend-visible="false" :yAxis="yAxis" :xAxis="xAxis"></ve-bar>
</template>

<script>
  import _ from 'lodash'
  import echarts from 'echarts'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
  import api from '../../api/api.js'
  const groupName = [];
  export default {
    name: 'contractNum',
    data() {
      return {
        series: {
          name: '目录主题',
          type: 'bar',
          data: [],
          //设置柱子的宽度
          barWidth : 10,
          label: {
            show: true,
            position: ['0%', '150%'],
            color: '#fff',
            formatter: function(n) {
              return groupName[n.dataIndex];
            }
          },
          //配置样式
          itemStyle: {   
            //通常情况下：
            normal:{  
              color: new echarts.graphic.LinearGradient(
                0, 0, 1, 0,
                [
                  {offset: 0, color: '#3D6AF2'},
                  {offset: 1, color: '#43A8F5'}
                ]
              ),
              barBorderRadius: 10
            },
          },
        },
        yAxis: {
          type: "category",
          data: [],
          axisLabel: {
            color: "#fff",
            fontSize: "10",
            interval: 0
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: "rgba(255, 255, 255, .2)"
            }
          }
        },
        xAxis: {
          show: false,
          axisLabel: {
            color: "rgba(255, 255, 255, .2)"
          },
          splitLine: {
            show: false,
            // lineStyle: {
            //   color: "rgba(255, 255, 255, .2)"
            // }
          }
        },
      }
    },
    methods: {
      async getData() {
        try {
          const response = await http(ServerAddress.getContractTop, {}, 'get')
          const { data: { data, code }} = response;
          _.forEach(data, (item, index) => {
            this.series.data.unshift(item.num);
            this.yAxis.data.unshift({
              value: index + 1
            });
            groupName.unshift(item.name);
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
  
</style>