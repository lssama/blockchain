<template>
  <div class="issure-list">
    <h4 class="title f-size-20">我的资源</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-list">
      <el-tab-pane label="草稿箱" name="0">
        <ul class="ul-info f-size-14">
          <li v-for="(item, index) in tableData" :key="index" class="form-block clear">
            <div>
              <p class="color-blue f-size-16"><b>{{item.name}}</b><span class="cata-tag ml20" v-if="item.type === 1">数据</span><span class="cata-tag ml20 arithmetic" v-else-if="item.type === 2">算法</span><span class="cata-tag ml20 hashrate" v-else-if="item.type === 3">算力</span></p>
              <p class="mt8 color-333">{{item.resourceDescription}}</p>
            </div>
            <!-- <div class="form-line"></div> -->
            <div class="mt25">
              <el-col :span="6">
                <div>
                  <p class="color-999"><span class="mr20">共享类型:</span><span class="color-595959">{{item.shareType | shareType}}</span></p>
                  <p class="mt10 color-999"><span class="mr20">发布机构:</span><span class="color-595959">{{item.providerName}}</span></p>
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  <p class="color-999"><span class="mr20">更新周期:</span><span class="color-595959">{{item.updatePeriod | updataTime}}</span></p>
                  <p class="mt10 color-999"><span class="mr20">资源类型:</span><span class="color-595959">{{item.cataType | cataType}}</span></p>
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  <p class="color-999"><span class="mr20">审核状态:</span><span class="color-D0021B" v-if="item.status == 0">{{item.status | checkType}}</span> <span v-else class="color-595959">{{item.status | checkType}}</span></p>
                  <p class="mt10 color-999"><span class="mr20">上链状态:</span><span class="color-595959">{{item.chainStatus | chainType}}</span></p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="operate-btns">
                  <div @click="revise(item)" class="mr40 mb16">资源详情</div>
                  <div @click="conInfo(item)">提交审核</div>
                </div>
              </el-col>
            </div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="已提交" name="1">
        <el-form ref="form" label-width="110px" :label-position="labelposition" class="form-block" size="larger">
          <el-form-item label="按审核状态">
            <el-checkbox-group v-model="type">
              <el-checkbox label="1" name="type">审核中</el-checkbox>
              <el-checkbox label="2" name="type">审核通过</el-checkbox>
              <el-checkbox label="3" name="type">审核被驳回</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div class="form-line"></div>
          <el-form-item label="按信息资源类别">
            <el-checkbox-group v-model="format">
              <el-checkbox label="1" name="type">数据</el-checkbox>
              <el-checkbox label="2" name="type">算法</el-checkbox>
              <el-checkbox label="3" name="type">算力</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <div class="form-line"></div>
          <el-form-item label-width="0">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="">
                  <el-input v-model="name" class="fl search-inner-input fs-input" placeholder="输入数据目录的名称"></el-input>
                  <el-button type="primary" class="fl search-btn" @click="getList">检索</el-button>
                </el-form-item>
                <!-- <el-form-item label="信息资源名称">
                  <el-input v-model="name" placeholder="输入数据目录的名称"></el-input>
                </el-form-item> -->
              </el-col>
              <el-col :span="8">
                <el-form-item label="按发布时间段" label-width="100px">
                  <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" @change="changeDate">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <!-- <el-form-item label="" class="fr">
                  <el-button type="primary" size="larger" class="ml20" @click="getList">检索</el-button>
                </el-form-item> -->
              </el-col>
            </el-row>
          </el-form-item>
        </el-form>
        <ul class="mt40 ul-info f-size-14" :class="{'ul-info-btm': tableData&&tableData.length > 0}">
          <li v-for="(item, index) in tableData" :key="index" class="form-block  clear">
            <div>
              <p class="color-blue f-size-16"><b>{{item.name}}</b><span class="cata-tag ml20" v-if="item.type === 1">数据</span><span class="cata-tag ml20 arithmetic" v-else-if="item.type === 2">算法</span><span class="cata-tag ml20 hashrate" v-else-if="item.type === 3">算力</span></p>
              <p class="mt8 color-333">{{item.resourceDescription}}</p>
            </div>
            <!-- <div class="form-line"></div> -->
            <div class="mt25">
              <el-col :span="6">
                <div>
                  <p class="color-999"><span class="mr10 ">共享类型:</span><span class="color-595959">{{item.shareType | shareType}}</span></p>
                  <p class="mt10 color-999"><span class="mr10">发布机构:</span><span class="color-595959">{{item.providerName}}</span></p>
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  <p class="color-999"><span class="mr10">更新周期:</span><span class="color-595959">{{item.updatePeriod | updataTime}}</span></p>
                  <p class="mt10 color-999"><span class="mr10">资源类型:</span><span class="color-595959">{{item.cataType | cataType}}</span></p>
                </div>
              </el-col>
              <el-col :span="5">
                <div>
                  <p class="color-999"><span class="mr10">审核状态:</span> <span class="color-D0021B" v-if="item.status == 0">{{item.status | checkType}}</span> <span class="color-595959" v-else>{{item.status | checkType}}</span></p>
                  <p class="mt10 color-999"><span class="mr10">上链状态:</span><span class="color-595959">{{item.chainStatus | chainType}}</span></p>
                </div>
              </el-col>
              <el-col :span="8">
                <div class=" operate-btns">
                  <div @click="getDetail(item)" class="mr40 mb16">资源详情</div>
                  <div v-if="item.status === 1" @click="conInfo(item)">撤回审核</div>
                  <div v-if="item.status === 3" @click="seeCheck(item)">修改数据</div>
                  <div v-if="item.status === 2 && item.chainStatus !== 1" @click="conInfo(item)">发布上链</div>
                  <div v-if="item.status === 2 && item.chainStatus === 1" @click="conInfo(item)">下链数据</div>
                </div>
              </el-col>
            </div>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <el-dialog :visible.sync="isShow" width="30%" center class="dialog-mask" :show-close="false">
      <p class="mask-header"></p>
      <span class="header-icon"><i></i></span>
      <div v-if="status === 1">确定撤回审核？</div>
      <div v-if="status === 0">确定提交审核？</div>
      <div v-if="status === 2 && chainStatus !== 1">确定发布上链？</div>
      <!-- <div v-if="chainStatus !== 0">确定{{chainStatus === 1 ? '下' : '上'}}架数据？</div> -->
      <div v-if="status === 2 && chainStatus === 1">确定下链数据？</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShow = false">取 消</el-button>
        <el-button v-if="status === 1" type="primary" @click="cancelCheck">确 定</el-button>
        <el-button v-if="status === 0" type="primary" @click="conCheck">确 定</el-button>
        <el-button v-if="status === 2 && chainStatus !== 1" type="primary" @click="onChain">确 定</el-button>
        <!-- <el-button v-if="chainStatus !== 0" type="primary" @click="cancelChain">确 定</el-button> -->
        <el-button v-if="status === 2 && chainStatus === 1" type="primary" @click="cancelChain">确 定</el-button>
      </span>
    </el-dialog>
    <Pagination :totalPageSize="total" :noSelectPage="false" :perPage="perPage" :perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />
  </div>
</template>

<script>
import http from "../../api/http";
import ServerAddress from "../../api/serverAddress";
import Pagination from "../common/pagination";
import { mapActions } from "vuex";
export default {
  components: {
    Pagination
  },
  data() {
    return {
      total: 0,
      perPage: 15, //每页显示条目个数
      perShow: false, //分页是否显示
      currentPage: 1, //当前页
      activeName: "1",
      type: [],
      format: [],
      name: "",
      date: [],
      labelposition: "left",
      tableData: [],
      tableData1: [],
      isShow: false,
      status: 0,
      chainStatus: 0,
      dataInfo: {},
      isSearch: false,
      StartDate: 0,
      EndDate: 0
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    ...mapActions(["getMessageList"]),
    handleClick() {
      this.getList();
    },
    //获取目录列表
    getList() {
      // let data = {
      //   issuer: JSON.parse(localStorage.getItem("userInfo")).address,
      //   tabType: Number(this.activeName),
      //   page: this.currentPage,
      //   size: this.perPage
      // };
      //     "DataName": "string",
      // "EndDate": 0,
      // "Issuer": "string",
      // "Page": 0,
      // "Size": 0,
      // "StartDate": 0,
      // "Status": "string",
      // "Type": "string"
      let data = {
        Issuer: JSON.parse(localStorage.getItem("userInfo")).address,
        // searchType: 1,
        Page: this.currentPage,
        Size: this.perPage,
        Status:
          this.activeName == "0"
            ? "0"
            : this.type.length > 0
              ? this.type.join(",")
              : "1,2,3",
        DataName: this.name,
        Type: this.format.join(",")
      };
      if (this.date && this.date.length > 1) {
        data.StartDate = this.StartDate / 1000;
        data.EndDate = this.EndDate / 1000;
      }
      // if (this.type.length === 0) {
      //   delete data.Status;
      // }
      if (this.format.length === 0) {
        delete data.Type;
      }
      http(ServerAddress.resourceIssuer, data).then(result => {
        // console.log(result);
        this.total = result.data.data.count;
        this.perShow = this.total === 0 ? false : true;
        this.tableData = result.data.data.dataList;
        this.tableData1 = result.data.data.dataList;
      });
      // this.tableData = [{name: '机动车变更登记机动车变更登记',resourceDescription: '主题信息资源类/公共服务事项/便民服务事项/便民服务猪蹄信息资源类/公共服务事项/便民服务事项/便民服务', shareType: 1, status: 2,providerName: '昆明市公安局', chainStatus: 2},{name: '机动车变更登记机动车变更登记',resourceDescription: '主题信息资源类/公共服务事项/便民服务事项/便民服务猪蹄信息资源类/公共服务事项/便民服务事项/便民服务', shareType: 1, status: 2,providerName: '昆明市公安局', chainStatus: 2}];
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
      this.getList();
    },
    //草稿箱进入详情，可修改
    revise(row) {
      this.$router.push({
        path: "/directoryOnChain",
        query: {
          id: row.id
        }
      });
    },
    //已提交详情，不可编辑
    getDetail(row) {
      this.$router.push({
        path: "/detail",
        query: {
          id: row.id,
          type: row.type
          // status: row.status,
          // chainStatus: row.chainStatus,
          // row
        }
      });
    },
    //确认操作弹框
    conInfo(row) {
      this.dataInfo = row;
      this.status = row.status;
      this.chainStatus = row.chainStatus;
      this.isShow = true;
    },
    //查看审核
    seeCheck(row) {
      this.$router.push({
        path: "/directoryOnChain",
        query: {
          id: row.id
        }
      });
    },
    //撤回审核
    cancelCheck() {
      let data = {
        id: this.dataInfo.id,
        Status: 0
      };
      http(ServerAddress.resourceStatus, data).then(result => {
        // console.log(result);
        this.getList();
        this.isShow = false;
        this.getMessageList();
      });
    },
    //提交审核
    conCheck() {
      let data = {
        id: this.dataInfo.id,
        Status: 1
      };
      http(ServerAddress.resourceStatus, data).then(result => {
        // console.log(result);
        this.getList();
        this.isShow = false;
        this.getMessageList();
      });
    },
    //上链
    onChain() {
      if (this.chainStatus === 0) {
        // 0：未上链过  1：链上  2：上链之后被下链
        let dateLimit = Math.round((new Date().getTime() + 31536000000) / 1000);
        let data = {
          Id: this.dataInfo.id,
          DataName: this.dataInfo.name,
          DataSource: JSON.parse(this.dataInfo.schemaJson).address,
          Passwd: JSON.parse(localStorage.getItem("userInfo")).password,
          Issuer: JSON.parse(localStorage.getItem("userInfo")).address,
          DefaultTimes: 100,
          SchemaJson:
            '{"inexp":[{"name":"sddf","required":"1","type":"0","note":"asdfasdf"},{"name":"","required":"","type":"","note":""}],"outexp":[],"incase":"","outcase":"","errcase":"","goodsType":["基础医学数据","疾病","脑血管病科","脑卒中科","出血性脑血管病"],"goodsTag":[],"description":"asdfasdf"}',
          Price: [0, 0, 0],
          MinTimes: [100, 200, 300],
          MaxTimes: [199, 299, 0],
          DateLimits: [dateLimit, dateLimit, dateLimit]
        };
        if (this.dataInfo.type == 1) {
          Promise.all([this.createCatalogs(),http(ServerAddress.dataAdd, data, "post", "chain")]).then(([res1,res2])=>{
            if(res1.data.code == 200&&res2.data.code == 200){
              this.getList();
              this.isShow = false;
              this.getMessageList();
            }else{
              this.$message.error("上链失败！");
              this.isShow = false;
            }
          }).catch(err=>{
            this.$message.error(err);
          })
          // http(ServerAddress.dataAdd, data, "post", "chain").then(result => {
          //   if (result.data.code == 200) {
          //     this.getList();
          //     this.isShow = false;
          //     this.getMessageList();
          //   } else {
          //     this.$message.error("上链失败！");
          //   }
          // });
        } else if (this.dataInfo.type == 2) {
          delete data.DataName;
          delete data.DataSource;
          data.AlgorithmName = this.dataInfo.name;
          data.AlgorithmSource = JSON.parse(this.dataInfo.schemaJson).address;
          Promise.all([this.createCatalogs(),http(ServerAddress.algorithmAdd, data, "post", "chain")]).then(([res1,res2])=>{
            if(res1.data.code == 200 && res2.data.code == 200){
              this.getList();
              this.isShow = false;
              this.getMessageList();
            }else{
              this.$message.error("上链失败！");
              this.isShow = false;
            }
          }).catch(err=>{
            this.$message.error(err);
          })
          // http(ServerAddress.algorithmAdd, data, "post", "chain").then(
          //   result => {
          //     if (result.data.code == 200) {
          //       this.getList();
          //       this.isShow = false;
          //       this.getMessageList();
          //     } else {
          //       this.$message.error("上链失败！");
          //     }
          //   }
          // );
        } else if (this.dataInfo.type == 3) {
          delete data.DataName;
          delete data.DataSource;
          data.ComputeName = this.dataInfo.name;
          Promise.all([this.createCatalogs(),http(ServerAddress.computeAdd, data, "post", "chain")]).then(([res1,res2])=>{
            if(res1.data.code == 200 && res2.data.code ==200){
              this.getList();
              this.isShow = false;
              this.getMessageList();
            }else{
              this.$message.error("上链失败！");
              this.isShow = false;
            }
          }).catch(err=>{
            this.$message.error(err);
          })
          // http(ServerAddress.computeAdd, data, "post", "chain").then(result => {
          //   if (result.data.code == 200) {
          //     this.getList();
          //     this.isShow = false;
          //     this.getMessageList();
          //   } else {
          //     this.$message.error("上链失败！");
          //   }
          // });
        }
      } else if (this.chainStatus === 2) {
        let data = {
          ChainAddress: this.dataInfo.chainAddress,
          ChainStatus: 1,
          Id: this.dataInfo.id
        };
        // Promise.all([this.createCatalogs(),http(ServerAddress.resourceAddChain, data)]).then(([res1,res2])=>{
        //   if(res1.data.code ==200 && res2.data.code == 0){
        //     this.getList();
        //     this.isShow = false;
        //     this.getMessageList();
        //   }else{
        //     this.$message.error("上链失败！");
        //     this.isShow = false;
        //   }
        // }).catch(err=>{
        //     this.$message.error(err);
        // })
        http(ServerAddress.resourceAddChain, data).then(result => {
          if (result.data.code == 0) {
            this.getList();
            this.isShow = false;
            this.getMessageList();
          } else {
            this.$message.error("上链失败！");
          }
        });
      }
      // this.createCatalogs();
    },
    // 中心化上链 
    createCatalogs() {
      let catalogParams = {
        catalog_type: this.dataInfo.type,
        catalog_address: this.dataInfo.id,
        catalog_name: this.dataInfo.name,
        catalog_source: JSON.parse(this.dataInfo.schemaJson).address,
        catalog_status: 1,
        schema_json:
          '{"inexp":[{"name":"sddf","required":"1","type":"0","note":"asdfasdf"},{"name":"","required":"","type":"","note":""}],"outexp":[],"incase":"","outcase":"","errcase":"","goodsType":["基础医学数据","疾病","脑血管病科","脑卒中科","出血性脑血管病"],"goodsTag":[],"description":"asdfasdf"}',
        issuer: JSON.parse(localStorage.getItem("userInfo")).address,
        default_times: 100
      };

      return http(ServerAddress.createCatalogs, catalogParams, "post", "chain")
    },
    //下链
    cancelChain() {
      let data = {
        ChainAddress: this.dataInfo.chainAddress,
        ChainStatus: 2,
        Id: this.dataInfo.id
      };
      http(ServerAddress.resourceAddChain, data).then(result => {
        // console.log(result);
        this.getList();
        this.isShow = false;
        this.getMessageList();
      });
    },
    //上架 下架
    // cancelChain() {
    //   let status;
    //   if (this.dataInfo.chainStatus === 1) {
    //     status = 0;
    //   } else if (this.dataInfo.chainStatus === 2) {
    //     status = 1;
    //   }
    //   let data = {
    //     issuer: "0xbe2d2599a40730b89058f39541da1bcfd31e6ea1",
    //     passwd: "1Ling1234",
    //     address: this.dataInfo.chainAddress,
    //     status
    //   };
    //   http(ServerAddress.dataOnOffShelf, data, "post", "chain").then(result => {
    //     console.log(result);
    //   });
    // },
    //分页
    throttleSearch(e, page) {
      this.perPage = e.pageSize;
      this.currentPage = e.pageNumber + 1;
      // if (this.isSearch) {
      //   this.searchFun();
      // } else {
      this.getList();
      // }
    }
    //搜索
    // searchFun() {
    //   this.isSearch = true;
    //   let data = {
    //     Issuer: JSON.parse(localStorage.getItem("userInfo")).address,
    //     searchType: 1,
    //     Page: this.currentPage,
    //     Size: this.perPage,
    //     Status: "(" + this.type.join(",") + ")",
    //     ResName: this.name,
    //     ResTypes: "(" + this.format.join(",") + ")"
    //   };
    //   if (this.date && this.date.length > 1) {
    //     data.StartDate = this.date[0] / 1000;
    //     data.EndDate = this.date[1] / 1000;
    //   }
    //   if (this.type.length === 0) {
    //     delete data.Status;
    //   }
    //   if (this.format.length === 0) {
    //     delete data.ResTypes;
    //   }
    //   http(ServerAddress.resourceSearch, data).then(result => {
    //     // console.log(result);
    //     if (result.data.code === 0) {
    //       this.total = result.data.data.count;
    //       this.perShow = this.total === 0 ? false : true;
    //       this.tableData = result.data.data.dataList;
    //     }
    //   });
    // }
  },
  filters: {
    checkType(value) {
      switch (value) {
        case 0:
          return "未提交审核";
        case 1:
          return "审核中";
        case 2:
          return "审核通过";
        case 3:
          return "审核驳回";
      }
    },
    chainType(value) {
      switch (value) {
        case 0:
          return "链下";
        case 1:
          return "链上";
        case 2:
          return "链下";
      }
    },
    shareType(value) {
      switch (value) {
        case 0:
          return "无条件共享";
        case 1:
          return "有条件共享";
        case 2:
          return "不予共享";
      }
    },
    updataTime(value) {
      switch (value) {
        case 0:
          return "实时";
        case 1:
          return "每日";
        case 2:
          return "每周";
        case 3:
          return "每月";
        case 4:
          return "每季度";
        case 5:
          return "每年";
      }
    },
    cataType(value) {
      switch (value) {
        case 0:
          return "结构化数据";
        case 1:
          return "非结构化数据";
        case 2:
          return "算法";
        case 3:
          return "算力";
      }
    }
  }
};
</script>

<style lang="less">
.issure-list {
  // padding: 0 40px;
  .title {
    width: 100%;
    background: #fff;
    padding: 24px 0 10px 40px;
    box-sizing: border-box;
  }
  .el-tabs__content {
    padding: 0 40px;
  }
  .el-tabs__header {
    background-color: #fff;
    padding: 0 90px;
    border-bottom: 1px solid #dee0e4;
  }
  .dialog-mask {
    .header-icon {
      background-color: #fff;
      height: 70px;
      width: 70px;
      position: absolute;
      border: 1px solid #eceef3;
      border-radius: 50%;
      left: 50%;
      transform: translate(-50%);
      top: 45px;
      i {
        display: inline-block;
        width: 70px;
        height: 70px;
        background: url("../../assets/imgs/onchain/check.svg");
        border-radius: 50%;
        background-repeat: no-repeat;
        background-position: 23px 16px;
      }
    }
    .el-button {
      width: 100px;
      height: 40px;
      font-size: 16px;
    }
    .mask-header {
      background-color: #2159d6;
      height: 80px;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
    div:nth-child(-n + 2) {
      width: 170px;
      margin: 80px auto 30px;
      font-size: 24px;
    }
    .el-button + .el-button {
      margin-left: 160px;
    }
  }
  .ul-info-btm {
    border-bottom: 1px solid #dee0e4;
  }
  .ul-info {
    li {
      border: 1px solid #dee0e4;
      border-bottom: none;
    }
  }
  .operate-btns {
    margin-top: -20px;
    div {
      // float: left;
      border: 1px solid #2159d6;
      color: #2159d6;
      padding: 5px 0px;
      cursor: pointer;
      font-size: 12px;
      width: 100px;
      text-align: center;
      border-radius: 4px;
      &:last-child {
        background: #2159d6;
        color: #fff;
      }
    }
  }
  .cata-tag {
    font-size: 12px;
    color: #fff;
    background: #55acee;
    border-radius: 2px;
    padding: 0 8px;
    display: inline-block;
    height: 20px;
    line-height: 20px;
  }
  .cata-tag.arithmetic {
    background: #26b275;
  }
  .cata-tag.hashrate {
    background: #d88b61;
  }
  .tabs-list {
    .el-tabs__nav {
      height: 80px;
      line-height: 80px;
      .el-tabs__active-bar {
        height: 4px;
      }
      .el-tabs__item {
        font-size: 18px;
        color: #333333;
        font-weight: 600;
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
}
.fs-input{
  width:200px;
}
</style>
