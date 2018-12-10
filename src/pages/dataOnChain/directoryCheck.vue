<template>
  <div class="directory-audit">
    <div class="detail-page-title clear">
      <el-breadcrumb separator="/" class="fl mt12">
        <el-breadcrumb-item :to="{ path: `/directoryCheckList` }">上链审核</el-breadcrumb-item>
        <el-breadcrumb-item>目录审核</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <div class="fl f-size-18 color-grey">
        <span @click="goBack" class="cur-p">
          <svg class="icon f-size-18">
            <use xlink:href="#icon-system-backnew"></use>
          </svg>
          <span>返回上一页</span>
        </span>
      </div> -->
    </div>
    <div class="middle-page">
      <el-form :model="form" label-width="120px" class="detail-form" label-position="left" ref="form" size="larger">
        <el-form-item label="信息资源名称:">
          <h4>{{form.name}}</h4>
        </el-form-item>
        <div class="line"></div>
        <el-form-item v-show="form.type === 1" label="所属类目:">
          <span>{{form.categoryStr}}</span>
        </el-form-item>
        <el-form-item v-show="form.type === 1" label="资源类型:">
          <div class="fl w300">{{form.cataType | cataType}}</div>
          <div class="fl w300" v-show="form.type === 1">
            <span class="color-999">是否涉密:</span>
            <span class="ml30">{{form.isSecret | isSecret}}</span>
          </div>
          <div class="fl" v-show="form.type === 1">
            <span class="color-999">开放类型:</span>
            <span class="ml30">{{form.openType | openType}}</span>
          </div>
        </el-form-item>
        <div class="line mt30" v-show="form.type === 1"></div>
        <el-form-item v-show="form.type !== 3" label="信息提供方式:">
          <h4 class="fl w300">{{form.resourceFormat | resourceFormat}}</h4>
          <div class="fl" v-show="form.type === 1">
            <span class="color-999">信息资源代码:</span>
            <span class="ml30 color-blue">{{form.cataCode}}</span>
          </div>
        </el-form-item>
        <el-form-item v-show="form.type === 1" v-for="(item, index) in cata" :key="index" label-width="0">
          <el-form-item :label="`关联资源${index + 1}:`">
            <span v-if="item.name.length > 0">
              <span>{{item.name}}</span>
              <span class="ml30 color-blue">{{item.code}}</span>
            </span>
            <span v-else>无</span>
          </el-form-item>
          <div class="line mt30" v-show="form.type === 1"></div>
        </el-form-item>
        <el-form-item v-show="form.type === 1" label="更新周期:">
          <div class="fl w300">{{form.updatePeriod | updatePeriod}}</div>
          <div class="fl" v-show="form.type === 1">
            <span class="color-999">共享方式:</span>
            <span class="ml30">在线查询</span>
          </div>
        </el-form-item>
        <div class="line" v-show="form.type === 1"></div>
        <el-form-item label="申请机构:">
          <div class="fl w300">{{form.providerName}}</div>
          <div class="fl" v-show="form.type === 1">
            <span class="color-999">提交日期:</span>
            <span class="ml30">{{form.createTime | formatDate}}</span>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="middle-page">
      <el-form :model="form" label-width="120px" class="detail-form" label-position="left" ref="form" size="larger">
        <el-form-item label="审核意见:">
          <div v-if="form.status === 1">
            <el-radio v-model="isPass" label="2">通过</el-radio>
            <el-radio v-model="isPass" label="3">驳回</el-radio>
          </div>
          <span v-else>{{form.status | status}}</span>
        </el-form-item>
        <el-form-item label-width="0">
          <el-input class="mt20" type="textarea" :rows="8" :placeholder="form.status === 1 ? '请输入审核意见' : '无'" v-model="opinion" :disabled="form.status !== 1">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="ta-c mt32" v-if="form.status === 1">
        <el-button class="mr32" @click="goBack">返回</el-button>
        <el-button type="primary" @click="commitAudit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import http from "../../api/http";
import ServerAddress from "../../api/serverAddress";
import moment from "moment";
import { mapActions } from "vuex";
export default {
  name: "directoryAudit",
  data() {
    return {
      form: {},
      isPass: "2",
      opinion: "",
      cata: []
    };
  },
  methods: {
    ...mapActions(["getMessageList"]),
    goBack() {
      this.$router.go(-1);
    },
    getDetails() {
      let data = {
        id: this.$route.params.id
      };
      http(ServerAddress.resourceDetail, data, "get").then(result => {
        this.form = result.data.data;
        this.cata = JSON.parse(result.data.data.relateCataCode);
        if (this.form.status === 1) {
          this.opinion = "";
        } else {
          this.opinion = this.form.auditOpinion;
        }
      });
    },
    //管理员审核
    commitAudit() {
      let data = {
        Auditor: "abc",
        Id: Number(this.$route.params.id),
        Opinion: this.opinion,
        Status: Number(this.isPass)
      };
      // console.log(data)
      http(ServerAddress.resourceAudit, data).then(result => {
        if (result.data.code === 0) {
          this.$router.push("/directoryCheckList");
        }
        this.getMessageList();
      });
    }
  },
  created() {
    this.getDetails();
  },
  filters: {
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
    },
    isSecret(value) {
      switch (value) {
        case 0:
          return "涉密信息";
        case 1:
          return "非涉密信息";
      }
    },
    openType(value) {
      switch (value) {
        case 0:
          return "无条件开放";
        case 1:
          return "已申请开放";
        case 2:
          return "依法不予开放";
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
    cataPermission(value) {
      switch (value) {
        case 0:
          return "在线查询";
        case 1:
          return "接口访问";
        case 2:
          return "下载";
      }
    },
    status(value) {
      switch (value) {
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
  }
};
</script>

<style lang="less">
.directory-audit {
  box-sizing: border-box;

  .detail-page-title {
    width: 100%;
    height: 60px;
    line-height: 80px;
    box-sizing: border-box;
    padding: 0 40px;
    background-color: #fff;
    box-shadow: 0 1px 1px #ddd;
  }
  .middle-page {
    margin: 30px 40px;
    padding: 20px 40px;
    box-sizing: border-box;
    background-color: #fff;

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
    width: 160px;
    height: 60px;
    border-radius: 2px;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    background-color: #fff;
    cursor: text;
  }
  .ta-c {
    .el-button {
      width: 160px;
      height: 60px;
      font-size: 16px;
    }
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #000;
  }
}
</style>