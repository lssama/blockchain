<template>
	<div class="detail-page" :class="{'mb160' : mixResource.length > 0}">
		<div class="detail-page-title clear">
			<el-breadcrumb separator="/" class="fl">
				<el-breadcrumb-item :to="{ path: `/resourceMall/${form.type}` }">{{form.type === 1 ? '数据' : form.type === 2 ? '算法' : '算力'}}资源</el-breadcrumb-item>
				<el-breadcrumb-item>{{form.type === 1 ? '数据' : form.type === 2 ? '算法' : '算力'}}详情</el-breadcrumb-item>
			</el-breadcrumb>
			<!-- <h4 class="fl f-size-18 color-blue">{{form.type === 1 ? '数据' : form.type === 2 ? '算法' : '算力'}}详情</h4> -->
			<el-button :disabled="btnDisabled" class="fr huge-button ml20" type="primary" @click="mixContract()">添加至组合合约</el-button>
			<el-button v-show="form.type === 1" :disabled="mixResource.length > 0 || btnDisabled" class="fr huge-button" type="primary" @click="commit">发起合约</el-button>
		</div>
		<div class="detail-cell">
			<div class="detail-cell-titel">
				<h4 class="f-size-20">基本信息</h4>
			</div>
			<div class="middle-page">
				<el-form class="detail-form" label-position="left" ref="form" :model="form" label-width="150px" size="medium">
					<el-form-item label="信息资源名称:">
						<h4>{{form.name}}</h4>
					</el-form-item>
					<el-form-item v-show="form.type === 1" label="信息资源代码:">
						<span>{{form.cataCode}}</span>
					</el-form-item>
					<div class="line mt30"></div>
					<!-- <el-form-item v-show="form.type === 1" label="关联资源:">
						<h4 v-for="(item, index) in form.relateCataCode" :key="index">{{item.name}}</h4>
					</el-form-item>
					<el-form-item v-show="form.type === 1" label="关联资源代码:">
						<span v-for="(item, index) in form.relateCataCode" :key="index">{{item.code}}</span>
					</el-form-item> -->
					<el-form-item v-if="form.type === 1" v-for="(item, index) in form.relateCataCode" :key="index" label-width="0">
						<div >
							<el-form-item :label="`关联资源${index + 1}:`">
								<h4>{{item.name}}</h4>
								<h4 v-if="item.name.length == 0">无</h4>
							</el-form-item>
							<el-form-item :label="`关联资源代码${index + 1}:`">
								<span>{{item.code}}</span>
								<span v-if="item.code.length == 0">无</span>
							</el-form-item>
							<div class="line mt20 mb20"></div>
						</div>
					</el-form-item>
					<!-- <div class="line mt30" v-show="form.type === 1"></div> -->
					<el-form-item label="发布机构:" class="clear">
						<h4 class="fl w500">{{form.providerName}}</h4>
						<div class="fl" v-show="form.type !== 3">
							<span class="color-999">信息提供方式:</span>
							<span class="ml30 fill-blue">{{form.resourceFormat | resourceFormat}}</span>
						</div>
					</el-form-item>
					<el-form-item label="提供方地址:">
						<span>{{form.issuer}}</span>
					</el-form-item>
					<el-form-item class="mt12" label="机构代码:">
						<span>{{form.providerCode}}</span>
					</el-form-item>
					<el-form-item v-show="form.type === 1" label="所属类目:">
						<span>{{form.categoryStr}}</span>
					</el-form-item>
					<div class="line mt30" v-show="form.type === 1"></div>
					<el-form-item class="clear" v-show="form.type === 1" label="共享方式:">
						<h4 class="fl w500">{{form.cataPermission === 0 ? '在线查询' : ''}}</h4>
						<div class="fl clear" v-show="form.type !== 3">
							<span class="color-999 fl">共享类型:</span>
							<h4 class="ml30 fl">{{form.shareType === 0 ? '无条件共享' : form.shareType === 1 ? '有条件共享' : '不予共享'}}</h4>
						</div>
					</el-form-item>
					<el-form-item v-show="form.type === 1" label="共享条件和范围:">
						<span>{{form.shareCondition }}</span>
					</el-form-item>
					<div class="line mt30" v-show="form.type === 1"></div>
	
					<el-form-item v-show="form.type === 1" label="是否向社会开放:">
						<h4>{{form.openCommunity === 0 ? '否' : '是' }}</h4>
					</el-form-item>
					<el-form-item v-show="form.type === 1" label="开放条件:">
						<span>{{form.openCommunity === 0 ? '无': form.openCondition}}</span>
					</el-form-item>
					<div class="line mt30"></div>

					<el-form-item label="信息项:" v-if="form.type===1&&form.resourceFormat === 1">
						</el-form-item>
						<el-table :data="form.schemaJson.infoForm" header-cell-class-name="table-head" cell-class-name="table-cell" class="tb-edit" style="width: 100%" border v-if="form.type===1&&form.resourceFormat === 1">
							<el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
							<el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
							<el-table-column align="center" label="数据类型">
								<template slot-scope="scope">
									<span>{{scope.row.type | sqlType}}</span>
								</template>
							</el-table-column>
							<el-table-column label="数据长度" align="center">
								<template slot-scope="scope">
									<span>{{scope.row.dataLength}}</span>
								</template>
							</el-table-column>
							<el-table-column label="共享类型" align="center">
								<template slot-scope="scope">
									<span>{{scope.row.shareType | sqlShareType}}</span>
								</template>
							</el-table-column>
							<el-table-column label="是否开放" align="center">
								<template slot-scope="scope">
										<span>{{scope.row.openCommunity === '0' ? '否' : '是'}}</span>
								</template>
							</el-table-column>
						</el-table>
						<div class="line mt20 mb20" v-if="form.type===1&&form.resourceFormat === 1"></div>

					<el-form-item label="关键词:">
						<span class="key-word" v-for="(item, index) in form.keywords" :key="item.index">{{item}}</span>
						<h4 v-if="form.keywords&&form.keywords.length==0 || !form.keywords">无</h4>
					</el-form-item>
					<el-form-item label="信息资源摘要:">
						<span>{{form.resourceDescription}}</span>
					</el-form-item>
					<div class="line"></div>
					<!-- <el-form-item label="数据量:">
						<span>{{form.key14}}</span>
					</el-form-item> -->
					<!-- <el-form-item label="上线状态:">
						<span class="color-green">{{form.status | status}}</span>
					</el-form-item> -->
					<el-form-item v-show="form.type === 1" label="更新周期:">
						<h4>{{form.updatePeriod | updatePeriod}}</h4>
					</el-form-item>
					<div class="line" v-show="form.type === 1"></div>
					<el-form-item label="创建时间:">
						<span>{{form.createTime | formatDate}}</span>
					</el-form-item>
					<div class="line"></div>
					<el-form-item label="链上地址:">
						<span>{{form.chainAddress}}</span>
					</el-form-item>
					<!-- <el-form-item label="积分奖励:">
						<span class="color-green">{{form.updateTime}}&nbsp;MPC</span>
					</el-form-item> -->
				</el-form>
			</div>
		</div>
		<div class="detail-cell" v-show="form.type !== 3">
			<div class="detail-cell-titel">
				<h4 class="f-size-20">接口/查询信息</h4>
			</div>
			<div class="middle-page">
				<el-form class="detail-form" v-if="form.resourceFormat === 0" label-position="left" ref="form" :model="form" label-width="150px" size="medium">
					<el-form-item label="信息资源地址:">
						<span>{{form.address}}</span>
					</el-form-item>
					<div class="line"></div>
					<el-form-item label="返回格式:">
						<span>JSON</span>
					</el-form-item>
					<div class="line"></div>
					<el-form-item label="请求方式:">
						<span>POST</span>
					</el-form-item>
					<div class="line"></div>
				</el-form>
				<el-form :model="form" label-width="150px" v-if="form.resourceFormat === 1" class="detail-form" label-position="left" ref="form" size="medium">
					<el-form-item label="信息资源地址:">
						<span>{{form.schemaJson.addressFirst}}/{{form.schemaJson.addressSecond}}</span>
					</el-form-item>
					<div class="line"></div>
					<el-form-item label="是否加密:">
						<span>{{form.schemaJson.isEncrypt == 0 ? '否' : '是'}}</span>
					</el-form-item>
					<div class="line"></div>
				</el-form>
				<div class="interface-detail">
					
					<el-form class="detail-form mt40" label-position="left" ref="form" :model="form" label-width="150px" size="medium">
						<el-form-item label="请求参数:">
						</el-form-item>
						<el-table :data="form.requestForm" header-cell-class-name="table-head" cell-class-name="table-cell" border v-if="form.resourceFormat === 0">
							<el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
							<el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
							<el-table-column align="center" label="类型">
								<template slot-scope="scope">
									<span>{{scope.row.type | type}}</span>
								</template>
							</el-table-column>
							<el-table-column align="center" prop="required" label="是否必填">
								<template slot-scope="scope">
									<span>{{scope.row.required | required}}</span>
								</template>
							</el-table-column>
							<el-table-column align="left" prop="note" label="描述"></el-table-column>
						</el-table>
						<div class="sqldes" v-if="form.resourceFormat === 1">{{form.schemaJson.sqlStr}}</div>
          	<!-- <el-table :data="sqlRequest" border header-cell-class-name="table-head" cell-class-name="table-cell" v-if="form.resourceFormat === 1">
              <el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
              <el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
              <el-table-column align="center" label="数据类型">
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column align="center" prop="required" label="长度">
                <template slot-scope="scope">
                </template>
              </el-table-column>
            </el-table> -->
						<div class="mt40">
							<el-form-item label="请求示例:">
							</el-form-item>
							<el-input
								class="detail-textarea"
								type="textarea"
								:rows="6"
								readonly
								v-model="form.input">
							</el-input>
						</div>
						<div class="mt40">
							<el-form-item label="正常返回示例:">
							</el-form-item>
							<el-input
								class="detail-textarea"
								type="textarea"
								:rows="6"
								readonly
								v-model="form.output">
							</el-input>
						</div>
						<div class="mt40">
							<el-form-item label="失败返回示例:">
							</el-form-item>
							<el-input
								class="detail-textarea"
								type="textarea"
								:rows="6"
								readonly
								v-model="form.errput">
							</el-input>
						</div>
					</el-form>
				</div>
			</div>
		</div>
		<div class="ta-c">
			<el-button v-show="form.type === 1" :disabled="mixResource.length > 0 || btnDisabled" class="huge-button mt16 mr32 mb40" type="primary" @click="commit">发起合约</el-button>
			<el-button :disabled="btnDisabled" class="huge-button mt16 mb40" type="primary" @click="mixContract()">添加至组合合约</el-button>
		</div>
	</div>
	</div>
</template>

<script>
	import _ from 'lodash'
	import moment from 'moment'
	import { mapState, mapMutations } from 'vuex'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	export default {
		name: 'detailPage',
		data() {
			return {
				form: {

				},
				publicParam: '1',
				requestParam: '1',
				type: '',
				incase: '1',
				outcase: '1',
				errcase: '1',
				data: {},
				btnDisabled: false,
				sqlRequest: []
			}
		},
		beforeRouteLeave (to, from, next) {
			if ((to.name !== 'resourceMall' && to.name !== 'contractStart') && this.mixResource.length > 0) {
				this.$confirm('<h4>已有资源被添加至组合合约，离开资源管理页面将被清空，是否离开？</h4>', '', {
					confirmButtonText: '是',
					cancelButtonText: '否',
          type: 'warning',
          showClose: false,
          dangerouslyUseHTMLString: true,
          customClass: 'message-box-class',
          cancelButtonClass: 'message-cancel-button',
          confirmButtonClass: 'message-confirm-button',
          iconClass: 'el-icon-question color-FAAD14'
				}).then(() => {
					this.CLEAR_RESOURCE_ITEM();
					next();
				}).catch(() => {
					this.$parent.$children[1].$children[0].activeIndex = this.$route.path;
				});
			} else {
				next();
			}
		},
		methods: {
			...mapMutations([
				'ADD_RESOURCE_ITEM',
				'CLEAR_RESOURCE_ITEM'
      ]),
			// 发起合约
			commit() {
				// this.$router.push(`/initiateContract/${this.$route.params.id}`)
				this.$router.push({ path: `/contractStart`, query: { id: this.$route.params.id, dataName: this.form.name, providerName: this.form.providerName, createTime: this.form.createTime, cataPermission: this.form.cataPermission, path: 1 } })
			},
			// 组合合约
			mixContract() {
				this.ADD_RESOURCE_ITEM(this.form)
			},
			// 获取数据
			async getData() {
				const params = {
					id: this.$route.params.id,
				}
				let response;
				try {
					response = await http(ServerAddress.resourceDetail, params, 'get')
					const { data: { data = [] } } = response;
					if (data.schemaJson !== 'xxx' && data.schemaJson !== '' && data.schemaJson !== undefined) {  //todo  正式需要去掉
						data.schemaJson = JSON.parse(data.schemaJson);
						_.assign(data, data, data.schemaJson);
					}
					data.relateCataCode = JSON.parse(data.relateCataCode);
					if (data.keywords.length > 0) {
						data.keywords = data.keywords.split(',');
					}
					this.form = data;
					let sqlArr = [];
					for(let i in this.form.schemaJson.requestForm){
						if(!this.form.schemaJson.requestForm[i].adrKey){
							sqlArr.push(this.form.schemaJson.requestForm[i]);
						}
					}
					this.sqlRequest = sqlArr;
					this.btnDisabled = false;
					// const { data: {dataList = [], count} }  = response.data;
					// Object.assign(this, {
					// 	perShow: true,
					// 	dataList,
					// 	totalPageSize: count,
					// })
				} catch (e) {
					console.log(e)
				}
			}
		},
		created() {
			this.btnDisabled = true;
			this.getData();
		},
		components: {

		},
		computed: {
			...mapState({
				mixResource: state => state.resource.mixResource
			})
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
				}
			},
			formatDate(time) {
				if (time) {
					return moment(time * 1000).format("YYYY-M-D H:mm:ss");
				}
			},
			sqlType(value){
				switch (value) {
					case '0':
						return "字符型C";
					case '1':
						return "数值型N";
					case '2':
						return "货币型Y";
					case '3':
						return "日期型D";
					case '4':
						return "日期时间型T";
					case '5':
						return "逻辑型L";
					case '6':
						return "备注型M";
					case '7':
						return "通用型G";
					case '8':
						return "双精度型B";
					case '9':
						return "整型I";
					case '10':
						return "浮点型F";
				}
			},
			sqlShareType(value){
				switch (value) {
					case '0':
						return "无条件共享";
					case '1':
						return "有条件共享";
					case '2':
						return "不予共享";
				}
			},
		}
	}
</script>

<style lang="less">
	.detail-page {
		box-sizing: border-box;
		&.mb160 {
			margin-bottom: 160px;
		}
		.detail-page-title {
			width: 100%;
			height: 104px;
			box-sizing: border-box;
			padding: 24px 40px 0;
			background-color: #fff;
			box-shadow: 0 1px 1px #ddd;
		}
		.detail-cell {
			margin: 40px;
			background-color: #fff;
			.detail-cell-titel {
				padding: 25px 52px;
				border-bottom: 3px solid #ECEEF3;
				h4 {
					padding-left: 10px;
					border-left: 3px solid #2159D6 ;
				}
			}
			.middle-page {
				padding: 30px 40px;
				box-sizing: border-box;
				.key-word {
					display: inline-block;
					padding: 0 16px;
					background: #FFFFFF;
					border: 1px solid #D9D9D9;
					border-radius: 4px;
					margin-right: 16px;
				}
				.interface-detail {
					font-size: 14px;
	
					.interface-detail-title {
						margin-top: 45px;
						color: #333;
					}
	
					.interface-detail-des {
						margin-top: 30px;
						color: #666;
					}
				}
				.fill-blue {
					display: inline-block;
					padding: 0px 20px;
					height: 28px;
					line-height: 28px;
					background-color: #2159D6;
					color: #fff;
					border-radius: 4px;
				}
			}
		}

		.huge-button {
			width: 160px;
			height: 60px;
			font-size: 16px;
			border-radius: 4px;
			letter-spacing: 1.21px;
		}
		.sqldes{
			margin: 15px 0 20px;
		}
	}
</style>