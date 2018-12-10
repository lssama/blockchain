<template>
  <div class="relation-graph">
      <div id="content" class="mt40" ref="graphBox"></div>
      
  </div>
</template>

<script>
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/graph';
  import http from "../../api/http.js";
  import ServerAddress from "../../api/serverAddress.js";
  import options from './graphOptions.js';
  import nodePic from '../../assets/imgs/homePage/Group.png'
  export default {
    name: 'DepartmentRelationship',
    data() {
      return {
        graphData: [],
        graphLinks: []
      }
    },
    // beforeRouteLeave (to, from, next) {
    //   // window.removeEventListener('resize', this._resize);
    //   window.onresize = function (){}
    //   next();
    // },
    methods: {
      getDatas(){
        http(ServerAddress.indexGetRelation, {}, 'get').then(result => {
          	if (result.data.code === 0) {
              const { data = [] }  = result.data;
              this.changeData(data);
            } else {
              this.$message.error('获取数据失败');
            }
				})
      },
      changeData(data){
        for (let key in data){
          let nodeKey = {};
          nodeKey.name = key;
          // nodeKey.categories = '分类一';
          nodeKey.symbol = `image://${nodePic}`;
          // nodeKey.symbolSize = 50;
          this.graphData.push(nodeKey);
          if (data[key].length) {
            for (let linkItem in data[key]) {
              let linkLine = {};
              linkLine.source = key;
              linkLine.target = data[key][linkItem].name;
              this.graphLinks.push(linkLine);
            }
          }
        }
        this.$nextTick(()=>{
          this.graphDraw();
        });
      },
      graphDraw () {
        var myChart = echarts.init(document.getElementById('content'));
        // console.log((982 - this.$refs.graphBox.offsetWidth) / 790);
        let params = _.merge(options.graphOptions(), {
          series:[{
            force: {
                  gravity: this.$refs.graphBox.offsetWidth > 863 ? 0.15 : (982 - this.$refs.graphBox.offsetWidth) / 790
                },
            data: this.graphData,
            links:this.graphLinks
          }]
        });
        myChart.setOption(params);
          let _this = this;
          window.onresize = function () {
            if (_this.$refs.graphBox) {
              let params2 = _.merge(options.graphOptions(), {
                series:[{
                  force: {
                    gravity:  _this.$refs.graphBox.offsetWidth > 863 ? 0.15 : (982 - _this.$refs.graphBox.offsetWidth) / 790
                  }
                }]
              });
              myChart.setOption(params2);
              myChart.resize(params2);
            }
          }
      }
    },
    created() {
    },
    mounted() {
      this.getDatas();
    },
    components: {
    }
  }
</script>

<style lang="less">
  .relation-graph {
    #content{
      width: 100%;
      min-width: 350px;
      height: 720px;
    }
  }
</style>