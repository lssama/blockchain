<template>
	<div class="user-management">
		<h4 class="color-blue mb26 f-size-18">用户管理</h4>
		<div class="form-block clear">
			<el-form class="user-management-form" :inline="true" ref="form" label-width="100px">
				<el-form-item label="用户名称：">
					<el-input @keyup.native.enter="search" v-model="form.key"></el-input>
				</el-form-item>
				<el-button class="w120 fr" type="primary" @click="addUser">添加用户</el-button>
				<el-button class="w120 fr ml32 mr32" type="primary" @click="search">检索</el-button>
			</el-form>
		</div>
		<div class="data-list">
			<el-table :data="dataList" header-cell-class-name="table-head" cell-class-name="table-cell">
				<el-table-column align="center" prop="username" label="姓名">
				</el-table-column>
				<el-table-column align="center" prop="email" label="邮箱">
				</el-table-column>
				<el-table-column align="center" prop="phone" label="联系方式">
				</el-table-column>
				<el-table-column align="center" prop="organName" label="机构名称">
				</el-table-column>
				<el-table-column align="center" prop="RoleId" label="角色">
					<template slot-scope="scope">
						{{ getRoleName(scope.row.role) }}
						<!-- <span v-for="(item, index) in scope.row.uniUserRole" :key="item.id">
							{{ item.uniRole.name }}
							<span v-show="index < scope.row.uniUserRole.length - 1">/</span>
						</span> -->
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<span class="color-blue border-b-blue cur-p" @click="update(scope.row)">修改</span>
						<span class="color-blue border-b-blue cur-p ml16" @click="delConfirm(scope.row.id)">删除</span>
					</template>
				</el-table-column>
			</el-table>
			<el-dialog :title="dialogStatus === 'add' ? '添加用户' : '修改用户'" :visible="dialogVisible" width="30%" :before-close="handleClose">
				<el-form ref="userForm" :rules="userRules" :model="userForm" label-width="100px">
					<el-form-item prop="UserName" label="姓名:">
						<el-input maxlength="10" :disabled="dialogStatus === 'update'" v-model="userForm.UserName"></el-input>
					</el-form-item>
					<el-form-item v-show="dialogStatus === 'add'" prop="PassWord" label="密码:">
						<el-input type="password" v-model="userForm.PassWord"></el-input>
					</el-form-item>
					<el-form-item prop="Email" label="邮箱:">
						<el-input v-model="userForm.Email"></el-input>
					</el-form-item>
					<el-form-item prop="Mobile" label="联系方式:">
						<el-input v-model="userForm.Mobile"></el-input>
					</el-form-item>
					<el-form-item prop="Address" label="所在机构:">
						<el-select v-model="userForm.Address" placeholder="请选择">
							<el-option v-for="item in organizationList" :key="item.Code" :label="item.Title" :value="item.Code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="RoleId" label="角色:">
						<el-select v-model="userForm.RoleId" placeholder="请选择">
							<el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible = false">取 消</el-button>
					<el-button :disabled="btnDisabled" type="primary" @click="submit('userForm')">确 定</el-button>
				</span>
			</el-dialog>
			<el-dialog title="修改用户" :visible="dialogVisibleUpdate" width="30%" :before-close="handleUpdateClose">
				<el-form ref="updateUserForm" :rules="updateUserRules" :model="updateUserForm" label-width="100px">
					<el-form-item prop="UserName" label="姓名:">
						<el-input maxlength="10" :disabled="dialogStatus === 'update'" v-model="updateUserForm.UserName"></el-input>
					</el-form-item>
					<el-form-item prop="Email" label="邮箱:">
						<el-input v-model="updateUserForm.Email"></el-input>
					</el-form-item>
					<el-form-item prop="Mobile" label="联系方式:">
						<el-input v-model="updateUserForm.Mobile"></el-input>
					</el-form-item>
					<el-form-item prop="Address" label="所在机构:">
						<el-select v-model="updateUserForm.Address" placeholder="请选择">
							<el-option v-for="item in organizationList" :key="item.Code" :label="item.Title" :value="item.Code">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="RoleId" label="角色:">
						<el-select v-model="updateUserForm.RoleId" placeholder="请选择">
							<el-option v-for="item in roleList" :key="item.roleId" :label="item.name" :value="item.roleId">
							</el-option>
						</el-select>
					</el-form-item>
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="dialogVisibleUpdate = false">取 消</el-button>
					<el-button :disabled="btnDisabled" type="primary" @click="submit('updateUserForm')">确 定</el-button>
				</span>
			</el-dialog>
		</div>
		<Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize"
		:perShow="perShow" :currentPage="currentPage" @currentChange="pageSearch($event, 'page')" />
	</div>
</template>

<script>
	import _ from 'lodash'
	import Pageination from '../common/pagination.vue'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	import api from '../../api/api.js'
	export default {
		name: 'userManagement',
		components: {
			Pageination
		},
		data() {
			var validateName = (rule, value, callback) => {
        if (!/^([a-zA-Z0-9]{3,10})$/.test(this.userForm.UserName) && !/^([\u4E00-\u9FA5]{2,8})$/.test(this.userForm.UserName)) {
					callback(new Error('用户名由2-8位中文或3-10位英文组成'));
				} else if (this.userForm.UserName.includes('_')) {
					callback(new Error('不能包含下划线'));
				} 
				else {
					callback();
				}
      };
			var validatePass = (rule, value, callback) => {
        if (!/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]{6,18})$/.test(this.userForm.PassWord)) {
					callback(new Error('密码由6 到 18位字母、数字组成'));
				} else {
					callback();
				}
      };
			var validateMobile = (rule, value, callback) => {
				let item = this.dialogStatus === 'add' ? this.userForm : this.updateUserForm
        if (!/^0?1[345789]\d{9}$/.test(item.Mobile)) {
						callback(new Error('请输入正确的手机号'));
					} else {
						callback();
				}
      };
			return {
				form: {
					key: '',
				},
				userForm: {
					UserName: '',
					PassWord: '',
					Email: '',
					Mobile: '',
					Address: '',
					RoleId: '',
				},
				updateUserForm: {
					UserId: '',
					UserName: '',
					Email: '',
					Mobile: '',
					Address: '',
					RoleId: '',
				},
				roleList: [
				],
				PassWordRuler: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 18, message: '密码由6 到 18位字母、数字组成', trigger: 'blur' },
					{ validator: validatePass, trigger: 'blur' }
				],
				userRules: {
					UserName: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 10, message: '用户名由2-8位中文或3-10位英文组成', trigger: 'blur' },
						{ validator: validateName, trigger: 'blur' }
          ],
					Email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
          ],
					Mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: validateMobile, trigger: 'blur' }
          ],
					Address: [
						{ required: true, message: '请选择机构', trigger: 'blur' },
          ],
					RoleId: [
						{ required: true, message: '请选择角色', trigger: 'blur' },
          ],
				},
				updateUserRules: {
					Email: [
            { required: true, message: '请输入邮箱', trigger: 'blur' },
						{ type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur'] }
          ],
					Mobile: [
						{ required: true, message: '请输入手机号', trigger: 'blur' },
						{ validator: validateMobile, trigger: 'blur' }
          ],
					Address: [
						{ required: true, message: '请选择机构', trigger: 'blur' },
          ],
					RoleId: [
						{ required: true, message: '请选择角色', trigger: 'blur' },
          ],
				},
				dataList: [],
				dialogVisible: false,
				dialogVisibleUpdate: false,
				dialogStatus: '',
				organizationTreeList: [],
				organizationList: [],
				defaultProps: {
          children: 'children',
          label: 'Title'
				},
				btnDisabled: false,
				perPage: 15,          //每页显示条目个数
        totalPageSize: 0,    //总条目数
        perShow: false,       //分页是否显示
				currentPage: 1,       //当前页
			}
		},
		methods: {
			//获取机构
			async getOrganizationList() {
				const params = {}
				let response;
				try {
					response = await http(ServerAddress.departmentList, params, 'get')
					const dataList = response.data.data.dataList;
					this.organizationTreeList = [dataList];
					this.flatList(this.organizationTreeList);
				} catch (e) {
					console.log(e)
				}
			},
			//获取机构
			async getRoleList() {
				const params = {}
				let response;
				try {
					response = await http(ServerAddress.userRoleList, params, 'post')
					const data = JSON.parse(response.data);
					this.roleList = data.result;
				} catch (e) {
					console.log(e)
				}
			},
			//扁平化数组
			flatList(array) {
				_.forEach(array, item => {
					const organization = _.pick(item, ['Code', 'Index', 'Title'])
					this.organizationList.push(organization);
					if (item.children) {
						this.flatList(item.children);
					}
				});
			},
			addUser(){
				this.dialogVisible = true;
				this.dialogStatus = 'add';
				this.userRules.PassWord = this.PassWordRuler;
			},
			//修改
			update(data) {
				this.dialogStatus = 'update';
				this.dialogVisibleUpdate = true;
				this.updateUserForm.UserId = data.id;
				this.updateUserForm.UserName = data.username;
				this.updateUserForm.Email = data.email;
				this.updateUserForm.Mobile = data.phone;
				this.updateUserForm.Address = data.organization;
				this.updateUserForm.RoleId = data.role;
			},
			//获取数据列表
			async getData() {
				const userInfo = JSON.parse(api.getLS('userInfo'));
				const params = {
					Page: this.currentPage,
					Size: this.perPage,
				}
				let response;
				try {
					response = await http(ServerAddress.userList, params, 'post')
					let { data: { data : { dataList, count}} } = response
					if (response.data.code === 0) {
						_.forEach(dataList, item => {
							if (item.linkaddress) {
								item.linkaddress = JSON.parse(item.linkaddress);
								item.address = item.linkaddress.Title;
							}
						})
						Object.assign(this, {
							dataList,
							perShow: count === 0 ? false : true,
							totalPageSize: count,
						})
					} else {
						this.$message.error(data.msg)
					}
					
				} catch (e) {
					console.log(e)
				}
			},
			//弹窗关闭
			handleClose() {
				this.dialogVisible = false;
				this.resetForm();
			},
			//弹窗关闭
			handleUpdateClose() {
				this.dialogVisibleUpdate = false;
				this.resetForm('updateUserForm');
			},
			async userAddSub(data){
				// debugger;
				let response;
				let params = Object.assign({}, this.userForm);
				console.log(params);
				params.userAddress = data.address;
				params.privateKey = data.privateKey;
				try {
					response = await http(ServerAddress.userAdd, params, 'post')
					const data = JSON.parse(response.data);
					if (data.code === 0) {
						this.btnDisabled = false;
						this.$message.success('添加成功');
						this.dialogVisible = false;
						this.getData();
						this.resetForm('userForm')
					}
				} catch (e) {
					console.log(e)
				}
			},
			//弹窗提交
			submit(form) {
				this.$refs[form].validate(async (valid) => {
					if (valid) {
						this.btnDisabled = true;
						if (this.dialogStatus === 'add') {
							const userInfo = JSON.parse(api.getLS('userInfo'));
							// const params = {
							// 	Token: userInfo.token
							// };
							// _.assign(params, params, this.userForm);
							// const filter = this.organizationList.filter(x => x.Index == this.userForm.Address);
							// params.Address = JSON.stringify(filter[0]);
							const params = {
								name: this.userForm.UserName,
								passwd: this.userForm.PassWord,
								type: 1
							}
							let response;
							try {
								response = await http(ServerAddress.accountRegister, params, 'post', 'chain')
								const data = response.data;
								if (data.code === 200) {
									console.log(response);
									console.log(data);
									this.userAddSub(data.data);
									// this.btnDisabled = false;
									// this.$message.success('添加成功');
									// this.dialogVisible = false;
									// this.getData();
									// this.resetForm('userForm')
								}
							} catch (e) {
								console.log(e)
							}
						} else {
							const userInfo = JSON.parse(api.getLS('userInfo'));
							// const params = {
								// Token: userInfo.token
							// };
							// _.assign(params, params, this.updateUserForm);
							// const filter = this.organizationList.filter(x => x.Index == this.updateUserForm.Address);
							// params.Address = JSON.stringify(filter[0]);
							let response;
							try {
								response = await http(ServerAddress.userUpdate, this.updateUserForm, 'post')
								const data = JSON.parse(response.data);
								if (data.code === 0) {
									this.btnDisabled = false;
									this.$message.success('修改成功');
									this.dialogVisibleUpdate = false;
									this.getData();
								}
							} catch (e) {
								console.log(e)
							}
						}
          } else {
            return false;
          }
        });
				
			},
			//搜索
			async search() {
				const userInfo = JSON.parse(api.getLS('userInfo'));
				this.currentPage = 1;
				const params = {
					UserName: this.form.key,
					Page: this.currentPage,
					Size: this.perPage,
				}
				let response;
				try {
					response = await http(ServerAddress.userList, params, 'post')
					let { data: { data : { dataList, count}} } = response
					if (response.data.code === 0) {
						Object.assign(this, {
							dataList,
						})
					} else {
						this.$message.error('查询失败')
					}
				} catch (e) {
					console.log(e)
				}
			},
			//删除弹窗
			delConfirm(id) {
				this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.del(id);
        }).catch(() => {
        });
			},
			// 删除
			async del(id) {
				const userInfo = JSON.parse(api.getLS('userInfo'));
				const params = {
					// Token: userInfo.token,
					UserId: id,
				}
				let response;
				try {
					response = await http(ServerAddress.userDelete, params, 'post')
					this.$message({
            type: 'success',
            message: '删除成功!'
          });
					this.getData();
				} catch (e) {
					console.log(e)
				}
			},
			//重置表单
			resetForm(form = 'userForm') {
				this.$refs[form].resetFields();
			},
			// 获取角色名称
			getRoleName(roleId) {
				const filter = _.filter(this.roleList, x => x.roleId == roleId)
				if (filter.length > 0) {
					return filter[0].name
				}
			},
			//分页搜索
			pageSearch(pageConfig) {
				this.perPage = _.result(pageConfig, 'pageSize', this.perPage);
      	this.currentPage = _.result(pageConfig, 'pageNumber', this.currentPage) + 1;
				this.getData();
			},
		},
		created() {
			this.getOrganizationList();
			this.getData();
			this.getRoleList();
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
		}
	}
</script>

<style lang="less">
	.user-management {
		padding: 40px 40px 0;
		box-sizing: border-box;
		/* margin-bottom: 40px; */
		.user-management-form {
			.el-form-item--mini.el-form-item,
			.el-form-item--small.el-form-item {
				margin-bottom: 0px;
			}
		}
		.data-list {
			width: 100%;
			margin-top: 20px;
			background-color: #fff;
			overflow: hidden;
		}
	}
</style>