<template>
  <div class="start-contract">
    <div class="pre-page">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item class="before-link" :to="{ path: prePath }">{{prePathName}}</el-breadcrumb-item>
        <el-breadcrumb-item class="current-page">{{contractType == 0 ? '发起合约' : '发起组合合约'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content clear">
      <div class="type-item" v-if="contractType==1" v-for="(item, index) in groupData" :key="index">
        <p class="type-title">{{index == 0 ? '数据资源': index == 1 ? '算法资源' : '算力资源'}}</p>
        <el-form class="list-con" :model="form" label-width="125px">
          <el-form-item label="信息资源名称：">
            <el-input disabled :value="item.name" class="input-item"> </el-input>
          </el-form-item>
          <el-form-item label="发布机构：">
            <el-input disabled :value="item.providerName" class="input-item"></el-input>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-input disabled :value="item.createTime | formatDate" class="input-item"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <el-form ref="form" :rules="rules" class="list-con" :class="{'pdt80': contractType == 0}" :model="form" label-width="125px">
        <el-form class="list-con-top" :model="form" label-width="125px" v-if="contractType!=1">
          <el-form-item label="信息资源名称：">
            <el-input disabled :value="$route.query.dataName" class="input-item"> </el-input>
          </el-form-item>
          <el-form-item label="发布机构：">
            <el-input disabled :value="$route.query.providerName" class="input-item"></el-input>
          </el-form-item>
          <el-form-item label="发布时间：">
            <el-input disabled :value="$route.query.createTime | formatDate" class="input-item"></el-input>
          </el-form-item>
        </el-form>
        <el-form-item label="合约名称：" prop="contractName" v-if="contractType==1" class="name-item">
          <el-input :disabled="this.$route.query.type == 2" v-model="form.contractName" class="input-item"></el-input>
        </el-form-item>
        <el-form-item label="数据用途：" prop="dataUse" class="area-form">
          <el-input type="textarea" v-model="form.dataUse" maxlength="500" class="area-item"></el-input>
        </el-form-item>
        <el-form-item label="合约周期：" class="select-period">
          <!-- <span class="val-item">一年</span> -->
          <el-select v-model="form.contractPeriod" placeholder="请选择合约周期">
            <el-option label="无限期" value="0"></el-option>
            <el-option label="一天" value="1"></el-option>
            <el-option label="三天" value="2"></el-option>
            <el-option label="七天" value="3"></el-option>
            <el-option label="15天" value="4"></el-option>
            <el-option label="一个月" value="5"></el-option>
            <el-option label="6个月" value="6"></el-option>
            <el-option label="1年" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="共享方式：">
          <span v-for="(item, index) in cataPermission" :key="index" class="val-item">{{item}}</span>
          <!-- <el-checkbox-group v-model="form.cataPermission">
            <el-checkbox v-for="(item, index) in cataPermission" :key="index" name="cataPermission" :label="item"></el-checkbox>
          </el-checkbox-group> -->
        </el-form-item>
        <el-form-item label="获取方式：">
          <el-radio v-model="form.engine_type" label="0" style="line-height:40px">去中心化</el-radio>
          <el-radio v-model="form.engine_type" label="1" style="line-height:40px">中心化</el-radio>
        </el-form-item>
        <!-- <el-form-item>
        </el-form-item> -->
        <el-button type="primary" @click="submitContract()" class="sub-btn">提交</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapActions, mapState } from "vuex";
import moment from "moment";
import http from "../../api/http.js";
import ServerAddress from "../../api/serverAddress.js";
import api from "../../api/api.js";
export default {
  data() {
    return {
      form: {
        issuerIp: "",
        dataUse: "",
        contractPeriod: "7",
        resourceId: this.$route.query.id,
        contractName: "",
        // cataPermission: ''
        engine_type: "0"
      },
      contractType: this.$route.query.id ? 0 : 1,
      resourceId: [],
      cataPermission: [],
      groupData: [],
      restartData: {},
      rules: {
        dataUse: [
          { required: true, message: "数据用途不能为空！", trigger: "blur" }
        ],
        contractName: [
          { required: true, message: "合约名称不能为空！", trigger: "blur" }
        ]
      },
      prePath: "",
      prePathName: ""
    };
  },
  methods: {
    ...mapActions(["getMessageList"]),
    ...mapMutations(["CLEAR_RESOURCE_ITEM"]),
    detail(id) {
      // debugger;
      // console.log(row, event, column);

      this.dialogVisible = true;
      const params = {
        id: id
      };
      http(ServerAddress.contractDetail, params, "get").then(result => {
        if (result.data.code === 0) {
          this.restartData = result.data.data;
          // this.detailForm.cataPermission = this.detailForm.Resources[0].cataPermission;
          this.dialogVisible = true;
          if (this.restartData.Resources.length > 1) {
            this.contractType = 1;
            this.form.contractName = this.restartData.ContractName;
            this.form.dataUse = this.restartData.DataUse;
            this.form.contractPeriod = String(this.restartData.ContractPeriod);
          } else {
            this.contractType = 0;
          }
          this.groupData = this.restartData.Resources;
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    submitContract() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.$route.query.type) {
            let params = {};
            params.id = Number(this.$route.query.id);
            params.status = 0;
            params.dataUse = this.form.dataUse;
            params.issuer = JSON.parse(api.getLS("userInfo")).address;
            params.ContractPeriod = Number(this.form.contractPeriod);
            
            params.engine_type = Number(this.form.engine_type);
            // contractStatus
            http(ServerAddress.contractUpdate, params).then(result => {
              if (result.data.code === 0) {
                this.getMessageList();
                this.$router.push(`/myContract`);
                // this.$router.go(-1);
              } else {
                this.$message.error("获取数据失败");
              }
            });
          } else {
            // "contractName": "string",
            // "contractType": 0, 1：普通合约；2：组合合约
            let params = Object.assign({}, this.form);
            if (this.contractType !== 1) {
              params.contractName = this.$route.query.dataName;
            }
            if (this.contractType === 1) {
              params.resourceId = `${this.groupData[0].id},${
                this.groupData[1].id
              },${this.groupData[2].id}`;
            }
            params.contractType = this.contractType + 1;
            params.contractPeriod = parseInt(params.contractPeriod);
            params.status = 0;
            params.createTime = Math.round(new Date() / 1000);
            params.issuer = JSON.parse(api.getLS("userInfo")).address;
            params.issuerCode = JSON.parse(
              JSON.parse(api.getLS("userInfo")).linkaddress
            ).Code;

            // 发起合约类型
            params.engine_type = Number(this.form.engine_type);

            console.log(params,'params')
            http(ServerAddress.contractAdd, params).then(result => {
              if (result.data.code === 0) {
                this.getMessageList();
                this.$router.push(`/myContract`);
                // this.$router.go(-1);
              } else {
                this.$message.error("获取数据失败");
              }
            });
          }
        }
      });
    },
    breadName(value) {
      switch (value) {
        case "0":
          return "我的合约";
        case "1":
          return "数据详情";
        case "2":
          return "算法详情";
        case "3":
          return "算力详情";
      }
    },
    prePage() {
      this.$router.go(-1);
    }
  },
  mounted() {
    // this.prePath = this.$route.query.path == 1 ? '/myContract': '/contractMonitor';
    console.log(JSON.parse(api.getSS("resource")));

    this.prePathName = this.breadName(String(this.$route.query.path));
    if (this.prePathName != "我的合约") {
      if (this.$route.query.id) {
        this.prePath = `/detailPage/${this.$route.query.id}`;
      } else {
        JSON.parse(api.getSS("resource")).map(item => {
          if (item.type == this.$route.query.path - 1) {
            this.prePath = `/detailPage/${item.id}`;
          }
        });
      }
    } else {
      this.prePath = "/myContract";
    }

    if (
      this.$route.query.cataPermission == 0 ||
      !this.$route.query.cataPermission
    ) {
      this.cataPermission.push("在线查询");
    } else if (this.$route.query.cataPermission == 1) {
      this.cataPermission.push("接口访问");
    } else if (this.$route.query.cataPermission == 2) {
      this.cataPermission.push("下载");
    }
    // this.form.cataPermission = this.cataPermission;
    // console.log(JSON.parse(JSON.parse(api.getLS('userInfo')).linkaddress).Code);
    if (this.$route.query.type == 2) {
      this.detail(this.$route.query.id);
      this.contractType = 1;
    } else if (this.$route.query.type == 1) {
      this.contractType = 0;
      this.form.dataUse = this.$route.query.dataUse;
      this.form.contractPeriod = String(this.$route.query.contractPeriod);
    } else {
      this.groupData = _.sortBy(JSON.parse(api.getSS("resource")), function(
        item
      ) {
        return item.type;
      });
      // this.cataPermission.push('在线查询');
    }
  },
  computed: {
    ...mapState({
      mixResource: state => state.resource.mixResource
    })
  },
  beforeRouteLeave(to, from, next) {
    this.CLEAR_RESOURCE_ITEM();
    next();
  },
  filters: {
    formDate(time) {
      if (time) {
        time = time * 1000;
        return moment(time).format("YYYY-M-D");
      }
    },
    formatDate(time) {
      if (time) {
        if (String(time).length == 10) {
          return moment(time * 1000).format("YYYY-M-D HH:mm:ss");
        } else {
          return moment(time).format("YYYY-M-D HH:mm:ss");
        }
      }
    }
  }
};
</script>
<style lang="less">
.start-contract {
  /* padding: 14px 14px 0 14px; */
  /* padding-bottom: 50px; */
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .pre-page {
    height: 62px;
    line-height: 62px;
    background-color: #fff;
    padding-left: 39px;
    .el-breadcrumb {
      line-height: 62px;
    }
  }
  .content {
    background-color: #fff;
    /* padding-top: 80px; */
    padding: 0 50px 100px;
    margin: 30px 40px;
    position: relative;
    .type-item {
      border-bottom: 1px solid #eceef3;
      padding-top: 16px;
      padding-bottom: 20px;
      .type-title {
        font-size: 16px;
        color: #333333;
        margin-bottom: 12px;
      }
      &:last-of-type {
        margin-bottom: 50px;
      }
    }
    .list-con {
      margin: 0 auto;
      width: 700px;
      .el-form-item--mini.el-form-item,
      .el-form-item--small.el-form-item {
        margin-bottom: 21px;
      }
      .area-form {
        line-height: 18px;
      }
      .select-period {
        margin-bottom: 43px;
        .el-form-item__label {
          line-height: 35px;
        }
        .el-input {
          width: 85px;
          height: 35px;
          .el-input__inner {
            line-height: 35px;
            height: 35px;
          }
        }
      }
    }
    .input-item {
      width: 500px;
      .el-input__inner {
        height: 40px;
      }
    }
    .name-item {
      margin-bottom: 35px !important;
    }
    .area-item {
      width: 500px;
      .el-textarea__inner {
        height: 180px;
      }
    }
    .val-item {
      font-size: 14px;
      color: #333333;
      margin-top: 4px;
      display: block;
    }
    .sub-btn {
      width: 160px;
      height: 60px;
      border-radius: 4px;
      position: absolute;
      left: 50%;
      transform: translate(-50%, 0);
      font-size: 16px;
      color: #ffffff;
    }
  }
  .pdt80 {
    padding-top: 80px;
  }
}
</style>