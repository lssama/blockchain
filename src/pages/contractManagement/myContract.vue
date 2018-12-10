<template>
  <div class="mycontract">
    <div class="base-card">
      <h4 class="contract-title">
        我的合约
      </h4>
      <el-form ref="form" class="cont-form clear" label-width="100px">
        <div class="clear">
          <el-form-item label="合约名称:" class="top-item">
            <el-input v-model="dataName" class="search-item" placeholder="请输入合约名称"></el-input>
          </el-form-item>
          <el-form-item label="发布机构:" class="top-item">
            <el-input v-model="providerName" class="search-item" placeholder="请输入发布机构"></el-input>
          </el-form-item>
          <el-button type="primary" class="fr search-btn" @click="getContractList()">检索</el-button>
        </div>
        <div class=" clear">
          <el-col :span="24">
            <el-form-item label="申请日期:" class="date-select">
              <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="changeDate">
              </el-date-picker>
            </el-form-item>
            <el-form-item class="status-select fr">
              <el-select v-model="status" placeholder="审核状态" class="" @change="changeStatus">
                <el-option label="全部" value="全部"></el-option>
                <el-option label="待审核" value="0"></el-option>
                <el-option label="通过" value="1"></el-option>
                <el-option label="驳回" value="2"></el-option>
                <el-option label="过期" value="3"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
    </div>
    <div class="total-des fr">
      检索结果共有 <span class="color-blue">{{totalPageSize}}</span> 条
    </div>
    <div class="table-card mt50 clear">
      <div>
        <li class="table-list" @click="detail(item.Id)" v-for="item in contractList">
          <div class="list-info fl">
            <el-row :gutter="20">
              <el-col :span="5">
                <div class="item-top">
                  <span class="title">合约编号:</span>
                  <span class="val color-000">{{item.Id}}</span>
                </div>
                <div class="item">
                  <span class="title">合约名称:</span>
                  <span class="val color-000">{{item.ContractName}}</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="item-top">
                  <span class="title">合约类型:</span>
                  <span class="group-contract" v-if="item.ContractType == 2">组合类型</span>
                  <span class="data-contract" v-if="item.ContractType == 1">数据类型</span>
                </div>
                <div class="item">
                  <span class="title">发布机构:</span>
                  <span class="val">{{item.ContractTypeStr}}</span>
                </div>
              </el-col>
              <el-col :span="5">
                <div class="item-top">
                  <span class="title">共享方式:</span>
                  <span class="val">{{item.cataPermission | TypePermission}}</span>
                </div>
                <div class="item">
                  <span class="title">信息提供方式:</span>
                  <span class="val">{{item.resourceFormat}}</span>
                </div>
              </el-col>
              <el-col :span="5" class="minw212">
                <div class="item-top ">
                  <span class="title">合约周期:</span>
                  <span class="val">{{item.ContractPeriod | TypePeriod}}</span>
                </div>
                <div class="item minw212">
                  <span class="title">申请日期:</span>
                  <span class="val">{{item.CreateTime | formatDate}}</span>
                </div>
              </el-col>
              <el-col :span="4">
                <div class="item-top">
                  <span class="title">审核状态:</span>
                  <span class="val" :class="item.Status ? item.Status== 1 ? 'pass-color' : item.Status== 2 ? 'reject-color': 'color-333': 'color-333'">{{item.Status ? item.Status== 1 ? '通过' : item.Status== 2 ? '被驳回': '过期': '待审核'}}</span>
                </div>
                <div class="item">
                  <span class="title"></span>
                  <span class="val"></span>
                </div>
              </el-col>
            </el-row>
          </div>
          <div class="list-handle fr">
            <a href="javascript:;" v-if="item.Status==1 || item.Status==0" @click.stop="logsList(item.ChainAddress)" class="logExecute text-line-btm">日志</a>
            <a href="javascript:;" v-if="item.Status==1 || item.Status==0" @click.stop="readOnline(item.ResourceId, item.Issuer, item.ChainAddress, item.Resources, item.Status,item.EngineType)" class="logExecute " :class="{'no-check-color': item.Status==0, 'text-line-btm': item.Status==1}">执行</a>
            <a href="javascript:;" v-if="item.Status==2||item.Status==3" @click.stop="reStart(item)" class="reApply text-line-btm">重新申请</a>
          </div>
        </li>
      </div>
      <Pageination ref='pagination' :noSelectPage="false" :perPage="perPage" :totalPageSize="totalPageSize" :perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />
    </div>
    <el-dialog title="详情" :visible.sync="dialogVisible" :class="{'detail-dialog':true,'detail-dialog-btm': detailForm.ContractType == 2}" width="540px" :before-close="handleClose">
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
        <div class="detail-pop-item" v-if="detailForm.ContractType == 2">
          <span class="detail-left">合约名称:</span>
          <span class="detail-right">{{detailForm.ContractName}}</span>
        </div>
        <div class="detail-pop-item" v-if="detailForm.ContractType == 1">
          <span class="detail-left">信息资源名称:</span>
          <span class="detail-right">{{detailForm.ContractName}}</span>
        </div>

        <div class="detail-pop-item" v-if="detailForm.ContractType==1">
          <span class="detail-left">发布机构:</span>
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
          <span class="detail-left">获取方式:</span>
          <span class="detail-right">{{detailForm.EngineType==1?'中心化':'去中心化'}}</span>
        </div>
        <div class="detail-pop-item">
          <span class="detail-left">合约周期:</span>
          <span class="detail-right">{{detailForm.ContractPeriod |TypePeriod}}</span>
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
import { mapMutations } from "vuex";
import moment from "moment";
import http from "../../api/http.js";
import ServerAddress from "../../api/serverAddress.js";
import Pageination from "../common/pagination.vue";
import api from "../../api/api.js";
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
      contractList: [],
      dialogVisible: false,
      perPage: 15, //每页显示条目个数
      totalPageSize: 0, //总条目数
      perShow: false, //分页是否显示
      currentPage: 1,
      // currentSize: 10,
      dataName: "",
      providerName: "",
      status: "",
      resourceFormat: "",
      dateRange: [],
      detailForm: {},
      tract: [],
      startDate: 0,
      endDate: 0
    };
  },
  mounted() {},
  methods: {
    ...mapMutations(["CHANGE_MENU_ID"]),
    throttleSearch(obj, page) {
      this.perPage = obj.pageSize;
      this.currentPage = obj.pageNumber + 1;
      this.getContractList();
    },
    changeStatus() {
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
        Issuer: JSON.parse(api.getLS("userInfo")).address,
        dataName: this.dataName,
        OrganName: this.providerName,
        status: this.status === "全部" ? "" : this.status,
        resourceFormat: this.resourceFormat,
        // startDate: this.dateRange ? this.dateRange.length ? Math.round(this.dateRange[0].getTime()/1000) : 0 : 0,
        startDate: this.startDate / 1000,
        endDate: this.endDate / 1000
      };
      http(ServerAddress.contractIssuer, params).then(result => {
        if (result.data.code === 0) {
          const {
            data: { dataList = [], count }
          } = result.data;
          Object.assign(this, {
            perShow: count === 0 ? false : true,
            contractList: dataList,
            totalPageSize: count
          });
          this.contractList.map(item => {
            if (item.ContractType == 2) {
              item.ContractTypeStr = _.map(item.Resources, "providerName").join(
                ","
              );
              item.resourceFormat =
                this.switchType(item.Resources[0].resourceFormat) +
                "," +
                this.switchType(item.Resources[1].resourceFormat) +
                ",--";
            } else {
              item.ContractTypeStr = item.Resources[0].providerName;
              item.resourceFormat = this.switchType(
                item.Resources[0].resourceFormat
              );
            }
            item.cataPermission = item.Resources[0].cataPermission;
          });
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    switchType(value) {
      switch (value) {
        case 0:
          return "API";
        case 1:
          return "结构化文档";
        case 2:
          return "非结构化文档";
        case 3:
          return "关系型数据";
      }
    },
    detail(id) {
      this.dialogVisible = true;
      const params = {
        id: id
      };
      http(ServerAddress.contractDetail, params, "get").then(result => {
        if (result.data.code === 0) {
          this.detailForm = result.data.data;
          this.detailForm.cataPermission = this.detailForm.Resources[0].cataPermission;
          this.dialogVisible = true;
        } else {
          this.$message.error("获取数据失败");
        }
      });
    },
    logsList(address) {
      this.$router.push({ path: `/contractLog`, query: { address, path: 1 } });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    readOnline(id, issuer, address, resource, status, engineType) {
      if (status == 0) {
        return false;
      }
      let ids = "";
      if (resource.length > 1) {
        ids = resource[0].id;
      } else {
        ids = id;
      }
      this.$router.push({
        path: `/queryOnline`,
        query: { id: ids, issuer, address, engineType }
      });
    },
    reStart(item) {
      this.$router.push({
        path: `/contractStart`,
        query: {
          id: item.Id,
          dataName: item.ContractName,
          providerName: item.OrganName,
          createTime: item.CreateTime,
          cataPermission: item.cataPermission,
          contractPeriod: item.ContractPeriod,
          type: item.ContractType,
          dataUse: item.DataUse,
          path: 0
        }
      });
    },
    handleCell() {}
  },
  mounted() {
    this.getContractList();
    if (this.$route.query.id) {
      this.detail(this.$route.query.id);
    }
  },
  watch: {
    $route(val, oldVal) {
      // console.log(val, oldVal);
      this.detail(this.$route.query.id);
    }
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
    },
    TypeDes(value) {
      switch (value) {
        case 0:
          return "合约创建";
        case 1:
          return "合约签名";
        case 2:
          return "买方支付";
        case 3:
          return "执行发起";
        case 4:
          return "数据上传";
        case 5:
          return "算法上传";
        case 6:
          return "计算完成";
        case 7:
          return "下载完成";
        default:
          return "";
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
    },
    TypeResource(value) {
      switch (value) {
        case 0:
          return "API";
        case 1:
          return "关系型数据库";
        case 2:
          return "非结构化文档";
        case 3:
          return "结构化文档";
      }
    }
  }
};
</script>

<style lang="less">
.mycontract {
  font-size: 14px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  .contract-title {
    font-size: 20px;
    color: rgba(0, 0, 0, 0.85);
    margin-bottom: 38px;
  }
  .cont-form {
    .status-select {
      .el-input--small .el-input__inner {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #999999;
      }
      .el-select--small {
        width: 118px;
      }
    }
  }
  .base-card {
    padding: 24px 42px 26px 40px;
    background-color: #fff;
    .form-line {
      margin-top: 0;
    }

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
      margin-bottom: 42px;
    }
    .el-form-item--mini.el-form-item,
    .el-form-item--small.status-select {
      float: right;
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
  }
  .total-des {
    margin-right: 44px;
    margin-top: 17px;
    font-size: 13px;
    color: #999999;
  }
  .table-card {
    margin-left: 40px;
    margin-right: 44px;
    .table-list {
      list-style: none;
      width: 100%;
      height: 129px;
      background-color: #fff;
      border-bottom: 1px solid #dee0e4;
      display: flex;
      &:hover {
        background-color: #fafeff;
      }
      &:last-of-type {
        border-bottom: none;
      }
      .list-info {
        padding-left: 14px;
        flex: 92;
        .item-top {
          padding-top: 38px;
          line-height: 29px;
        }
        .minw212 {
          min-width: 212px;
        }

        .item {
          padding-top: 21px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .title {
          font-size: 14px;
          color: #333333;
          margin-right: 9px;
        }
        .val {
          font-size: 14px;
          color: #333333;
        }
        .val.color-000 {
          color: #000;
        }
      }
      .list-handle {
        /* border-left: 1px solid  #DEE0E4; */
        height: 100%;
        flex: 8;
        text-align: center;
        a {
          display: block;
          font-size: 14px;
          color: #2159d6;
        }
        .logExecute {
          margin-top: 28px;
        }
        .reApply {
          line-height: 129px;
        }
        .no-check-color {
          color: #999999;
          cursor: default;
        }
      }
    }
    .el-table thead tr th {
      background: #2159d6;
      border-radius: 0 0 2px 2px;
      font-size: 14px;
      color: #ffffff;
      font-weight: normal;
      height: 60px;
    }
    .el-table tbody tr td {
      height: 60px;
    }
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
  }
  .group-pop {
    .detail-pop-item {
      margin-top: 11px;
    }
  }
  .data-pop {
    .detail-pop-item {
      line-height: 60px;
      border-top: 1px solid #eceef3;
    }
  }
  .c-p {
    cursor: pointer;
  }
  .detail-dialog {
    .el-dialog__header {
      padding-top: 30px;
      padding-bottom: 30px;
      .el-dialog__title {
        font-size: 16px;
        color: #333333;
      }
      .el-dialog__headerbtn {
        font-size: 30px;
        .el-dialog__close {
          color: #333333;
        }
      }
    }
    .el-dialog__body {
      padding: 0 56px 50px;
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
  .pass-color {
    color: #52c41a !important;
  }
  .reject-color {
    color: #f5222d !important;
  }
}
</style>
