<template>
  <div class="contract-check">
    <div class="base-card">
      <h4 class="contract-title">
        合约审核
      </h4>
      <el-tabs v-model="tabType" @tab-click="handleClick" class="tabs-list">
        <el-tab-pane label="待审核" name="0"></el-tab-pane>
        <el-tab-pane label="已审核" name="1"></el-tab-pane>
      </el-tabs>
      <div class="pd-l-48 mt24 pd-r-40">
        <el-form ref="form" class=" clear" label-width="100px">
          <div class="clear">
            <el-form-item label="合约名称:" class="top-item">
              <el-input v-model="dataName" class="search-item" placeholder="请输入合约名称"></el-input>
            </el-form-item>
            <el-form-item label="申请机构:" class="top-item">
              <el-input v-model="providerName" class="search-item" placeholder="请输入申请机构"></el-input>
            </el-form-item>
            <el-button type="primary" class="fr search-btn" @click="getContractList()">检索</el-button>
          </div>
          <!-- <p class="form-line"></p> -->
          <div class="clear">
            <el-form-item label="申请日期:" class="date-select">
              <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>
    <div class="total-des fr">
      检索结果共有 <span class="color-blue">{{totalPageSize}}</span> 条
    </div>
    <div class="table-card mt50 clear">
      <el-table :data="contractList" header-cell-class-name="table-head" cell-class-name="table-cell" style="width: 100%">
        <el-table-column prop="id" align="center" label="合约编号">
        </el-table-column>
        <el-table-column prop="contractName" align="center" label="合约名称">
        </el-table-column>
        <el-table-column align="center" prop="contractType" label="合约类型">
          <template slot-scope="scope">

            <span class="group-contract" v-if="scope.row.contractType == 2">组合类型</span>
            <span class="data-contract" v-if="scope.row.contractType == 1">数据类型</span>
          </template>
        </el-table-column>
        <el-table-column prop="organName" align="center" label="申请机构">
        </el-table-column>
        <el-table-column prop="dataUse" align="center" label="数据用途">
        </el-table-column>
        <el-table-column prop="contractPeriod" align="center" label="合约周期">
          <template slot-scope="scope">
            <span>{{scope.row.contractPeriod |TypePeriod}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" align="center" min-width="95px" label="申请日期">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDate}}</span>
            </template>
        </el-table-column>
        <el-table-column prop="status" align="center" label="合约状态" v-if="tabType==1">
          <template slot-scope="scope">
            <span>{{scope.row.status ? scope.row.status== 1 ? '通过' : scope.row.status== 2 ? '被驳回': '过期': '待审核'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="操作" align="center" v-if="tabType==0">
          <template slot-scope="scope">
            <a href="javascript:;" @click='checkContract(scope.row)' class="color-blue text-line-btm">审核</a>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize" :perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />

    <el-dialog title="审核" :visible.sync="dialogVisible" width="540px" top="80px" :class="{'detail-dialog':true,'detail-dialog-btm': popAudit.ContractType == 2}" :before-close="handleClose">
      <div class="detail-pop" :class="{'data-pop': popAudit.ContractType == 1, 'group-pop': popAudit.ContractType == 2}">
        <div class="type-list" v-if="popAudit.ContractType == 2" v-for="(item, index) in popAudit.Resources" :key="index">
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
        <div class="detail-pop-item" v-if="popAudit.ContractType == 2">
          <span class="detail-left">合约名称:</span>
          <span class="detail-right">{{popAudit.ContractName}}</span>
        </div>
        <div class="detail-pop-item" v-if="popAudit.ContractType == 1">
          <span class="detail-left">信息资源名称:</span>
          <span class="detail-right">{{popAudit.ContractName}}</span>
        </div>
        <div class="detail-pop-item" v-if="popAudit.ContractType==1">
          <span class="detail-left">申请机构:</span>
          <span class="detail-right">{{popAudit.OrganName}}</span>
        </div>
        <div class="detail-pop-item">
          <span class="detail-left">数据用途:</span>
          <span class="detail-right">{{popAudit.DataUse}}</span>
        </div>
        <div class="detail-pop-item">
          <span class="detail-left">共享方式:</span>
          <span class="detail-right">{{popAudit.cataPermission | TypePermission}}</span>
        </div>
        <div class="detail-pop-item">
          <span class="detail-left">获取方式:</span>
          <span class="detail-right">{{popAudit.EngineType==1?"中心化":"去中心化"}}</span>
        </div>
        <div class="detail-pop-item" :class="{'detail-pop-item-check': popAudit.ContractType == 2}">
          <span class="detail-left" :class="{'detail-left-check': popAudit.ContractType == 2}">审批意见:</span>
          <el-input type="textarea" class="advice" v-model="options"></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" center="true">
        <el-button type="primary" @click="auditSumit(1)">通 过</el-button>
        <el-button type="primary" class="reject-btn" @click="auditSumit(2)">驳 回</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import { mapMutations, mapActions } from "vuex";
import moment from "moment";
import http from "../../api/http.js";
import api from "../../api/api.js";
import ServerAddress from "../../api/serverAddress.js";
import Pageination from "../common/pagination.vue";
export default {
  components: {
    Pageination
  },
  data() {
    return {
      formInline: {
        status: "",
        type: ""
      },
      contractList: [
        {
          name: "社会福利机构信息",
          origanization: "咸阳市民政局",
          type: "API",
          right: "0",
          period: "1年",
          date: "2018-05-26",
          status: 0
        }
      ],
      perPage: 15, //每页显示条目个数
      totalPageSize: 0, //总条目数
      perShow: false, //分页是否显示
      currentPage: 1,
      dialogVisible: false,
      dataName: "",
      providerName: "",
      status: "",
      resourceFormat: "",
      dateRange: [],
      startDate: 0,
      endDate: 0,
      options: "",
      popAudit: {},
      tabType: "0"
    };
  },
  methods: {
    ...mapActions(["getMessageList"]),
    checkContract(item) {
      // debugger;
      // this.popAudit = item;
      this.dialogVisible = true;
      const params = {
        id: item.id
      };
      http(ServerAddress.contractDetail, params, "get").then(result => {
        if (result.data.code === 0) {
          this.popAudit = result.data.data;
          this.popAudit.cataPermission = this.popAudit.Resources[0].cataPermission;
          this.dialogVisible = true;
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    throttleSearch(obj, page) {
      this.perPage = obj.pageSize;
      this.currentPage = obj.pageNumber + 1;
      this.getContractList();
    },
    //修改时间
    changeDate(date) {
      if (date) {
        this.startDate = date[0].getTime();
        this.endDate = date[1].getTime() + 24 * 60 * 60 * 1000 - 1000;
      } else {
        this.startDate = 0;
        this.endDate = 0;
      }
      this.getContractList();
    },
    getContractList() {
      const params = {
        page: this.currentPage,
        size: this.perPage,
        dataName: this.dataName,
        startDate: this.startDate / 1000,
        endDate: this.endDate / 1000,
        Issuer: this.providerName,
        status: this.status,
        tabType: this.tabType
      };
      http(ServerAddress.contractList, params).then(result => {
        if (result.data.code === 0) {
          // this.contractList = result.data.data.dataList;
          const {
            data: { dataList = [], count }
          } = result.data;
          // this.contractList = result.data.data.dataList;
          Object.assign(this, {
            perShow: count === 0 ? false : true,
            contractList: dataList,
            totalPageSize: count
          });
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    auditSumit(status) {
      const params = {
        Auditor: "1",
        Id: this.popAudit.Id,
        Opinion: this.options,
        Status: status
        // 1通过 2驳回
      };
      http(ServerAddress.contractAudit, params).then(result => {
        if (result.data.code === 0) {
          this.getMessageList();
          if (status == 1) {
            this.autoChain();
          }
          this.dialogVisible = false;
          this.getContractList();
        } else {
          this.$message.error("获取数据失败");
        }
        this.options = "";
      });
    },
    autoChain() {
      let Datas = [];
      let Algorithms = [];
      let Computes = [];
      if (this.popAudit.ContractType == 2) {
        Datas.push(this.popAudit.Resources[0].chainAddress);
        Algorithms.push(this.popAudit.Resources[1].chainAddress);
        Computes.push(this.popAudit.Resources[2].chainAddress);
      } else {
        Datas.push(this.popAudit.Resources[0].chainAddress);
      }

      const userInfo = JSON.parse(api.getLS("userInfo"));
      let addParams = {
        Name: "SSS",
        Balance: 0,
        Datas,
        Algorithms,
        Computes,
        Times: 1000000000,
        Passwd: userInfo.password,
        Issuer: this.popAudit.Issuer,
        Id: this.popAudit.Id
      };
      if (this.popAudit.EngineType == 0) {
        http(
          ServerAddress.orderAdd,
          JSON.stringify(addParams),
          "post",
          "chain"
        ).then(result => {
          if (result.data.code === 200) {
            this.dialogVisible = false;
            this.getContractList();
          } else {
            this.$message.error("获取数据失败");
            // this.loading = false;
          }
        });
      } else {
        // delete addParams.Datas;
        // delete addParams.Algorithms;
        // delete addParams.Computes;
        Datas = [];
        Algorithms=[];
        Computes = [];
        if (this.popAudit.ContractType == 2) {
          Datas.push(this.popAudit.Resources[0].engine_id);
          Algorithms.push(this.popAudit.Resources[1].engine_id);
          Computes.push(this.popAudit.Resources[2].engine_id);
        } else {
          Datas.push(this.popAudit.Resources[0].engine_id);
        }
        addParams.Datas = Datas
        addParams.Algorithms = Algorithms
        addParams.Computes = Computes
        http(
          ServerAddress.createcontract,
          JSON.stringify(addParams),
          "post",
          "chain"
        ).then(result => {
          if (result.data.code === 200) {
            this.dialogVisible = false;
            this.getContractList();
          } else {
            this.$message.error("获取数据失败");
          }
        });
      }
    },
    handleClick(tab, event) {
      console.log(tab.name);
      if (tab.name == "1") {
        this.tabType = "1";
      } else {
        this.tabType = "0";
      }
      this.getContractList();
    },
    detail(row, event, column) {
      // debugger;
      console.log(row, event, column);

      this.dialogVisible = true;
      const params = {
        id: row.id
      };
      http(ServerAddress.contractDetail, params, "get").then(result => {
        if (result.data.code === 0) {
          this.popAudit = result.data.data;
          this.dialogVisible = true;
        } else {
          this.$message.error("获取数据失败");
        }
      });
    }
  },
  mounted() {
    this.getContractList();
    if (this.$route.query.id) {
      this.detail({ id: this.$route.query.id });
    }
  },
  filters: {
    formatDate(time) {
      if (time) {
        if (String(time).length == 10) {
          return moment(time * 1000).format("YYYY-M-D HH:mm:ss");
        } else {
          return moment(time).format("YYYY-M-D HH:mm:ss");
        }
      }
    },
    formDate(time) {
      if (time) {
        time = time * 1000;
        return moment(time).format("YYYY-M-D");
      }
    },
    TypePeriod(value) {
      switch (value) {
        case 0:
          return "无限期";
        case 1:
          return "一天";
        case 2:
          return "三天";
        case 3:
          return "七天";
        case 4:
          return "15天";
        case 5:
          return "一个月";
        case 6:
          return "6个月";
        case 7:
          return "1年";
        default:
          return "";
      }
    },
    TypePermission(value) {
      switch (value) {
        case 0:
          return "在线查询";
        case 1:
          return "接口访问";
        case 2:
          return "下载";
      }
    }
  }
};
</script>

<style lang="less">
.contract-check {
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .contract-title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 30px;
    padding-left: 46px;
  }
  .tabs-list {
    background-color: #fff;
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav {
      height: 50px;
      line-height: 50px;
      margin-left: 80px;
      .el-tabs__active-bar {
        height: 4px;
      }
      .el-tabs__item {
        font-size: 18px;
        color: #333333;
      }
      .is-active {
        color: #2159d6;
      }
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background: #dee0e4;
    }
  }

  .base-card {
    padding: 24px 0 22px;
    background-color: #fff;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      width: max-content;
      float: left;
      /* margin-right: 56px; */
      margin-bottom: 0;
      &:last-child {
        margin-right: 0;
      }
      .el-form-item--small .el-form-item__content {
        width: min-content;
      }
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.top-item {
      margin-bottom: 22px;
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.date-select {
      float: right;
    }
    .search-btn {
      width: 144px;
      height: 40px;
      /* background: #2159D6; */
      border-radius: 2px;
      font-size: 16px;
      color: #ffffff;
    }
    .pd-l-48 {
      padding-left: 48px;
    }
    .pd-r-40 {
      padding-right: 40px;
    }
  }
  .total-des {
    margin-right: 34px;
    margin-top: 24px;
    font-size: 13px;
    color: #999999;
  }
  .table-card {
    margin-left: 46px;
    margin-right: 34px;
  }

  .line-mid {
    float: left;
    margin: 0 10px;
  }

  .detail-pop {
    .type-list {
      border-bottom: 1px solid #eceef3;
      padding: 11px 0;
    }
    .detail-pop-item {
      /* height: 60px; */
      /* line-height: 60px;
				border-top: 1px solid #ECEEF3; */
      /* margin-top: 11px; */
    }
    .detail-left {
      font-size: 14px;
      color: #999999;
    }
    .detail-right {
      float: right;
      font-size: 14px;
      color: #333333;
    }
    .advice {
      display: inline-block;
      width: 440px;
      vertical-align: top;
      .el-textarea__inner {
        height: 200px;
      }
    }
  }
  .group-pop {
    .detail-pop-item {
      margin-top: 11px;
    }
    .detail-pop-item-check {
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #eceef3;
    }
    .detail-left-check {
      margin-bottom: 10px;
      display: inline-block;
    }
  }
  .data-pop {
    .detail-pop-item {
      /* height: 60px; */
      line-height: 60px;
      border-top: 1px solid #eceef3;
    }
  }
  .detail-dialog {
    .el-dialog__footer {
      padding: 40px 90px;
      .el-button {
        width: 160px;
        height: 60px;
        font-size: 16px;
        color: #ffffff;
      }
      .reject-btn {
        background-color: #fff;
        font-size: 16px;
        color: #2159d6;
        border: 1px solid #2159d6;
        border-radius: 2px;
      }
    }
  }
  .detail-dialog-btm {
    .el-dialog__header {
      border-bottom: 1px solid #eceef3;
    }
  }
  .text-line-btm {
    text-decoration: underline;
  }
}
</style>
