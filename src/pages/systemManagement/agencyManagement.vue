<template>
	<div class="agency-management">
		<h4 class="color-blue mb26 f-size-18">机构管理</h4>
		<!-- <div class="mt20">
			<el-button>添加子节点</el-button>
			<el-button>删除</el-button>
			<el-button>重命名</el-button>
		</div> -->
		<el-tree
			class="organization-tree"
      :data="organizationTreeList"
      node-key="Index"
      :expand-on-click-node="false"
			:props="defaultProps"
      default-expand-all>
			<div class="tree-item" slot-scope="{ node, data }">
				<div class="f-size-12 fl lh-32">{{ node.label }}</div>
				<div class="tree-item-operation">
					<el-button type="text" @click="() => reName(node, data)">
						重命名
					</el-button>
					<el-button v-show="!data.children && node.level !== 1" type="text" @click="() => del(data)">
						删除
					</el-button>
					<el-button v-show="node.level < 5" type="text" @click="() => add(node, data)">
						新增子类
					</el-button>
				</div>
			</div>
		</el-tree>
		<el-dialog
			:title="dialogStatus === 'update' ? '修改机构分类' : '新增机构分类'"
			:visible="dialogVisible"
			width="30%"
			:before-close="handleClose">
			<el-form ref="form" :rules="rules" :model="form" label-width="80px">
				<el-form-item label="机构名称">
					<el-input v-model="form.name"></el-input>
				</el-form-item>
				<el-form-item label="机构代码">
					<el-input :disabled="dialogStatus === 'update'" v-model="form.code"></el-input>
				</el-form-item>
				<el-form-item label="上级分类">
					<el-input disabled v-model="form.parentName"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="confirm">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	export default {
		name: 'agencyManagement',
		data() {
			return {
				defaultProps: {
          children: 'children',
          label: 'Title'
				},
				organizationTreeList: [],
				dialogVisible: false,
				rules: {
          name: [
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
				},
				form: {
					name: '',
					code: '',
					parentName: '',
					id: '',
				},
				dialogStatus: '',
				addNode: {},
				addData: {},
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
				} catch (e) {
					console.log(e)
				}
			},
			//添加子节点
			add(node, data) {
				this.dialogVisible = true;
				this.dialogStatus = 'add';
				this.addNode = node;
				this.addData = data;
				this.form.parentName = data.Title;
			},
			//修改节点
			reName(node, data) {
				this.dialogVisible = true;
				this.dialogStatus = 'update';
				this.form.name = data.Title;
				this.form.code = data.Code;
				this.form.parentName = node.parent.data.Title || '根类别';
				this.form.id = data.Index;
			},
			//删除节点
			del(data) {
				this.$confirm('确认删除?', '删除机构', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const params = {
						id: data.Index,
					}
					let response;
					try {
						response = await http(ServerAddress.deleteOrganization, params, 'post')
						if (response.data.code === 0) {
							this.$message.success('删除成功');
							this.getOrganizationList();
						}
					} catch(e) {
						console.log(e)
					}
        }).catch(() => {
        });
			},
			//关闭弹窗
			handleClose() {
				this.dialogVisible = false;
			},
			//确认表单
			async confirm() {
				if (this.form.name === '') {
					this.$message.error('机构名称不能为空');
					return;
				}
				if (this.form.code === '') {
					this.$message.error('机构代码不能为空');
					return;
				}
				if (this.dialogStatus === 'update') {
					const params = {
						id: this.form.id,
						name: this.form.name
					}
					await http(ServerAddress.updateOrganization, params, 'post')
					this.getOrganizationList();
					this.dialogVisible = false;
					this.initForm();
				} else {
					const params = {
						// "code": 0,
						// "id": 0,
						"code": this.form.code,
						"level": this.addNode.level,
						"name": this.form.name,
						"pid": this.addData.Index
					}
					let response;
					try {
						response = await http(ServerAddress.addOrganizationSubNode, params, 'post')
						if (response.data.code === 0) {
							this.dialogVisible = false;
							this.$message.success('添加成功');
							this.initForm();
							this.getOrganizationList();
						} else if (response.data.code === 2) {
							this.$message.success('机构代码不能相同');
						} else if (response.data.code === 3) {
							this.$message.success('查询失败');
						} else if (response.data.code === 4) {
							this.$message.success('机构名称不能相同');
						}
					} catch (e) {
						console.log(e)
					}
					
				}
			},
			//重置表单
			initForm() {
				Object.keys(this.form).forEach(key => {
					this.form[key] = '';
				})
			}
		},
		created() {
			this.getOrganizationList();
		},
		components: {
		}
	}
</script>

<style lang="less">
	.agency-management {
		padding: 20px;
		box-sizing: border-box;
		/* margin-bottom: 40px; */
		.organization-tree {
			margin-top: 20px;
			padding: 20px;
			box-sizing: border-box;
			.tree-item {
				width: 100%;
				&:hover {
					.tree-item-operation {
						display: block;
					}
				}
				.tree-item-operation {
					display: none;
					float: right;
				}
			}
		}
	}
</style>