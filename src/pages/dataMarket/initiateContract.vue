<template>
	<div class="initiate-contract">
		<div class="middle-page">
			<el-form ref="form" :model="form" label-width="110px">
				<el-form-item label="数据名称:">
					<el-input class="w300" :readonly="true" v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="发布机构:">
					<el-input class="w300" :readonly="true" v-model="form.providerName"></el-input>
				</el-form-item>
				<el-form-item label="发布时间:">
					<el-input class="w300" :readonly="true" v-model="form.time"></el-input>
				</el-form-item>
				<el-form-item label="访问者IP:">
					<el-input class="w300" :readonly="true" v-model="issuerIp"></el-input>
				</el-form-item>
				<el-form-item label="数据用途:">
					<el-input type="textarea" :rows="3" class="w300" v-model="form.dataUse"></el-input>
				</el-form-item>
				<el-form-item label="合约周期:">
					<el-select class="w300" v-model="period" placeholder="请选择">
						<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="申请权限:">
					<el-checkbox-group v-model="form.auth">
						<el-checkbox v-for="item in checkList" :key="item.id" :label="item.id">{{item.label}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
			</el-form>
			<div class="ta-c">
				<el-button class="w100" type="primary" @click="submit">提交</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	export default {
		name: 'initiateContract',
		data() {
			return {
				form: {},
				dataUse: '',
				issuerIp: '',
				period: '',
				options: [{
					value: '0',
					label: '无限期'
				}, {
					value: '1',
					label: '一天'
				}, {
					value: '2',
					label: '三天'
				}, {
					value: '3',
					label: '7天'
				}, {
					value: '4',
					label: '15天'
				}, {
					value: '5',
					label: '1个月'
				}, {
					value: '6',
					label: '6个月'
				}, {
					value: '7',
					label: '1年'
				}],
				checkList: [
					{
						id: 0,
						label: '在线查询'
					},
					{
						id: 1,
						label: '接口访问'
					},
					{
						id: 2,
						label: '下载'
					},
				]
			}
		},
		methods: {
			submit() {
				const createTime = new Date().getTime();
				const params = {
					contractPeriod: 0,
					createTime,
					dataUse: this.dataUse,
					issuer: this.issuer,
					issuerIp: this.issuerIp,
					resourceId: this.$route.params.id,
					status: 0,
				}
				console.log(params);
			},
			async getData() {
				const params = {
					id: this.$route.params.id,
				}
				let response;
        try {
					response = await http(ServerAddress.resourceDetail, params, 'get')
					const { data : { data = []} } = response;
					this.form = data;
					this.issuerIp = window.location.hostname;
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
			this.getData();
		},
		components: {
		}
	}
</script>

<style lang="less">
	.initiate-contract {
		padding: 20px;
		box-sizing: border-box;

		.middle-page {
			/* width: 500px; */
			margin: 0 auto;
		}
	}
</style>