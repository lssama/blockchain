<template>
  <div class="hello">
    <ve-bar :series="series" :xAxis="xAxis" :yAxis="yAxis"></ve-bar>
  </div>
</template>

<script>
import _ from "lodash";
import echarts from 'echarts'
import ServerAddress from "../../api/serverAddress.js";
import http from "../../api/http.js";
import api from "../../api/api.js";
const groupName = [];
export default {
  data() {
    return {
      series: {
        name: "上链资源数量",
        type: "bar",
        data: [],
        //设置柱子的宽度
        barWidth: 10,
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
          normal: {
            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
            color: new echarts.graphic.LinearGradient(
              0, 0, 1, 0,
              [
                {offset: 0, color: '#6F4ECC'},
                {offset: 1, color: '#D86D99'}
              ]
            ),
            barBorderRadius: 10
          },
          //鼠标悬停时：
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)"
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
    };
  },
  methods: {
    async getData() {
      try {
        const response = await http(ServerAddress.getResourceTop, "", "get");
        const {
          data: { data, code }
        } = response;
        _.forEach(data, (item, index) => {
          this.series.data.unshift(item.num);
          this.yAxis.data.unshift({
            value: index + 1
          });
          groupName.unshift(item.name);
        });
      } catch (e) {
        console.log(e);
      }
    }
  },
  created() {
    this.getData();
  },
  components: {}
};
</script>

<style lang="less">
</style>