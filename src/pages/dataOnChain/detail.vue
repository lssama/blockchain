<template>
  <div class="directory-detail">
    <div class="detail-page-title clear">
      <el-breadcrumb separator="/" class="fl">
        <el-breadcrumb-item :to="{ path: `/directoryManagement` }">我的资源</el-breadcrumb-item>
        <el-breadcrumb-item>资源详情</el-breadcrumb-item>
      </el-breadcrumb>
      <el-button class="huge-button fr f-size-16" type="primary" @click="cancelCheck" v-show="form.status === 1">撤回审核</el-button>
      <el-button class="huge-button fr f-size-16" type="primary" @click="onChain" v-show="form.status === 2 && form.chainStatus !== 1">上链</el-button>
      <el-button class="huge-button fr f-size-16" type="primary" @click="cancelChain" v-show="form.status === 2 && form.chainStatus === 1">下链</el-button>
      <el-button class="huge-button fr f-size-16" type="primary" @click="goEdit" v-show="form.status === 3">修改数据</el-button>
    </div>
    <div class="middle-page mb40">
      <h4 class="f-size-20 mb22 ml50 bline">基本信息</h4>
      <div class="line mb20" style="height:3px"></div>
      <el-form :model="form" label-width="150px" class="detail-form" label-position="left" ref="form" size="medium">
        <el-form-item label="信息资源名称:">
          <h4>{{form.name}}</h4>
        </el-form-item>
        <!-- <div v-if="dataType==='1'" class="line"></div> -->
        <el-form-item v-if="dataType==='1'" label="信息资源代码:">
          <span>{{form.cataCode}}</span>
        </el-form-item>
        <div class="line mt20"></div>
        <el-form-item v-if="form.type===1" v-for="(item, index) in cata" :key="index" label-width="0">
          <div >
            <el-form-item :label="`关联资源${index + 1}:`">
              <h4>{{item.name}}</h4>
              <h4 v-if="item.name.length == 0">无</h4>
            </el-form-item>
            <el-form-item :label="`关联资源代码${index + 1}:`">
                <span>{{item.code}}</span>
								<span v-if="item.code.length == 0">无</span>
            </el-form-item>
            <div class="line mt20 mb20"></div>
          </div>
        </el-form-item>
        <el-form-item label="发布机构:" class="clear">
          <h4 class="fl w500">{{form.providerName}}</h4>
          <div class="fl" v-show="form.type !== 3">
            <span class="color-999">信息提供方式:</span>
            <span class="ml30 fill-blue">{{form.resourceFormat | resourceFormat}}</span>
          </div>
        </el-form-item>

        <el-form-item label="提供方地址:">
          <span>{{form.issuer}}</span>
        </el-form-item>
        <div class="mt20"></div>
        <!-- <div class="line" v-if="dataType==='1'"></div> -->
        <el-form-item label="机构代码:">
          <span>{{form.providerCode}}</span>
        </el-form-item>
        <el-form-item v-if="dataType==='1'" label="所属类目:">
          <span>{{form.categoryStr}}</span>
        </el-form-item>
        <div class="line mt20 mb20"></div>
        <!-- <div v-if="dataType!='3'" class="line mt20"></div> -->

        <!-- <div class="line" v-if="dataType==='1'"></div> -->
        <el-form-item class="clear" v-if="dataType==='1'" label="共享方式:">
          <h4 class="fl w500">在线查询</h4>
          <div class="fl clear" v-if="dataType==='1'">
            <span class="color-999 fl">共享类型:</span>
            <h4 class="ml30 fl">{{form.shareType === 0 ? '无条件共享' : form.shareType === 1 ? '有条件共享' : '不予共享'}}</h4>
          </div>
        </el-form-item>
        <!-- <div class="line" v-if="dataType==='1'"></div> -->
        <el-form-item label="共享条件和范围:" v-if="dataType==='1'">
          <span>{{form.shareCondition}}</span>
        </el-form-item>
        <div class="line mt20 mb20" v-if="dataType==='1'"></div>
        <el-form-item label="是否向社会开放:" v-if="dataType==='1'">
          <h4>{{form.openCommunity | openCommunity}}</h4>
        </el-form-item>
        <!-- <div class="line" v-if="dataType==='1'"></div> -->
        <el-form-item label="开放条件:" v-if="dataType==='1'">
          <span v-if="form.openCommunity === 1">{{form.openCondition}}</span>
          <span v-else>无</span>
        </el-form-item>
        <div class="line mt20 mb20" v-if="dataType==='1'"></div>

        <!-- 信息项 -->
        <el-form-item label="信息项:" v-if="dataType==='1'&&form.resourceFormat === 1">
        </el-form-item>
        <el-table :data="infoForm" class="tb-edit" header-cell-class-name="table-head" cell-class-name="table-cell" style="width: 100%" border v-if="dataType==='1'&&form.resourceFormat === 1">
          <el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
          <el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
          <el-table-column align="center" label="数据类型">
            <template slot-scope="scope">
              <span>{{scope.row.type | sqlType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="数据长度" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.dataLength}}</span>
            </template>
          </el-table-column>
          <el-table-column label="共享类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.shareType | sqlShareType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="是否开放" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.openCommunity === '0' ? '否' : '是'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="line mt20 mb20" v-if="dataType==='1'&&form.resourceFormat === 1"></div>

        <el-form-item label="关键词:">
          <span class="key-word"  v-if="form.keywords !== ''" v-for="(item, index) in form.keywords.split(',')" :key="index">{{item}}</span>
          <h4 v-if="form.keywords&&form.keywords.length==0 || !form.keywords">无</h4>
        </el-form-item>
        <!-- <div class="line"></div> -->
        <el-form-item label="信息资源摘要:">
          <span>{{form.resourceDescription}}</span>
        </el-form-item>
        <div class="line mt20 mb20" v-if="dataType==='1'"></div>
        <el-form-item label="更新周期:" v-if="dataType==='1'">
          <h4>{{form.updatePeriod | updatePeriod}}</h4>
        </el-form-item>
        <div class="line mt20 mb20"></div>
        <el-form-item label="创建时间:">
          <span>{{form.createTime | formatDate}}</span>
        </el-form-item>
        <div class="line mt20 mb20"></div>
        <!-- <el-form-item label="上链时间:" v-if="form.chainTime !== 0&&dataType==='1'">
          <span>{{form.chainTime | formatDate}}</span>
        </el-form-item>
        <div class="line mt20 mb20" v-if="form.chainTime !== 0&&dataType==='1'"></div> -->
        <el-form-item label="链上地址:">
          <span>{{form.chainAddress}}</span>
        </el-form-item>
      </el-form>

    </div>
    <div class="middle-page mt87 mt-0" v-if="dataType!=='3'">
      <h4 class="f-size-20 mb30 ml50 bline">接口/查询信息</h4>
      <div class="line" style="height:3px"></div>
      <el-form :model="form" label-width="150px" v-if="form.resourceFormat === 0" class="detail-form" label-position="left" ref="form" size="medium">
        <el-form-item label="信息资源地址:">
          <span>{{apiForm.address}}</span>
        </el-form-item>
        <div class="line"></div>
        <el-form-item label="返回格式:">
          <span>{{apiForm.responseFormat == 0 ? 'JSON' : ''}}</span>
        </el-form-item>
        <div class="line"></div>
        <el-form-item label="请求方式:">
          <span v-if="apiForm.requestMethod">{{apiForm.requestMethod[0]}}</span>
        </el-form-item>
        <div class="line"></div>
      </el-form>
      <el-form :model="form" label-width="150px" v-if="form.resourceFormat === 1" class="detail-form" label-position="left" ref="form" size="medium">
        <el-form-item label="信息资源地址:">
          <span>{{apiForm.addressFirst}}/{{apiForm.addressSecond}}</span>
        </el-form-item>
        <div class="line"></div>
        <el-form-item label="是否加密:">
          <span>{{apiForm.isEncrypt == 0 ? '否' : '是'}}</span>
        </el-form-item>
        <div class="line"></div>
      </el-form>
      <div class="interface-detail">
        <el-form class="detail-form">
          <el-form-item label="请求参数:"></el-form-item>
          <el-table :data="requestForm" border header-cell-class-name="table-head" cell-class-name="table-cell" v-if="form.resourceFormat === 0">
            <el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
            <el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
            <el-table-column align="center" label="类型">
              <template slot-scope="scope">
                <span>{{scope.row.type | type}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="required" label="是否必填">
              <template slot-scope="scope">
                <span>{{scope.row.required | required}}</span>
              </template>
            </el-table-column>
            <el-table-column align="left" prop="note" label="描述"></el-table-column>
          </el-table>
          <div class="sqldes" v-if="form.resourceFormat === 1">{{apiForm.sqlStr}}</div>
          <!-- <el-table :data="requestForm" border header-cell-class-name="table-head" cell-class-name="table-cell" v-if="form.resourceFormat === 1">
              <el-table-column align="center" prop="cnName" label="中文名称"></el-table-column>
              <el-table-column align="center" prop="enName" label="英文名称"></el-table-column>
              <el-table-column align="center" label="数据类型">
                <template slot-scope="scope">
                </template>
              </el-table-column>
              <el-table-column align="center" prop="required" label="长度">
                <template slot-scope="scope">
                </template>
              </el-table-column>
            </el-table> -->
          <el-form-item style="margin-top:40px !important" label="请求示例:"></el-form-item>
          <div class="case-box">
            <el-input :rows="10" type="textarea" disabled v-model="apiForm.input"></el-input>
            <!-- {{form.input}} -->
          </div>
          <el-form-item style="margin-top:40px !important" label="正常返回示例:"></el-form-item>
          <div class="case-box">
            <el-input :rows="10" type="textarea" disabled v-model="apiForm.output"></el-input>
            <!-- {{form.output}} -->
          </div>
          <el-form-item style="margin-top:40px !important" label="失败返回示例:"></el-form-item>
          <div class="case-box">
            <el-input :rows="10" type="textarea" disabled v-model="apiForm.errput"></el-input>
            <!-- {{form.errput}} -->
          </div>
          <el-form-item style="margin-top:40px !important" label="审核意见"></el-form-item>
          <el-form-item label-width="0">
            <el-input :rows="6" type="textarea" disabled v-model="form.auditOpinion" class="check-idea"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="ta-c">
      <el-button class="huge-button mt16 mr32 f-size-16" type="primary" @click="cancelCheck" v-if="form.status === 1">撤回审核</el-button>
      <el-button class="huge-button mt16 mr32 f-size-16" type="primary" @click="onChain" v-if="form.status === 2 && form.chainStatus !== 1">上链</el-button>
      <el-button class="huge-button mt16 mr32 f-size-16" type="primary" @click="cancelChain" v-if="form.status === 2 && form.chainStatus === 1">下链</el-button>
      <el-button class="huge-button mt12 mr32 f-size-16" type="primary" @click="goEdit" v-if="form.status === 3">修改数据</el-button>
    </div>
  </div>
</template>

<script>
import ServerAddress from "../../api/serverAddress.js";
import http from "../../api/http.js";
import { mapActions } from "vuex";
import moment from "moment";
export default {
  name: "detail",
  data() {
    return {
      id: this.$route.query.id,
      dataType: String(this.$route.query.type),
      form: {
        keywords: ""
      },
      apiForm: {},
      requestForm: [],
      cata: [],
      publicParam: "1",
      requestParam: "1",
      type: "",
      incase: "1",
      outcase: "1",
      errcase: "1",
      data: {},
      infoForm: []
    };
  },
  methods: {
    ...mapActions(["getMessageList"]),
    //获取目录信息
    async getData() {
      const params = {
        id: this.$route.query.id
      };
      let response;
      try {
        response = await http(ServerAddress.resourceDetail, params, "get");
        const {
          data: { data = [] }
        } = response;
        this.form = data;
        this.apiForm = JSON.parse(data.schemaJson);
        this.requestForm = this.apiForm.requestForm;
        this.cata = JSON.parse(data.relateCataCode);
        this.infoForm = this.apiForm.infoForm;
      } catch (e) {
        console.log(e);
      }
    },
    //撤回审核
    cancelCheck() {
      let data = {
        id: this.form.id,
        Status: 0
      };
      http(ServerAddress.resourceStatus, data).then(result => {
        // console.log(result);
        if (result.data.code === 0) {
          this.$router.push("/directoryManagement");
        } else {
          this.$message.error("发生了错误。。。");
        }
        this.getMessageList();
      });
    },
    //上链
    onChain() {
      if (this.form.chainStatus === 0) {
        let dateLimit = Math.round((new Date().getTime() + 31536000000) / 1000);
        let data = {
          Id: this.form.id,
          DataName: this.form.name,
          dataSource: JSON.parse(this.form.schemaJson).address,
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
        Promise.all([this.createCatalogs(),http(ServerAddress.dataAdd, data, "post", "chain")]).then(([res1,res2])=>{
          if(res1.data.code == 200 && res2.data.code ==200){
            this.$router.push("/directoryManagement");
          }else{
            this.$message.error("发生了错误。。。");
          }
          this.getMessageList();
        })
        // http(ServerAddress.dataAdd, data, "post", "chain").then(result => {
        //   // console.log(result);
        //   if (result.data.code === 200) {
        //     this.$router.push("/directoryManagement");
        //   } else {
        //     this.$message.error("发生了错误。。。");
        //   }
        //   this.getMessageList();
        // });
      } else if (this.form.chainStatus === 2) {
        let data = {
          ChainAddress: this.form.chainAddress,
          ChainStatus: 1,
          Id: this.form.id
        };
        // Promise.all([this.createCatalogs(),http(ServerAddress.resourceAddChain, data)]).then(([res1,res2])=>{
        //   if(res1.data.code == 200 && res2.data.code == 0){
        //     this.$router.push("/directoryManagement");
        //   }else{
        //     this.$message.error("发生了错误。。。");
        //   }
        //   this.getMessageList();
        // })
        http(ServerAddress.resourceAddChain, data).then(result => {
          if (result.data.code === 0) {
            this.$router.push("/directoryManagement");
          } else {
            this.$message.error("发生了错误。。。");
          }
          this.getMessageList();
        });
      }
    },
    // 中心化上链
    createCatalogs() {
      let catalogParams = {
        catalog_type: this.form.type,
        catalog_address: this.form.id,
        catalog_name: this.form.name,
        catalog_source: JSON.parse(this.form.schemaJson).address,
        catalog_status: 1,
        schema_json:
          '{"inexp":[{"name":"sddf","required":"1","type":"0","note":"asdfasdf"},{"name":"","required":"","type":"","note":""}],"outexp":[],"incase":"","outcase":"","errcase":"","goodsType":["基础医学数据","疾病","脑血管病科","脑卒中科","出血性脑血管病"],"goodsTag":[],"description":"asdfasdf"}',
        issuer: JSON.parse(localStorage.getItem("userInfo")).address,
        default_times: 100
      };

      return http(ServerAddress.createCatalogs, catalogParams, "post", "chain")
    },
    //下架
    cancelChain() {
      let data = {
        ChainAddress: this.form.chainAddress,
        ChainStatus: 2,
        Id: this.form.id
      };
      http(ServerAddress.resourceAddChain, data).then(result => {
        // console.log(result);
        if (result.data.code === 0) {
          this.$router.push("/directoryManagement");
        }
        this.getMessageList();
      });
    },
    //修改再提交
    goEdit() {
      this.$router.push({
        path: "/directoryOnChain",
        query: {
          id: this.form.id
        }
      });
    }
  },
  created() {
    this.getData();
  },
  components: {},
  filters: {
    type(value) {
      switch (value) {
        case "0":
          return "string";
        case "1":
          return "int";
        case "2":
          return "float";
        default:
          return "";
      }
    },
    required(value) {
      switch (value) {
        case "0":
          return "是";
        case "1":
          return "否";
        default:
          return "";
      }
    },
    resourceFormat(value) {
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
    },
    status(value) {
      switch (value) {
        case 0:
          return "未提交审核";
        case 1:
          return "审核中";
        case 2:
          return "审核通过";
        case 3:
          return "审核驳回";
        case 4:
          return "下架";
      }
    },
    updatePeriod(value) {
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
    formatDate(time) {
      if (time) {
        return moment(time * 1000).format("YYYY-M-D H:mm:ss");
      }
    },
    openCommunity(value) {
      switch (value) {
        case 0:
          return "否";
        case 1:
          return "是";
      }
    },
    sqlType(value) {
      switch (value) {
        case "0":
          return "字符型C";
        case "1":
          return "数值型N";
        case "2":
          return "货币型Y";
        case "3":
          return "日期型D";
        case "4":
          return "日期时间型T";
        case "5":
          return "逻辑型L";
        case "6":
          return "备注型M";
        case "7":
          return "通用型G";
        case "8":
          return "双精度型B";
        case "9":
          return "整型I";
        case "10":
          return "浮点型F";
      }
    },
    sqlShareType(value) {
      switch (value) {
        case "0":
          return "无条件共享";
        case "1":
          return "有条件共享";
        case "2":
          return "不予共享";
      }
    }
  }
};
</script>

<style lang="less">
.directory-detail {
  box-sizing: border-box;
  padding-bottom: 40px;
  .detail-page-title {
    width: 100%;
    height: 104px;
    box-sizing: border-box;
    padding: 24px 40px 0;
    background-color: #fff;
    box-shadow: 0 1px 1px #ddd;
  }
  .middle-page {
    margin: 25px 40px;
    padding: 30px 0;
    box-sizing: border-box;
    background-color: #fff;
    border-radius: 2px;

    .interface-detail {
      // margin-left: 26px;
      font-size: 14px;

      .interface-detail-title {
        margin-top: 45px;
        color: #333;
      }
      .interface-detail-des {
        margin-top: 30px;
        color: #666;
      }
    }
  }
  .huge-button {
    width: 145px;
    height: 54px;
    border-radius: 4px;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    cursor: text;
  }
  .check-idea {
    .el-textarea__inner {
      font-size: 16px;
      color: blue;
    }
  }
  .detail-form {
    padding: 0 50px;
  }
  .bline::before {
    content: "";
    display: inline-block;
    width: 3px;
    height: 27px;
    background: #2159d6;
    vertical-align: middle;
    margin-right: 10px;
  }
  .el-form-item--medium .el-form-item__content {
    /* color: #595959; */
  }
  .el-form-item--small .el-form-item__label {
    color: #999;
  }
  .el-table thead {
    color: #333333;
  }
  .el-table th.is-leaf {
    background: #fafafa;
  }
  .fill-blue {
    display: inline-block;
    padding: 0px 20px;
    height: 28px;
    line-height: 28px;
    background-color: #2159d6;
    color: #fff;
    border-radius: 4px;
  }
  .key-word {
    display: inline-block;
    padding: 0 16px;
    background: #ffffff;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    margin-right: 16px;
  }
  .sqldes {
    margin: 15px 0 20px;
  }
}
</style>