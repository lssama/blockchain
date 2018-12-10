<template>
  <div class="list-management">
    <h4 class="color-blue mb26 f-size-18">目录分类管理</h4>
    <!-- <div class="mt20">
			<el-button>添加子节点</el-button>
			<el-button>删除</el-button>
			<el-button>重命名</el-button>
		</div> -->
    <el-tree class="organization-tree" :data="organizationTreeList" node-key="Index" :expand-on-click-node="false" :props="defaultProps" default-expand-all>
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
    <el-dialog :title="dialogStatus === 'update' ? '修改目录分类' : '新增目录分类'" :visible="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="分类名称">
          <el-input v-model="form.name"></el-input>
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
import ServerAddress from "../../api/serverAddress.js";
import http from "../../api/http.js";
export default {
  name: "listManagement",
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "Title"
      },
      organizationTreeList: [],
      dialogVisible: false,
      rules: {
        name: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ]
      },
      form: {
        name: "",
        parentName: "",
        id: ""
      },
      dialogStatus: "",
      addNode: {},
      addData: {}
    };
  },
  methods: {
    //获取目录
    async getOrganizationList() {
      const params = {};
      let response;
      try {
        response = await http(ServerAddress.allMenu, params, "get");
        const dataList = response.data.data.dataList;
        this.organizationTreeList = dataList;
      } catch (e) {
        console.log(e);
      }
    },
    add(node, data) {
      this.dialogVisible = true;
      this.dialogStatus = "add";
      this.addNode = node;
      this.addData = data;
      this.form.parentName = data.Title;
    },
    reName(node, data) {
      this.dialogVisible = true;
      this.dialogStatus = "update";
      this.form.name = data.Title;
      this.form.parentName = node.parent.data.Title || "根类别";
      this.form.id = data.Index;
    },
    async del(data) {
      this.$confirm('确认删除?', '删除机构', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const params = {
          id: data.Index
        };
        let response;
        try {
          response = await http(ServerAddress.deleteMenu, params, "post");
          if (response.data.code === 0) {
            this.$message.success("删除成功");
            this.getOrganizationList();
          }
        } catch (e) {
          console.log(e);
        }
      }).catch(() => {
      });
      
    },
    handleClose() {
      this.dialogVisible = false;
    },
    async confirm() {
      if (this.form.name === "") {
        this.$message.error("目录名称不能为空");
        return;
      }
      if (this.dialogStatus === "update") {
        const params = {
          id: this.form.id,
          name: this.form.name
        };
        await http(ServerAddress.updateMenu, params, "post");
        this.getOrganizationList();
        this.dialogVisible = false;
        this.initForm();
      } else {
        const params = {
          // "code": 0,
          // "id": 0,
          level: this.addNode.level,
          name: this.form.name,
          pid: this.addData.Index
        };
        let response;
        try {
          response = await http(
            ServerAddress.addMenu,
            params,
            "post"
          );
          if (response.data.code === 0) {
            this.dialogVisible = false;
            this.$message.success("添加成功");
          }
          this.initForm();
          this.getOrganizationList();
        } catch (e) {
          console.log(e);
        }
      }
    },
    initForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key] = "";
      });
    }
  },
  created() {
    this.getOrganizationList();
  },
  components: {}
};
</script>

<style lang="less">
.list-management {
  padding: 20px;
  /* margin-bottom: 40px; */
  box-sizing: border-box;
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