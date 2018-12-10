<template>
  <ve-pie height="370px" :colors="color" :series="series" :legend="legend"></ve-pie>
</template>

<script>
import _ from "lodash";
import ServerAddress from "../../api/serverAddress.js";
import http from "../../api/http.js";
import api from "../../api/api.js";
export default {
  data() {
    return {
      color: [
        "#80E6DC",
        "#005DFF",
        "#0087DC",
        "#FFBF00",
        "#21DFB4",
        "#F8F81C",
        "#B8E986",
        "#417505"
      ],
      series: {
        name: "标题", // 提示框标题
        type: "pie",
        radius: "65%",
        center: ['50%', '40%'],
        selectedMode: "single",
        data: [], // 扇形区域数据
        itemStyle: {
          normal: {
            label: {
              show: false, //指示字与线
              // formatter: "{b} : {c} ({d}%)"  //显示百分比
            },
            labelLine: { //指示线
              show: false
            }
          }
        }
      },
      legend: {
        icon : 'circle',
        bottom: '0',
        itemWidth : 12,
        itemHeight : 12,
        orient: "horizontal", //图例列表的布局朝向。 horizontal - 横向 ， vertical - 竖向
        x: "center",
        // y: "bottom",
        bottom: 0, //  距离底部距离
        data: [],
        textStyle: {
          color : "#fff"
        }
      }
    };
  },
  methods: {
    async getData() {
      try {
        const response = await http(
          ServerAddress.getResourceByTheme,
          "",
          "get"
        );
        const {
          data: { data, code }
        } = response;
        _.forEach(data, (item, index) => {
          this.series.data.push({
            name: item.name,
            value: item.num
          });
          this.legend.data.push(item.name);
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