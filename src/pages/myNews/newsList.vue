<template>
	<div class="news-list">
		<div class="form-block clear">
			<h4 class="f-size-20 mb30">我的消息</h4>
			<el-form :inline="true" ref="form" class="news-list-form clear" label-width="70px">
				<el-form-item class="fl ml50" label="">
					<el-input v-model="form.KeyWord" class="search-inner-input" @keyup.native.enter="getData" placeholder="输入消息关键字"></el-input>
					<el-button type="primary" class="fr search-btn" @click="getData">检索</el-button>
				</el-form-item>
				<el-form-item class="fl ml100" label="">
					<el-select @change="selectChange" size="normal" class="w120" v-model="form.MsgStatus" placeholder="审核状态">
						<el-option label="全部" value="2"></el-option>
						<el-option label="已读" value="1"></el-option>
						<el-option label="未读" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="fl ml50" label="阅读日期:">
					<el-date-picker  v-model="form.date" type="daterange" range-separator="至" start-placeholder="开始日期"
					end-placeholder="结束日期" @change="changeDate">
					</el-date-picker>
				</el-form-item>
			</el-form>
		</div>
		<div class="data-list">
			<div class="f-size-13 color-999 fr mb16">检索结果共有  <span class="color-blue">{{totalPageSize}}</span>  条</div>
			<el-table :data="dataList" header-cell-class-name="table-head news-head" cell-class-name="table-cell">
				<el-table-column width="350px" label="标题">
					<template slot-scope="scope">
						<div class="fl">
							<span class="news-badge ml24" :class="getStatusColor(scope.row)">{{getStatus(scope.row)}}</span>
							<span class="f-weight-bold ml24">{{scope.row.AuditType === 0 ? '上链审核' : '合约审核'}}：</span>
						</div>
						<span>{{scope.row.AuditName}}</span>
					</template>
				</el-table-column>
				<el-table-column width="360px" align="center" prop="SendAddr" label="发送机构">
				</el-table-column>
				<el-table-column align="center" label="时间">
					<template slot-scope="scope">
						<span>{{scope.row.CreateTime | formDate}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" prop="resourceFormat" label="阅读状态">
					<template slot-scope="scope">
						<span :class="scope.row.MsgStatus ? 'color-grey' : ''">
							<i class="read-tip" v-show="scope.row.MsgStatus === 0"></i>
							{{scope.row.MsgStatus === 0 ? '未读': '已读'}}
						</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<span :class="scope.row.MsgStatus ? 'color-999 border-b-999' : 'color-blue border-b-blue'" class=" cur-p" @click="detail(scope.row)">查看</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pageination ref='pagination' :perPage="perPage" :totalPageSize="totalPageSize"
		:perShow="perShow" :currentPage="currentPage" @currentChange="getData($event, 'page')" />
		<el-dialog
			title="详情"
			:visible.sync="dialogVisible"
			:class = "{'detail-dialog':true,'detail-dialog-btm': detailForm.ContractType == 2, 'checked-dialog': detailForm.Status}"
			width="540px"
			:before-close="handleClose">
			<div class="detail-pop" :class="{'data-pop': detailForm.ContractType == 1, 'group-pop': detailForm.ContractType == 2}">
				<!-- 组合合约循环 -->
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
							<span class="detail-right">{{item.createTime | formDate}}</span>
						</div>
					</div>
				</div>
				<div class="detail-pop-item" v-if="detailForm.ContractType == 2">
					<span class="detail-left">合约名称:</span>
					<span class="detail-right">{{detailForm.ContractName}}</span>
				</div>
				<div class="detail-pop-item" v-if="detailForm.ContractType == 1">
					<span class="detail-left">信息资源名称:</span>
					<span class="detail-right">{{detailForm.ContractName}}</span>
				</div>
	
				<div class="detail-pop-item" v-if="detailForm.ContractType==1 && detailForm.Status">
					<span class="detail-left">发布机构:</span>
					<span class="detail-right">{{detailForm.OrganName}}</span>
				</div>
				<div class="detail-pop-item" v-else>
					<span class="detail-left">申请机构:</span>
					<span class="detail-right">{{detailForm.OrganName}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">数据用途:</span>
					<span class="detail-right">{{detailForm.DataUse}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">共享方式:</span>
					<span class="detail-right">{{detailForm.cataPermission | TypePermission}}</span>
				</div>
				<div class="detail-pop-item">
					<span class="detail-left">合约周期:</span>
					<span class="detail-right" >{{detailForm.ContractPeriod |TypePeriod}}</span>
				</div>
				<div class="detail-pop-item" v-if="detailForm.Status">
					<span class="detail-left">审批状态:</span>
					<span class="detail-right">{{detailForm.Status ? detailForm.Status== 1 ? '通过' : detailForm.Status== 2 ? '被驳回': '过期': '待审核'}}</span>
				</div>
				<div class="detail-pop-item" v-if="detailForm.Status">
					<span class="detail-left">审批意见:</span>
					<span class="detail-right">{{detailForm.Opinion}}</span>
				</div>
				<div class="detail-pop-item" v-if="detailForm.Status">
					<span class="detail-left">链上地址:</span>
					<span class="detail-right">{{detailForm.ChainAddress}}</span>
				</div>
				<div class="detail-pop-item"  :class="{'detail-pop-item-check': detailForm.ContractType == 2}" v-else>
          <span class="detail-left" :class="{'detail-left-check': detailForm.ContractType == 2}">审批意见:</span>
          <el-input type="textarea" class="advice" v-model="options"></el-input>
        </div>
			</div>
			<span slot="footer" class="dialog-footer" center="true" v-if="!detailForm.Status">
        <el-button type="primary" @click="auditSumit(1)">通 过</el-button>
        <el-button type="primary" class="reject-btn" @click="auditSumit(2)">驳 回</el-button>
      </span>
		</el-dialog>
	</div>
</template>

<script>
	import _ from 'lodash'
	import { mapActions } from 'vuex'
	import moment from 'moment'
	import Pageination from '../common/pagination.vue'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	import api from '../../api/api.js'
	export default {
		name: 'newsList',
		components: {
			Pageination,
		},
		data() {
			return {
				checkList: [],
				organizationTreeList: [],					//机构树状结构
				checkedOrganizationIdList: [],         //选中机构列表
				checkedOrganizationList: [],     //选中机构列表名字
				organizationIdList: [],     				 //机构列表id
				organizationList: [],						     //机构扁平列表
				checkAllOrganization: false,		     //是否全选
				isIndeterminate: false,					     //全选状态
				form: {
					KeyWord: '',
					MsgStatus: '',
					date: [],
				},
				StartDate: 0,
				EndDate: 0,
				keyWords: '',
				dataList: [],
				checkboxList: [],
				perPage: 15,          //每页显示条目个数
				totalPageSize: 0,    //总条目数
				perShow: false,       //分页是否显示
				currentPage: 1,       //当前页
				dialogVisible: false,
				detailForm: {},
				options: '',
			}
		},
		methods: {
			...mapActions([
        'getMessageList'
      ]),
			//详情
			async detail(message) {
				// 上链
				if (message.AuditType === 0) {
					this.$router.push(`/directoryCheck/${message.AuditId}`);
				}
				// 合约
				else {
					const params = {
						id: message.AuditId,
					}
					const response = await http(ServerAddress.contractDetail, params, 'get');
					if (response.data.code === 0) {
						this.detailForm = response.data.data;
						this.detailForm.cataPermission = this.detailForm.Resources[0].cataPermission;
						this.dialogVisible = true;
					} else {
						this.$message.error('获取数据失败');
					}
					// const { data: { data } } = response
					// this.popAudit = data;
					// this.dialogVisible = true;
				}
				// 如果未读
				if (message.MsgStatus === 0) {
					const params = {
						id: message.Id,
						status:1
					}
					await http(ServerAddress.messageUpdateStatus, params, 'post');
					this.getData();
					this.getMessageList();
				}
			},
			handleClose() {
        this.dialogVisible = false;
      },
			//获取数据列表
			async getData(pageConfig) {
				if (pageConfig) {
					if (pageConfig.pageSize) {
						this.currentPage = pageConfig.pageNumber + 1
						this.perPage = pageConfig.pageSize
					}
				}
				const userInfo = JSON.parse(api.getLS('userInfo'))
				const params = {
					// address: '0x6ab97b555c055745134f2a4ac4fa6cdc4dfb1c41',
					address: userInfo.address,
					KeyWord: this.form.KeyWord,
					MsgStatus: this.form.MsgStatus === '2' ? '' : this.form.MsgStatus,
					StartDate: this.StartDate / 1000,
					EndDate: this.EndDate / 1000,
					role: userInfo.role.join(','),
					page: this.currentPage,
					size: 15,
				}
				let response;
				try {
					response = await http(ServerAddress.messageSearch, params, 'post')
					const { data: { Details = [], Page, Size, Total } } = response.data;
					Object.assign(this, {
						perShow: Total === 0 ? false : true,
						dataList: Details,
						totalPageSize: Total,
					})
				} catch (e) {
					console.log(e)
				}
			},
			//修改时间
			changeDate(date) {
				if (date) {
					this.StartDate = date[0].getTime();
					this.EndDate = date[1].getTime() + 24 * 60 * 60 * 1000 - 1000;
				} else {
					this.StartDate = 0;
					this.EndDate = 0;
				}
				this.getData();
			},
			//合约审核
			auditSumit(status){
        const params = {
          Auditor: '1',
          Id: this.detailForm.Id,
          Opinion: this.options,
          Status: status
          // 1通过 2驳回
        }
        http(ServerAddress.contractAudit, params).then(result => {
          if (result.data.code === 0) {
            this.getMessageList();
            if (status == 1) {
              this.autoChain();
            }
            this.dialogVisible = false;
            this.getData();
          } else {
            this.$message.error('获取数据失败');
          }
          this.options = '';
        })
			},
			// 自动上链
      autoChain(){
        let Datas = [];
        let Algorithms = [];
        let Computes = [];
        if (this.detailForm.ContractType == 2){
          // this.detailForm.Resources[0].resourceAddress
          Datas.push(this.detailForm.Resources[0].chainAddress);
          Algorithms.push(this.detailForm.Resources[1].chainAddress);
          Computes.push(this.detailForm.Resources[2].chainAddress);
        } else {
          Datas.push(this.detailForm.Resources[0].chainAddress);
        }
        
        const userInfo = JSON.parse(api.getLS('userInfo'));
        const addParams = {
          Name: 'SSS',
          Balance: 0,
          Datas,
          Algorithms,
          Computes,
          Times: 1000000000,
          // Passwd: this.detailForm.Passwd,
          Passwd: userInfo.password,
          Issuer: this.detailForm.Issuer,
          // Issuer: userInfo.address,
          Id: this.detailForm.Id
        }
        http(ServerAddress.orderAdd, JSON.stringify(addParams), 'post', 'chain').then(result => {
          if (result.data.code === 200) {
            this.dialogVisible = false;
            this.getData();
          } else {
            this.$message.error("获取数据失败");
            // this.loading = false;
          }
        });
			},
			// 获取状态
			getStatus(message) {
				if (message.AuditType === 0) {
					switch (message.AuditStatus) {
						case 0:
							return '未提交审核'
						case 1:
							return '审核中'
						case 2:
							return '审核通过'
						case 3:
							return '驳回'
						default:
							break;
					}
				} else {
					switch (message.AuditStatus) {
						case 0:
							return '审核中'
						case 1:
							return '审核通过'
						case 2:
							return '驳回'
						default:
							break;
					}
				}
			},
			// 获取状态badge颜色
			getStatusColor(message) {
				const colorList = new Map([
					['0_0', ()=>{ return 'badge-red'}],
					['0_1', ()=>{ return 'badge-blue'}],
					['0_2', ()=>{ return 'badge-grey'}],
					['0_3', ()=>{ return 'badge-red'}],
					['1_0', ()=>{ return 'badge-blue'}],
					['1_1', ()=>{ return 'badge-grey'}],
					['1_2', ()=>{ return 'badge-red'}],
				]);
				let color = colorList.get(`${message.AuditType}_${message.AuditStatus}`)
				return color();
			},
			selectChange() {
				this.getData();
			},
		},
		created() {
			this.getData();
		},
		filters: {
			type(value) {
				switch (value) {
					case '0':
						return 'string'
					case '1':
						return 'int'
					case '2':
						return 'float'
					default:
						return '';
				}
			},
			required(value) {
				switch (value) {
					case '0':
						return '是'
					case '1':
						return '否'
					default:
						return '';
				}
			},
			resourceFormat(value) {
				switch (value) {
					case 0:
						return 'API'
					case 1:
						return '关系型数据库'
					case 2:
						return '非结构化文档'
					case 3:
						return '结构化文档'
				}
			},
			status(value) {
				switch (value) {
					case 0:
						return '未提交审核'
					case 1:
						return '审核中'
					case 2:
						return '审核通过'
					case 3:
						return '审核驳回'
					case 4:
						return '下架'
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
			updatePeriod(value) {
				switch (value) {
					case 0:
						return '实时'
					case 1:
						return '每日'
					case 2:
						return '每周'
					case 3:
						return '每月'
					case 4:
						return '每季度'
					case 5:
						return '每年'
					default:
						break;
				}
			},
			formDate(time) {
        if (time) {
          time = time * 1000;
          return moment(time).format('YYYY-M-D HH:mm:ss')
        }
			},
			contractPeriod(value) {
				switch (value) {
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
						break;
				}
			},
		}
	}
</script>

<style lang="less">
	.news-list {
		/* padding: 40px 40px 0; */
		/* box-sizing: border-box; */
		.search-inner-input{
			width: 278px;
			height: 40px;
			.el-input__inner{
				height: 40px;
				line-height: 40px;
			}
		}
		.search-btn{
			width: 84px;
			height: 40px;
			/* background: #2159D6; */
			border-radius: 0px 2px 2px 0px;
			font-size: 14px;
			color: #FFFFFF;
		}
		.el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
			margin-bottom: 20px;
		}
		.data-list {
			width: 100%;
			/* margin-top: 20px; */
			padding: 20px 40px;
			box-sizing: border-box;
			overflow: hidden;
			.news-head {
				text-align: center;
			}
			.read-tip {
				display: inline-block;
				width: 6px;
				height: 6px;
				border-radius: 50%;
				background-color: #1890FF;
				margin-right: 8px;
			}
			.news-badge {
				display: inline-block;
				padding: 2px 8px;
				background: #000;
				color: #fff;
				border-radius: 4px;
				&.badge-blue {
					background-color: #597EF7;
				}
				&.badge-grey {
					background-color: #FAFAFA;
					color: #000;
				}
				&.badge-red {
					background-color: #F5222D;
				}
			}
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
			.detail-pop-item-check{
        margin-top: 20px;
        padding-top: 16px;
        border-top: 1px solid #ECEEF3;
      }
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
		.c-p{
			cursor: pointer;
		}
		.detail-dialog {
			&.checked-dialog {
				.el-dialog__body{
					padding: 0 56px 50px;
				}
			}
			.el-dialog__header {
				padding-top: 30px;
				padding-bottom: 30px;
				/* border-bottom: 1px solid  #ECEEF3; */
				.el-dialog__title{
					font-size: 16px;
					color: #333333;
				}
				.el-dialog__headerbtn {
					font-size: 30px;
					.el-dialog__close{
						color: #333333;
					}
				}
			}
			.el-dialog__footer {
        padding: 40px 90px;
        .el-button{
          width: 160px;
          height: 60px;
          font-size: 16px;
          color: #FFFFFF;
        }
        .reject-btn {
          background-color: #fff;
          font-size: 16px;
          color: #2159D6;
          border: 1px solid #2159D6;
          border-radius: 2px;
        }
      }
			
			.advice{
        display: inline-block;
        width: 440px;
        vertical-align: top;
        .el-textarea__inner{
          height: 200px;
          
        }
      }
		}
		.detail-dialog-btm{
			.el-dialog__header{
				border-bottom: 1px solid  #ECEEF3;
			}
		}
	}
</style>