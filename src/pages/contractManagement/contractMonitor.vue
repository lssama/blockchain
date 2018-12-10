<template>
  <div class="contract-monitor">
		<div class="base-card">
			<h4 class="contract-title">
				被订阅的合约
			</h4>
			<div class="mt12">
				<el-form ref="form" class="clear" label-width="100px">
						<el-form-item label="合约名称:">
							<el-input v-model="dataName" class="search-inner-input" placeholder="请输入合约名称"></el-input>
							<el-button type="primary" class="fr search-btn" @click="getMonitorList(1,15)">检索</el-button>
						</el-form-item>
				</el-form>
			</div>
		</div>
		<div class="total-des fr">
        检索结果共有  <span class="color-blue">{{totalPageSize}}</span>  条
    </div>
    <div class="table-card mt50 clear">
      <el-table :data="contractList" header-cell-class-name="table-head" cell-class-name="table-cell"  style="width: 100%">
        <el-table-column prop="id" align="center" label="合约编号">
				</el-table-column>
				<el-table-column prop="contractName" align="center" label="合约名称">
				</el-table-column>
				<el-table-column
					align="center"
					prop="contractType"
					label="合约类型">
					<template slot-scope="scope">
						<span class="group-contract"  v-if="scope.row.contractType == 2">组合类型</span>
						<span class="data-contract" v-if="scope.row.contractType == 1">数据类型</span>
					</template>
				</el-table-column>
        <el-table-column prop="organizationName" align="center" label="访问机构">
        </el-table-column>
        <el-table-column label="当日更新" align="center">
						<template slot-scope="scope">
							<!-- isRUpdateToday 0 没有更新 1更新 -->
							<svg class="icon color-grey f-size-20" :class="scope.row.isRUpdateToday==1 ? 'right-color' : 'error-color'" aria-hidden="true">
								<use xlink:href="#icon-zhengque"></use>
							</svg>
						</template>
        </el-table-column>
        <el-table-column prop="useTimes" label="交换次数" align="center">
        </el-table-column>
        <el-table-column min-width="120px" label="最后交换时间" align="center">
					<template slot-scope="scope">
						<span v-if="scope.row.updateTime">{{scope.row.updateTime | formatDate}}</span>
						<span v-else>--</span>
					</template>
        </el-table-column>
        <el-table-column prop="canUse" label="交换状态" align="center">
          <template slot-scope="scope" >
						<svg class="icon color-grey f-size-14 " :class="scope.row.canUse==1 ? 'right-color' : 'error-color'" aria-hidden="true">
							<use xlink:href="#icon-CombinedShape"></use>
						</svg>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="查看" align="center">
          <template slot-scope="scope">
            <a href="javascript:;" @click='myContractList(scope.row.id)' class="color-blue text-line-btm mr10">详情</a>
            <a href="javascript:;" @click="logsList(scope.row.chainAddress)" class="color-blue text-line-btm">日志</a>
          </template>
        </el-table-column>
			</el-table>
			<Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize"
		:perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />
		</div>
    <el-dialog
			title="详情"
			:visible.sync="dialogVisible"
			width="540px"
			:class = "{'detail-dialog':true,'detail-dialog-btm': detailForm.ContractType == 2}"
			:before-close="handleClose">
			<div class="detail-pop" :class="{'data-pop': detailForm.ContractType == 1, 'group-pop': detailForm.ContractType == 2}">
				<div class="type-list" v-if="detailForm.ContractType == 2" v-for="(item, index) in detailForm.Resources" :key="index">
					<div class="color-333">{{index == 0 ? '数据资源' : index == 1 ? '算法资源': '算力资源'}}</div>
					<div>
						<div class="detail-pop-item">
							<span class="detail-left">信息资源名称:</span>
							<span class="detail-right">{{item.name}}</span>
						</div>
						<div class="detail-pop-item">
							<span class="detail-left">发布机构:</span>
							<span class="detail-right">{{item.providerName}}</span>
						</div>
						<div class="detail-pop-item">
							<span class="detail-left">发布时间:</span>
							<span class="detail-right">{{item.createTime | formatDate}}</span>
						</div>
					</div>
				</div>
				<div class="detail-pop-item"  v-if="detailForm.ContractType == 2">
					<span class="detail-left">合约名称:</span>
					<span class="detail-right">{{detailForm.ContractName}}</span>
				</div>
				<div class="detail-pop-item" v-if="detailForm.ContractType == 1">
					<span class="detail-left">信息资源名称:</span>
					<span class="detail-right">{{detailForm.ContractName}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">发布机构:</span>
					<span class="detail-right">{{detailForm.OrganName}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">数据用途:</span>
					<span class="detail-right">{{detailForm.DataUse}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">合约周期:</span>
					<span class="detail-right">{{detailForm.ContractPeriod |TypePeriod}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">共享方式:</span>
					<span class="detail-right">{{detailForm.cataPermission | TypePermission}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">获取方式:</span>
					<span class="detail-right">{{detailForm.EngineType==1?"中心化":"去中心化"}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">审批状态:</span>
					<span class="detail-right">{{detailForm.Status ? detailForm.Status== 1 ? '通过' : detailForm.Status== 2 ? '被驳回': '过期': '待审核'}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">审批意见:</span>
					<span class="detail-right">{{detailForm.Opinion}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">链上地址:</span>
					<span class="detail-right">{{detailForm.ChainAddress}}</span>
				</div>
			</div>
		</el-dialog>
  </div>
</template>
<script>
	import moment from 'moment';
	import http from "../../api/http.js";
	import ServerAddress from "../../api/serverAddress.js";
	import Pageination from '../common/pagination.vue';
	import api from '../../api/api.js'
  export default {
		components: {
			Pageination,
		},
    data() {
      return {
        formInline: {
          status: '',
          type: ''
        },
        contractList: [{dataName: 'string', isRUpdateToday: 1, canUse: 1}, {dataName: 'string', isRUpdateToday: 0, canUse: 0}],
				perPage: 15,          //每页显示条目个数
        totalPageSize: 0,    //总条目数
        perShow: false,       //分页是否显示
				currentPage: 1,
        dialogVisible: false,
        logListVisible: false,
        detailForm: {},
        tract: [],
        dataName: '',
      }
    },
    methods: {
			throttleSearch(obj, page){
				this.perPage = obj.pageSize;
				this.currentPage = obj.pageNumber + 1;
				this.getMonitorList();
			},
      myContractList(id) {
        this.dialogVisible = true;
				const params = {
					id: id
				};
				http(ServerAddress.contractDetail, params, 'get').then(result => {
					if (result.data.code === 0) {
						this.detailForm = result.data.data;
						this.detailForm.cataPermission = this.detailForm.Resources[0].cataPermission;
						this.dialogVisible = true;
					} else {
						this.$message.error('获取数据失败');
					}
				})
      },
      handleClose() {
        this.dialogVisible = false;
      },
      handleLogClose(){
				this.logListVisible = false;
			},
      logsList(address){
				this.$router.push({path:`/contractLog`, query: {address, path: 2}})
			},
			getMonitorList(page, size){
				const params = {
					page: this.currentPage,
					size: this.perPage,
					DataName: this.dataName,
					Issuer: JSON.parse(api.getLS('userInfo')).address,
				};
				http(ServerAddress.contractMonitor, params).then(result => {
					if (result.data.code === 0) {
						const { data: {dataList = [], count} }  = result.data;
						Object.assign(this, {
							perShow: count === 0 ? false : true,
							contractList: dataList,
							totalPageSize: count,
						})
					} else {
						this.$message.error('获取数据失败');
					}
				})
			}
		},
		mounted() {
			this.getMonitorList(1, 15);
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
            return '买方支付'
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
			},
			TypePeriod(value) {
        switch(value) {
          case 0:
            return '无限期'
          case 1:
            return '一天'
          case 2:
            return '三天'
          case 3:
            return '七天'
          case 4:
            return '15天'
          case 5:
            return '一个月'
          case 6:
            return '6个月'
          case 7:
            return '1年'
          default:
            return '';
        }
			},
			TypePermission(value){
				switch(value) {
          case 0:
            return '在线查询'
          case 1:
            return '接口访问'
          case 2:
            return '下载'
        }
			},
		}
  };

</script>

<style lang="less">
  .contract-monitor {
    font-size: 14px;
    -webkit-box-sizing: border-box;
		box-sizing: border-box;
		.contract-title{
			font-size: 20px;
			color: rgba(0,0,0,0.85);
      margin-bottom: 30px;
		}

    .base-card {
      background-color: #fff;
			padding: 24px 40px 20px;
			.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
				width: max-content;
				float: left;
				margin-right: 56px;
				margin-bottom: 0;
				&:last-child{
					margin-right: 0;
				}
				.el-form-item--small .el-form-item__content{
					width: min-content;
				}
			}
			
			.green-circle{
				display: block;
				width: 10px;
				height: 10px;
				border-radius: 10px;
				background-color: #0B9914;
			}
			.gray-circle{
				display: block;
				width: 10px;
				height: 10px;
				border-radius: 10px;
				background-color: #999999;
			}
		}
		.total-des{
      margin-right: 40px;
      margin-top: 19px;
      font-size: 13px;
      color: #999999;
    }
		.table-card{
			margin-left:40px;
			margin-right:40px;
			.right-color{
				color: #21D673;
			}
			.error-color{
				color:  #DEE0E4;
			}
		}

    .line-mid {
      float: left;
      margin: 0 10px;
    }

    .detail-pop{
			.type-list{
				border-bottom: 1px solid  #ECEEF3;
				padding: 11px 0;
			}
			.detail-pop-item{
				/* margin-top: 11px; */
			}
			.detail-left{
				font-size: 14px;
				color: #999999;
			}
			.detail-right{
				float: right;
				font-size: 14px;
				color: #333333;
			}
		}
		.group-pop{
      .detail-pop-item {
        margin-top: 11px;
      }
    }
    .data-pop{
      .detail-pop-item {
        /* height: 60px; */
				line-height: 60px;
				border-top: 1px solid #ECEEF3;
      }
    }
		.detail-dialog{
			.el-dialog__header{
				padding-top: 30px;
				padding-bottom: 30px;
				/* border-bottom: 1px solid  #ECEEF3; */
				.el-dialog__title{
					font-size: 16px;
					color: #333333;
				}
				.el-dialog__headerbtn{
					font-size: 30px;
					.el-dialog__close{
						color: #333333;
					}
				}
			}
			.el-dialog__body{
				padding: 0 56px 50px;
			}
		}
		.detail-dialog-btm{
			.el-dialog__header{
				border-bottom: 1px solid  #ECEEF3;
			}
		}
		.text-line-btm{
			text-decoration: underline;
		}
  }

</style>
