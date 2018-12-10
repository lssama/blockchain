<template>
	<div class="list-page" :class="{'mb80' : mixResource.length > 0}">
		<el-form class="list-page-form form-block" ref="form" :model="form" label-width="100px" label-position="left">
			<h4 class="f-size-20">{{resourceType === '1' ? '数据' : resourceType === '2' ? '算法' : '算力'}}资源</h4>
			<div class="ta-c">
				<el-input
					@keyup.native.enter="getData"
					class="search-input-huge"
					placeholder="输入信息资源名称"
					v-model="DataName">
				<i slot="prefix" class="el-input__icon el-icon-search"></i>
			</el-input>
			<el-button class="search-button-huge w140 h56 ml12 b-radius-8 mb40 font-size-16" type="primary" @click="getData">检索</el-button>
		</div>
			<el-form-item label="按资源分类:" v-show="resourceType === '1'">
				<el-radio-group v-model="Category">
					<el-radio :label="1">部门信息资源</el-radio>
					<el-radio :label="2">主题信息资源</el-radio>
					<el-radio :label="3">基础信息资源</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="按机构：">
				<div class="dis-flex clear">
					<el-checkbox class="fl mr32" :indeterminate="isIndeterminate" v-model="checkAllOrganization" @change="handleCheckAllOrganization" :class="{'visibility-hidden' : expend}">全选</el-checkbox>
					<el-checkbox-group ref="checkGroup" class="list-page-check-group" v-model="checkedOrganizationIdList" @change="handleCheckedOrganizationChange" :class="{'visibility-hidden' : expend}">
						<el-checkbox v-for="item in organizationList" :key="item.Code" class="fl mr32" :label="item.Code">{{item.Title}}</el-checkbox>
					</el-checkbox-group>
					<div class="read-more fr" @click="readMore">
						{{expend ? '收起更多' : '展开更多'}}
						<i :class="expend ? 'rotate' : ''" class="el-icon-arrow-down f-size-12"></i>
					</div>
				</div>
			</el-form-item>
			<transition name="fade" >
				<div class="all-organization clear" v-show="expend">
					<el-checkbox-group v-model="checkedOrganizationIdList" @change="handleCheckedOrganizationChange">
						<el-checkbox v-for="item in organizationList" :key="item.Code" class="fl mr32 mb12" :label="item.Code">{{item.Title}}</el-checkbox>
					</el-checkbox-group>
				</div>
			</transition>
			<div class="f-size-14 color-666">已选机构：</div>
			<div class="organazation-wait" v-if="checkedOrganizationList.length <= 0">待添加</div>
			<div class="clear" v-else>
				<div class="checked-organization" v-for="(item, index) in checkedOrganizationList" :key="index">
					{{item.Title}}
					<i class="el-icon-close cur-p" @click="delCheckOrganization(item)"></i>
				</div>
			</div>
			<div class="clear mt12">
				<el-button class="w120 ml32 fr" @click="init">重置</el-button>
			</div>
		</el-form>
		<div class="data-list">
			<div class="f-size-13 color-999 fr mb16">检索结果共有  <span class="color-blue">{{totalPageSize}}</span>  条</div>
			<el-table :data="dataList" header-cell-class-name="table-head" cell-class-name="table-cell" row-class-name="table-row">
				<el-table-column align="center" prop="name" label="信息资源名称">
				</el-table-column>
				<el-table-column align="center" prop="resourceDescription" label="描述">
				</el-table-column>
				<el-table-column align="center" prop="providerName" label="发布机构">
				</el-table-column>
				<el-table-column v-if="resourceType !== '3'" align="center" prop="resourceFormat" label="信息提供方式">
					<template slot-scope="scope">
						<span class="resource-format">{{scope.row.resourceFormat | resourceFormat}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" prop="updatePeriod" label="更新日期">
				</el-table-column> -->
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<span class="color-blue border-b-blue cur-p" @click="detail(scope.row.id)">详情</span>
					</template>
				</el-table-column>
			</el-table>
		</div>
		<Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize"
		:perShow="perShow" :currentPage="currentPage" @currentChange="pageSearch($event, 'page')" />
	</div>
</template>

<script>
	import _ from 'lodash'
	import { mapMutations, mapState } from 'vuex'	
	import Pageination from '../common/pagination.vue'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	export default {
		name: 'listPage',
		components: {
			Pageination,
			// OrganazationList
		},
		data() {
			return {
				Category: '',
				organizationTreeList: [],					//机构树状结构
				checkedOrganizationIdList: [],         //选中机构列表
				checkedOrganizationList: [],     //选中机构列表名字
				organizationIdList: [],     				 //机构列表id
				organizationList: [],						     //机构扁平列表
				checkAllOrganization: false,		     //是否全选
				isIndeterminate: false,					     //全选状态
				form: {},
				DataName: '',
				dataList: [],
				checkboxList: [],
        perPage: 15,          //每页显示条目个数
        totalPageSize: 0,    //总条目数
        perShow: false,       //分页是否显示
				currentPage: 1,       //当前页
				expend: false,
				resourceType: '',
			}
		},
		beforeRouteLeave (to, from, next) {
			if ((to.name !== 'detailPage' && to.name !== 'contractStart') && this.mixResource.length > 0) {
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
		watch: {
			'$route'(value) {
				this.resourceType = this.$route.params.id;
				this.getData();
				this.init();
				
				this.CHANGE_PATH(this.$route.params.id);
      },
		},
		mounted(){
			this.CHANGE_PATH(this.$route.params.id);
		},
		methods: {
			...mapMutations([
        'CLEAR_RESOURCE_ITEM',
				'CHANGE_PATH'
      ]),
			//详情
			detail(id) {
				this.$router.push(`/detailPage/${id}`);
			},
			//全选
			handleCheckAllOrganization(val) {
				this.checkedOrganizationIdList = val ? this.organizationIdList : [];
					if (val) {
						this.checkedOrganizationList = [];
					_.forEach(this.organizationList, x => this.checkedOrganizationList.push(x));
				} else {
					this.checkedOrganizationList = [];
				}
				this.isIndeterminate = false;
			},
			//选中机构
			handleCheckedOrganizationChange(value) {
				this.checkedOrganizationList = [];
				_.forEach(value, (item, index) => {
					const filter = _.filter(this.organizationList, organization => organization.Code === item)
					if (filter.length > 0) {
						this.checkedOrganizationList.push(filter[0]);
					}
				})
				let checkedCount = value.length;
				this.checkAllOrganization = checkedCount === this.organizationList.length;
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.organizationList.length;
			},
			//分页搜索
			pageSearch(pageConfig) {
				this.perPage = _.result(pageConfig, 'pageSize', this.perPage);
      	this.currentPage = _.result(pageConfig, 'pageNumber', this.currentPage) + 1;
				this.getData();
			},
			//获取数据列表
			async getData() {
				const params = _.omitBy({
					Category: `${this.Category}`,
					DataName: this.DataName,
					OrganCode: this.checkedOrganizationIdList.join(','),
					Page: this.currentPage,
					Size: 15,
				}, (value) => {
          return value === '' || _.isNull(value);
        })
				
				let response, serverAddress;
				if (this.resourceType === '1') {
					serverAddress = ServerAddress.resourceList;
				} else if (this.resourceType === '2') {
					serverAddress = ServerAddress.algorithmList;
				} else {
					serverAddress = ServerAddress.computeList;
				}
        try {
					response = await http(serverAddress, params, 'post')
					const { data: { dataList = [], count} }  = response.data;
					dataList.forEach(item => {
						if (item.schemaJson !== 'xxx' && item.schemaJson !== '' && item.schemaJson !== undefined) {  //todo  正式需要去掉
							item.schemaJson = JSON.parse(item.schemaJson);
							_.assign(item, item, item.schemaJson);
						}
					})
					Object.assign(this, {
						perShow: count === 0 ? false : true,
						dataList,
						totalPageSize: count,
					})
        } catch (e) {
          // console.log(e)
        }
			},
			//获取机构
			async getOrganizationList() {
				const params = {}
				let response;
        try {
					response = await http(ServerAddress.departmentList, params, 'get')
					const dataList = response.data.data.dataList;
					const organizationList = [dataList];
					this.organizationTreeList = organizationList;
					this.flatList(organizationList);
        } catch (e) {
          // console.log(e)
        }
			},
			//扁平化数组
			flatList(array) {
				_.forEach(array, item => {
					const organization = _.pick(item, ['Code', 'Index', 'Title'])
					this.organizationList.push(organization);
					this.organizationIdList.push(organization.Code);
					if (item.children) {
						this.flatList(item.children);
					}
				});
			},
			//搜索
			async search() {
				const params = {
					Category: `${this.Category}`,
					ResName: this.DataName,
					OrganCode: this.checkedOrganizationIdList.join(','),
					Page: this.currentPage,
					Size: 15,
				}
				let response;
				try {
					response = await http(ServerAddress.resourceSearch, params, 'post')
					const { data: { data: { dataList = [], count}}} = response;
					Object.assign(this, {
						perShow: count === 0 ? false : true,
						dataList,
						totalPageSize: count,
					})
        } catch (e) {
          console.log(e)
        }
			},
			//删除已选机构
			delCheckOrganization(organazation) {
				const index = _.chain(this.checkedOrganizationIdList).findIndex(x => x === organazation.Index).value();
				this.checkedOrganizationIdList.splice(index, 1);
				this.checkedOrganizationList.splice(index, 1);
				if (this.checkedOrganizationList.length === 0) {
					this.isIndeterminate = false;
				} else {
					this.isIndeterminate = true;
				}
				this.checkAllOrganization = false;
			},
			readMore() {
				this.expend = !this.expend;
				if (this.expend) {
					this.$refs.checkGroup.$el.className = 'el-checkbox-group list-page-check-group expand'
				} else {
					this.$refs.checkGroup.$el.className = 'el-checkbox-group list-page-check-group';
				}
			},
			init() {
				this.Category = '';
				this.DataName = '';
				this.checkedOrganizationIdList = [];
				this.checkedOrganizationList = [];
				this.checkAllOrganization = false;
				this.isIndeterminate = false;
			}
		},
		created() {
			this.resourceType = this.$route.params.id;
			this.getData();
			this.getOrganizationList();
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				mixResource: state => state.resource.mixResource,
			})
		},
		filters: {
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
				switch(value) {
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
				switch(value) {
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
		}
	}
</script>

<style lang="less">
	.list-page {
		/* padding: 40px 40px 0; */
		box-sizing: border-box;
		&.mb80 {
			margin-bottom: 80px;
		}
		.list-page-form {
			.list-page-check-group {
				flex: 1;
				height: 32px;
				overflow: hidden;
				.el-checkbox+.el-checkbox {
					margin-left: 0;
				}
			}
			.all-organization {
				box-sizing: border-box;
				padding: 23px 12px;
				box-shadow: 0 0 10px #ccc;
				border-radius: 2px;
				margin-bottom: 25px;
				height: 150px;
    		overflow-y: auto;
				.el-checkbox+.el-checkbox {
					margin-left: 0;
				}
			}
			.el-form-item--mini.el-form-item,
			.el-form-item--small.el-form-item {
				margin-bottom: 10px;
			}
			.checked-organization {
				float: left;
				height: 22px;
				font-size: 12px;
				line-height: 22px;
				margin-top: 15px;
				margin-right: 20px;
				background: #F3F3F3;
				border: 1px solid #D9D9D9;
				border-radius: 2px;
				color: rgba(0,0,0,0.65);
				padding: 0 8px;
			}
			.read-more {
				width: 80px;
				height: 24px;
				line-height: 26px;
				font-size: 12px;
				color: #999;
				border: 1px solid #999;
				text-align: center;
				cursor: pointer;
				margin-left: 20px;
				border-radius: 2px;
				i {
					transition: all linear .3s;
				}
				.rotate {
					transition: all linear .3s;
					transform: rotate(-180deg);
				}
			}
			.organazation-wait {
				border: 1px dashed #D9D9D9;
				border-radius: 2px;
				width: 74px;
				height: 22px;
				line-height: 22px;
				text-align: center;
				color: #D9D9D9;
				font-size: 12px;
				margin-top: 15px;
			}
		}
		.data-list {
			width: 100%;
			padding: 20px 40px;
			box-sizing: border-box;
			overflow: hidden;
			.resource-format {
				display: inline-block;
				padding: 0 8px;
				font-size: 12px;
				color: #fff;
				background: #2159D6;
				border-radius: 2px;
			}
		}
	}
</style>