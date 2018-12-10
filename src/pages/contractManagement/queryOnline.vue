<template>
  <div class="search-online">
    <div class="top-card">
      <div class="pre-page">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item class="before-link" :to="{ path: '/myContract' }">我的合约</el-breadcrumb-item>
            <el-breadcrumb-item class="current-page">合约执行</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <div class="top-params">
          <div class="top-title">输入请求参数</div>
            <el-form ref="form" class="list-form clear" label-width="150px">
              <div class="clear form-box">
                <el-form-item v-for="(item, index) in inputParams" :required="item.required == 0 ? true:false" :label="item.cnName + ':'" :key="index" class="fl">
                  <el-input v-model="value[index]" class="search-item"></el-input>
                </el-form-item>
              </div>
              <el-button type="primary" class="query-btn fr" @click="getResult">执行</el-button>
            </el-form>
      </div>
    </div>
    <div class="content ">
        <div class="top-title">请求结果</div>
          <div class="response-box" v-loading="loading">
            <div v-show="resolve != ''">
              <vue-json-pretty
                :path="'res'"
                :data="resolve">
              </vue-json-pretty>  
            </div>
          </div>
    </div>
  </div>
</template>
<script>
  import http from "../../api/http.js";
  import ServerAddress from "../../api/serverAddress.js";
  import VueJsonPretty from 'vue-json-pretty'
  export default {
    components: {
      VueJsonPretty
    },
    data() {
      return {
				loading: false,
        result: '',
        inputParams: '',
        value: [],
        resolve: '',
        countTimes: 0,
        timer: '',
        adrKey: '',
        adrVal: '',
        requestAdr: '',
        resourceFormat: ""
      }
    },
    methods: {
      getResult(){
        for(let key in this.inputParams){
          if(this.inputParams[key].required == '0'&&!this.value[key]){
            this.$message.error('请输入必填参数');
            return false;
          }
        }
        let request = {};
        let result = "";
        if (this.resourceFormat === '0'){
          for (let i = 0; i < this.inputParams.length; i++) {
            const key = this.inputParams[i].enName;
            request[key] = this.value[i];
          }
        } else if (this.resourceFormat === '1'){
          request = {
            Sqlid: Number(this.adrVal),
            QueryParam: ''
          }
          for (let i = 0; i < this.inputParams.length; i++) {
            const key = this.inputParams[i].enName;
            request.QueryParam += `${key}=${this.value[i]}&`;
          }
          request.QueryParam = request.QueryParam.slice(0, request.QueryParam.length-1);
        }
        // console.log(request);
        result = JSON.stringify(request);
        
        
        
        const params ={
          address: this.$route.query.address,
          // address: requestAdr,
          purchaser: this.$route.query.issuer,
          paramJson: result
        }
        
        
        this.loading = true;
        this.resolve = '';

        if(this.$route.query.engineType == 1){
          params.paramJson = params.paramJson.replace(/"/g,'\\"')
          // console.log(params);
          // 执行中心化合约
          http(ServerAddress.execcontract,params,"post","chain").then(result=>{
            if (result.data.code === 200) {
              this.countTimes = 0;
              this.excuteResult(false, this.$route.query.address);
            } else {
              this.$message.error('获取数据失败');
            }
          })
        }else{
          http(ServerAddress.orderExec, params, 'post', 'chain').then(result => {
            if (result.data.code === 200) {
              this.countTimes = 0;
              this.excuteResult(false, this.$route.query.address);
            } else {
              this.$message.error('获取数据失败');
            }
          })
        }

      },
      excuteResult(finish, data) {
        if (!finish) {
          this.countTimes++;
          if (this.countTimes>=20) {
            this.$message.error('请求超时');
            this.loading = false;
            return false;
          }
          const params = {
            address: data,
            engine_type:this.$route.query.engineType
          }
          http(ServerAddress.getExecResult, params, 'post', 'chain').then(result => {
            const { data } = result.data;
            if (!data.result) {
              this.timer = setTimeout(() => {
                this.excuteResult(data.result, this.$route.query.address);
              }, 2000)
            } else {
              this.loading = false;
              this.resolve = data.data
              const jsonArr = JSON.parse(data.data);
              const jsonParseResult = [];
              this._.forEach(jsonArr, json => {
                this.judgeType(json);
                jsonParseResult.push(this.jsonParse);
              })
              this.resolve = jsonParseResult;
            }
          })
        }
      },
      judgeType(json) {
        if (typeof json === 'string') {
          const obj = JSON.parse(json);
          this.judgeType(obj);
        } else {
          this.jsonParse = json;
          return;
        }
      },
      getApi(){
        const params ={
          id: this.$route.query.id
        }
        http(ServerAddress.getApi, params, 'get').then(result => {
          if (result.data.code === 0) {
            // console.log(JSON.parse(result.data.data.schemaJson));
            let resultForm = JSON.parse(result.data.data.schemaJson).requestForm;
            let arrForm = [];
            for(let key in resultForm){
              if(resultForm[key].adrKey){
                this.adrKey = resultForm[key].adrKey;
                this.adrVal = resultForm[key].adrVal;
              }else{
                arrForm.push(resultForm[key]);
              }
            }
            this.inputParams = arrForm;
            this.requestAdr = JSON.parse(result.data.data.schemaJson).address;
            this.resourceFormat = result.data.data.resourceFormat;
            // this.inputParams = JSON.parse(result.data.data).requestForm;
          } else {
            this.$message.error('获取数据失败');
          }
        })
      },
      prePage(){
        this.$router.go(-1);
      }
    },
    mounted(){
      this.getApi();
    },
    beforeDestroy() {
        if(this.timer) { //如果定时器还在运行 或者直接关闭，不用判断
          clearTimeout(this.timer); //关闭
        }
    }
  }
</script>
<style lang="less">
  .search-online{
    padding-bottom: 100px;
    .top-card{
      background-color: #fff;
      padding: 40px 38px 47px 20px;
      /* .before-link{
        .el-breadcrumb__inner{
          font-size: 14px;
          color: #8C8C8C;
          font-weight: normal;
        }
        .el-breadcrumb__separator{
          font-weight: normal;
        }
      }
      .current-page{
        .el-breadcrumb__inner{
          font-size: 14px;
          color: #2159D6;
        }
      } */
      .top-params{
        .top-title{
          margin-top: 30px;
          margin-left: 50px;
          font-size: 16px;
          color: #333333;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .list-form{
          position: relative;
          .form-box{
            width: 1000px;
            float: left;
          }
        }
        .space-gap{
          width:100%;
          height:60px;
        }
      }
    }
    .content{
      position: relative;
      margin:69px 43px 0px 38px;
      background-color: #fff;
      padding-bottom: 109px;
      .top-title{
        height: 46px;
        line-height: 46px;
        padding-left: 24px;
        font-size: 14px;
        color: rgba(0,0,0,0.85);
        margin-bottom: 59px;
        background: #FAFAFA;
        border: 1px solid #D9D9D9;
        /* box-shadow: inset 0 -1px 0 0 rgba(0,0,0,0.09); */
      }
      .list-form{
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
          margin-bottom: 40px;
        }
      }
      .result-area{
        .el-textarea__inner{
          height: 250px;
        }
      }
      .response-box {
        width: 417px;
        height: 240px;
        margin: 0 auto;
        background-color: #f5f7fa;
        border: 1px solid #ccc;
        overflow-y: auto;
      }
    }
    .query-btn{
      width: 144px;
      height: 40px;
      border-radius: 2px;
      font-size: 16px;
      color: #FFFFFF;
      position: absolute;
      bottom:18px;
      right: 0;
    }
  }
</style>
