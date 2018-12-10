<template>
  <div class="contract-log">
    <div class="pre-page">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="before-link" :to="{ path: prePath }">{{prePathName}}</el-breadcrumb-item>
        <el-breadcrumb-item class="current-page">合约执行日志</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <el-table
				:data="tract"
        header-cell-class-name="table-head"
        cell-class-name="table-cell"
				style="width: 100%">
				<el-table-column
					align="center"
					label="时间">
					<template slot-scope="scope">
						<span >{{scope.row.Time | formatDate}}</span>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="流程">
					<template slot-scope="scope">
						<span class="color-blue">{{scope.row.Type | TypeDes}}</span>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="状态">
					<template slot-scope="scope">
						<span :class="{'color-F5222D': scope.row.Result!=0}">{{scope.row.Result === 0 ? '成功' : '失败'}}</span>
					</template>
				</el-table-column>
				<el-table-column
					align="center"
					label="执行批次">
					<template slot-scope="scope">
						<span>{{scope.row.Exectimes}}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="Id"
					align="center"
					label="执行ID">
				</el-table-column>
				<el-table-column
					prop="Desc"
					align="center"
					label="流程记录">
				</el-table-column>
				<el-table-column
					prop="Txhash"
					align="center"
					label="交易哈希">
				</el-table-column>
      </el-table>
      <Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize"
			:perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />
    </div>
  </div>
</template>

<script>
  import http from "../../api/http.js";
  import moment from 'moment';
  import ServerAddress from "../../api/serverAddress.js";
  import Pageination from '../common/pagination.vue';
  export default {
    components: {
			Pageination,
		},
    data() {
      return {
        tract: [],
        perPage: 15,          //每页显示条目个数
        totalPageSize: 0,    //总条目数
        perShow: false,       //分页是否显示
				currentPage: 1,
        prePath: '',
        prePathName: '',
      }
    },
    methods: {
      throttleSearch(obj, page){
				this.perPage = obj.pageSize;
				this.currentPage = obj.pageNumber + 1;
				this.logsList();
			},
      logsList(){
				const params = {
          page: this.currentPage,
					size: this.perPage,
					address: this.$route.query.address,
				}
				http(ServerAddress.orderTrack, params, 'post', 'chain').then(result => {
					// const { data } = result.data;
          // this.tract = data;
          // this.perShow = true;
          // this.totalPageSize = result.data.data.count;

          	if (result.data.code === 200) {
              const { data: {dataList = [], count} }  = result.data;
              // this.contractList = result.data.data.dataList;
              Object.assign(this, {
                perShow: count === 0 ? false : true,
                tract: dataList,
                totalPageSize: count,
              })
            } else {
              this.$message.error('获取数据失败');
            }
				})
      },
      prePage(){
        this.$router.go(-1);
      },
      getPath(from){
        this.prePath = from.path;
      }
    },
    mounted(){
      this.logsList();
      this.prePath = this.$route.query.path == 1 ? '/myContract': '/contractMonitor';
      this.prePathName = this.$route.query.path == 1 ? '我的合约': '被订阅的合约';
    },
    filters: {
			formDate(time) {
        if (time) {
          time = time * 1000;
          return moment(time).format('YYYY-M-D')
        }
			},
			formatDate(time) {
        if (time) {
					if (String(time).length == 10) {
						return moment(time * 1000).format('YYYY-M-D HH:mm:ss')
					} else {
						return moment(time).format('YYYY-M-D HH:mm:ss')
					}
				}
      },
      TypeDes(value) {
        switch(value) {
          case 0:
            return '合约创建'
          case 1:
            return '合约签名'
          case 2:
            return '创建完成'
          case 3:
            return '执行发起'
          case 4:
            return '数据上传'
          case 5:
            return '算法上传'
          case 6:
            return '计算完成'
          case 7:
            return '下载完成'
          default:
            return '';
        }
      }
		}
  }

</script>

<style lang="less">
.contract-log{
  .pre-page{
    height: 62px;
    line-height: 62px;
    background-color: #fff;
    padding-left: 39px;
    .el-breadcrumb{
      line-height: 62px;
    }
  }
  .content{
    margin: 38px 40px 0px;
    .content-title{
      height: 78px;
      line-height: 78px;
      padding-left: 50px;
      font-size: 16px;
      color: #333333;
      background-color: #fff;
    }
    tbody{
      .el-table__row{
        .cell{
          font-size: 12px;
        }
      }
    }
    .pagination{
      margin-top: 107px;
    }
  }
}
</style>
  