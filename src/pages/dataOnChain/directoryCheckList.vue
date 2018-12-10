<template>
  <div class="directory-audit-list">
    <h4 class="title f-size-20">资源审核</h4>
    <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-list">
      <el-tab-pane label="未审核" name="0">
        <el-form size="larger" class="tab-search">
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <el-form-item label="">
                <el-input v-model="name" class="fl search-inner-input fs-width" placeholder="输入信息资源名称"></el-input>
                <el-button type="primary" class="fl search-btn" @click="getList">检索</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="按发布日期时间段：">
                <!-- <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" 
                format="yyyy 年 MM 月 dd 日" value-format="timestamp" @change="changeDate">
                </el-date-picker> -->
                <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" @change="changeDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="tab-table">
          <el-table :data="tableData" header-cell-class-name="table-head" border>
            <el-table-column align="center" prop="name" label="信息资源名称">
            </el-table-column>
            <el-table-column align="center" prop="providerName" label="申请机构">
            </el-table-column>
            <el-table-column align="center" label="申请日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.status | type}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="audit(scope.row.id)" type="text">审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-tab-pane>
      <el-tab-pane label="已审核" name="1">
        <el-form class="tab-search" size="larger">
          <el-row type="flex" justify="space-between">
            <el-col :span="8">
              <el-input v-model="name" class="fl search-inner-input fs-width" placeholder="输入信息资源名称"></el-input>
              <el-button type="primary" class="fl search-btn" @click="getList">检索</el-button>
            </el-col>
            <el-col :span="8">
              <el-form-item label="按发布日期时间段：">
                <el-date-picker v-model="date" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy 年 MM 月 dd 日" @change="changeDate">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <!-- <el-col :span="2">
            <el-button type="primary" class="ml20" @click="getList" size="large">检索</el-button>
          </el-col> -->
        </el-form>
        <div class="tab-table">
          <el-table :data="tableData" header-cell-class-name="table-head" border>
            <el-table-column align="center" prop="name" label="信息资源名称">
            </el-table-column>
            <el-table-column align="center" prop="providerName" label="申请机构">
            </el-table-column>
            <el-table-column align="center" label="申请日期">
              <template slot-scope="scope">
                <span>{{scope.row.createTime | formatDate}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="状态">
              <template slot-scope="scope">
                <span>{{scope.row.status | type}}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button @click="audit(scope.row.id)" type="text">详情</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>

      </el-tab-pane>
    </el-tabs>
    <Pagination :totalPageSize="total" :noSelectPage="false" :perPage="perPage" :perShow="perShow" :currentPage="currentPage" @currentChange="throttleSearch($event, 'page')" />
  </div>
</template>

<script>
import http from "../../api/http";
import Pagination from "../common/pagination";
import ServerAddress from "../../api/serverAddress";
import moment from "moment";
export default {
  components: {
    Pagination
  },
  name: "directoryAuditList",
  data() {
    return {
      date: [],
      name: "",
      activeName: "0",
      tableData: [],
      tableData2: [],
      isSearch: false,
      total: 0,
      perPage: 15, //每页显示条目个数
      perShow: false, //分页是否显示
      currentPage: 1, //当前页
      StartDate: 0,
      EndDate: 0
    };
  },
  methods: {
    audit(id) {
      this.$router.push(`/directoryCheck/${id}`);
    },
    handleClick() {
      this.getList();
    },
    getList() {
      let data = {
        TabType: Number(this.activeName),
        Page: this.currentPage,
        Size: this.perPage,
        DataName: this.name
      };
      if (this.date && this.date.length > 1) {
        data.StartDate = this.StartDate / 1000;
        data.EndDate = this.EndDate / 1000;
      }
      http(ServerAddress.resourceAuditList, data).then(result => {
        // console.log(result);
        this.total = result.data.data.count;
        this.perShow = this.total === 0 ? false : true;
        this.tableData = result.data.data.dataList;
        this.tableData2 = result.data.data.dataList;
      });
    },
    getDetail(id) {
      this.$router.push(`detailPage/${id}`);
    },
    throttleSearch(e, page) {
      this.perPage = e.pageSize;
      this.currentPage = e.pageNumber + 1;
      if (this.isSearch) {
        this.searchFun();
      } else {
        this.getList();
      }
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
      this.getList()
    }
    //搜索
    // searchFun() {
    //   this.isSearch = true;
    //   let data = {
    //     Issuer: JSON.parse(localStorage.getItem("userInfo")).address,
    //     searchType: this.activeName === "0" ? 2 : 3,
    //     Page: this.currentPage,
    //     Size: this.perPage,
    //     ResName: this.name
    //   };
    //   if (this.date && this.date.length > 1) {
    //     data.StartDate = this.date[0] / 1000;
    //     data.EndDate = this.date[1] / 1000;
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
  mounted() {
    this.getList();
  },
  filters: {
    type(value) {
      switch (value) {
        case 1:
          return "待审核";
        case 2:
          return "通过";
        case 3:
          return "驳回";
      }
    },
    formatDate(time) {
      if (time) {
        return moment(time * 1000).format("YYYY-M-D H:mm:ss");
      }
    }
  },
  created() {}
};
</script>

<style lang="less">
.directory-audit-list {
  .title {
    width: 100%;
    background: #fff;
    padding: 24px 0 10px 40px;
    box-sizing: border-box;
  }
  // padding: 0 40px;
  box-sizing: border-box;
  // .el-tabs__content {
  //   padding: 0 40px;
  // }
  .el-tabs__header {
    background-color: #fff;
    // padding: 0 40px;
    margin-bottom: 0;
    padding-left: 90px;
    border-bottom: 1px solid #dee0e4;
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
    .el-table td,
    .el-table th.is-leaf {
      border-right: 1px solid transparent;
    }
    .el-table th,
    .el-table tr {
      height: 60px;
    }
  }
  .tab-search {
    // width: 100%;
    padding: 30px 45px;
    background: #fff;
  }
  .tab-table {
    margin: 40px;
  }
  .el-table__header-wrapper {
    font-size: 14px;
  }
  .el-table__row {
    color: #333;
  }
}
.fs-width{
  width:200px;
}
</style>