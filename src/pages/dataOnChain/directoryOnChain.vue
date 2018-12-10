<template>
  <div class="directory-on-chain" v-loading="isLoad">
    <div class="directory-on-chain-head">
      <h4 class="mb32 f-size-20">资源上链</h4>
      <el-tabs class="directory-on-chain-tabs" v-model="menuForm.resourceType" @tab-click="clickTab">
        <el-tab-pane :disabled="hideData" label="数据" name="1"></el-tab-pane>
        <el-tab-pane :disabled="hideArithmetic" label="算法" name="2"></el-tab-pane>
        <el-tab-pane :disabled="hideCompute" label="算力" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="directory-on-chain-content">
      <div v-show="menuForm.resourceType === '1'">
        <p class="clear menu-show">
          <span class="f-weight-bold f-size-18">资源分类信息</span>
          <span class="ml260 f-size-14 f-weight-bold"><span class="color-999">
              您当前选择的是:
            </span>
            <el-cascader :separator="'>'" :options="infoOptions" v-model="menuForm.infoValues" :props="infoMenu" :change-on-select="true" disabled></el-cascader>
          </span>
        </p>
        <el-form :model="menuForm" ref="menuForm" :rules="rules" label-width="130px" class="demo-form" size="larger">
          <el-form-item label="信息资源分类:" prop="infoValues">
            <el-cascader :options="infoOptions" v-model="menuForm.infoValues" :props="infoMenu" :change-on-select="true"></el-cascader>
            <span v-if="menuForm.infoValues.length === 1" class="hint2">最少选择二级菜单</span>
            <span v-if="menuForm.infoValues.length > 5" class="hint2">最多只能选择五级菜单</span>
          </el-form-item>
        </el-form>
      </div>
      <div class="clear">
        <p class="f-weight-bold f-size-18">基本信息</p>
        <el-form :model="form" ref="form" :rules="rules" label-width="140px" class="demo-form" size="larger">
          <el-form-item label="信息资源名称:" prop="name">
            <el-input v-model.trim="form.name" style="width:386px"></el-input>
          </el-form-item>
          <el-form-item label="资源类型:" prop="cataType" v-show="menuForm.resourceType === '1'">
            <el-radio-group v-model="form.cataType">
              <el-radio :label="0">结构化数据</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否涉密:" prop="isSecret" v-show="menuForm.resourceType === '1'">
            <el-radio-group v-model="form.isSecret">
              <el-radio :label="0">涉密信息</el-radio>
              <el-radio :label="1">非涉密信息</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="开放类型:" prop="openType" v-show="menuForm.resourceType === '1'">
            <el-radio-group v-model="form.openType">
              <el-radio :label="0">无条件开放</el-radio>
              <el-radio :label="1">已申请开放</el-radio>
              <el-radio :label="2">依法不予开放</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType !== '3'" label="信息提供方式:" prop="resourceFormat" >
            <el-radio-group v-model="form.resourceFormat" @change="changeFormat">
              <el-radio :label="0">API</el-radio>
              <el-radio v-show="menuForm.resourceType === '1'" :label="1">关系型数据库</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="信息资源代码:" prop="cataCode" v-show="menuForm.resourceType === '1'">
            <el-input v-model.trim="form.cataCode" style="width:386px"></el-input>
          </el-form-item>
          <el-form-item label-width="0">
            <el-col :span="8">
              <el-form-item label="发布机构:">
                {{form.providerName}}
              </el-form-item>
            </el-col>
            <el-col :span="4"><span>&nbsp;</span></el-col>
            <el-col :span="8">
              <el-form-item label="发布机构代码:" label-width="142px">
                <span class="color-blue">{{form.providerCode}}</span>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType === '1'" label-width="0" v-for="(item , index) in form.relateCataCode" :key="index">
            <el-col :span="8">
              <el-form-item :label="`关联资源${index + 1}:`">
                <el-input v-model="item.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <span @click="addRelate(index)" class="mr20 ml20 cur-p lh-50 color-blue">
                <svg class="icon f-size-20">
                  <use xlink:href="#icon-jia"></use>
                </svg>
              </span>
              <span v-if="form.relateCataCode.length > 1 && form.relateCataCode.length === index + 1" @click="delRelate(index)" class="cur-p lh-50 color-blue">
                <svg class="icon f-size-20">
                  <use xlink:href="#icon-jian"></use>
                </svg>
              </span>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="`关联资源代码${index + 1}:`" label-width="150px">
                <el-input v-model="item.code"></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType === '1'" label="更新周期:" prop="updatePeriod">
            <el-radio-group v-model="form.updatePeriod">
              <el-radio :label="0">实时</el-radio>
              <el-radio :label="1">每日</el-radio>
              <el-radio :label="2">每周</el-radio>
              <el-radio :label="3">每月</el-radio>
              <el-radio :label="4">每季度</el-radio>
              <el-radio :label="5">每年</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType === '1'" label="共享方式:" prop="cataPermission">
            <el-checkbox-group v-model="form.cataPermission">
              <el-checkbox label="在线查询" name="type"></el-checkbox>
              <el-checkbox label="接口访问" name="type" disabled></el-checkbox>
              <el-checkbox label="下载" name="type" disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType === '1'" label="共享类型:" prop="shareType">
            <el-radio-group v-model="form.shareType">
              <el-radio :label="0">无条件共享</el-radio>
              <el-radio :label="1">有条件共享</el-radio>
              <el-radio :label="2">不予共享</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-show="menuForm.resourceType === '1'" label="用途说明:" v-if="form.shareType === 0" class="must-basis-icon mt-22">
            <el-checkbox-group v-model="useInfo">
              <el-checkbox label="作为行政依据，工作参考" name="type"></el-checkbox>
              <el-checkbox label="用户数字校核，业务协同" name="type"></el-checkbox>
            </el-checkbox-group>
            <span v-if="useInfo.length < 1" class="hint">请至少选择一种用途</span>
          </el-form-item>
          <div v-if="form.shareType === 1 || form.shareType === 2" class="clear">
            <el-form-item label="共享条件和范围:" v-if="form.shareType === 1" class="must-term-icon mt-34 fl">
            </el-form-item>
            <el-form-item label="共享依据:" v-else class="must-basis-icon mt-34 fl">
            </el-form-item>
            <el-form-item class="fl w-persent-90" prop="shareCondition" :rules='[
            {
              required: true,
              message: `请输入${
               form.shareType === 1 ? "共享条件或范围" : "不予共享的依据"
              }`,
              trigger: "blur"
            },
            {
              min: 1,
              max: 200,
              message: "长度在 1 到 200 个字符",
              trigger: "blur"
            }
          ]' label-width="0">
              <el-input v-model.trim="form.shareCondition" type="textarea" :rows="8" :placeholder="`请输入${form.shareType === 1 ? '共享条件或范围' : '不予共享的相关法律，行政法规，政策依据' } `"></el-input>
            </el-form-item>
          </div>
          <el-form-item v-show="menuForm.resourceType === '1'" label="是否向社会开放:" prop="openCommunity">
            <el-radio-group v-model="form.openCommunity">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="clear" v-if="form.openCommunity === 1">
            <el-form-item label="开放条件:" class="must-icon open-term fl mt-34">
            </el-form-item>
            <el-form-item prop="openCondition" label-width="0" class="fl w-persent-90">
              <el-input type="textarea" :rows="8" placeholder="请描述向社会开放资源的条件" v-model.trim="form.openCondition"></el-input>
            </el-form-item>
          </div>

       

          <el-form-item label="关键词:">
            <el-input v-model="tag" class="w255" clearable @keyup.native.enter='addTag' placeholder="按enter提交"></el-input>
            <el-tag :key="tag" v-for="tag in tags" closable size="larger" :disable-transitions="false" @close="handleClose(tag)" class="ml10">
              {{tag}}
            </el-tag>
          </el-form-item>
          <el-form-item label="信息资源摘要:" class="must-icon2 fl mt-34">
          </el-form-item>
          <el-form-item label-width="0" prop="resourceDescription" class="fl w-persent-90">
            <el-input type="textarea" :rows="8" placeholder="请输入信息资源摘要" v-model.trim="form.resourceDescription">
            </el-input>
          </el-form-item>
        </el-form>
        <p class="ta-c" v-show="menuForm.resourceType === '3'">
          <el-button @click="confirmCheck(0)" class="w160 h60 mr40 mt54 f-size-16 color-999">暂存</el-button>
          <el-button type="primary" @click="confirmCheck(1)" class="w160 h60 mt54 f-size-16">提交审核</el-button>
        </p>
      </div>
      <div class="api-info clear" v-show="menuForm.resourceType !== '3'">
        <p class="f-weight-bold f-size-18">接口/查询信息</p>
        <el-form :model="apiForm" :rules="rules" ref="apiForm" label-width="110px" size="larger">
          <el-form-item label="信息资源地址:"  prop="address" v-if="form.resourceFormat === 0">
            <el-input placeholder="请输入内容" v-model.trim="apiForm.address" style="width:435px">
              <template slot="prepend" class="f-size-14">Http://</template>
            </el-input>
          </el-form-item>
          <el-form-item label="请求方式:" class="mt10" prop="requestMethod"  v-if="form.resourceFormat == 0">
            <el-checkbox-group v-model="apiForm.requestMethod">
              <el-checkbox label="POST"></el-checkbox>
              <el-checkbox label="GET" disabled></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="返回格式:" prop="responseFormat"  v-if="form.resourceFormat === 0">
            <el-radio-group v-model="apiForm.responseFormat">
              <el-radio :label="0">JSON</el-radio>
              <el-radio :label="1" disabled>XML</el-radio>
              <el-radio :label="2" disabled>简明JSON</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="请求参数:"  v-if="form.resourceFormat === 0">
          </el-form-item>
          <el-table :data="requestForm" class="tb-edit" style="width: 100%" border  v-if="form.resourceFormat === 0">
            <el-table-column label="中文名称" align="center">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.cnName" placeholder="请输入中文名"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="英文名称" align="center">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.enName" placeholder="请输入英文名"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="是否必填" align="center">
              <template slot-scope="scope">
                <el-select size="small" v-model="requestForm[scope.$index].required" placeholder="请选择">
                  <el-option v-for="item in required" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="数据类型" align="center">
              <template slot-scope="scope">
                <el-select size="small" v-model="requestForm[scope.$index].type" placeholder="请选择">
                  <el-option v-for="item in requestType" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="说明" align="center">
              <template slot-scope="scope">
                <el-input size="small" v-model="scope.row.note" placeholder="请输入说明"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="delRequest(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="mb55 f-size-14 color-0072FF" style="text-align: center;border: 1px dashed #ECEEF3;padding: 10px; border-top:none" v-if="form.resourceFormat === 0"><span @click="addRequest" class="cur-p"  >+添加信息项</span></div>
          <div class="clear">
          <el-form-item label="信息资源地址:"  class="fl" prop="addressFirst" v-if="form.resourceFormat === 1">
            <el-select v-model="apiForm.addressFirst" placeholder="请选择" @change="changeAdrFirst">
              <el-option
                v-for="item in sqlAdrFirst"
                :key="item.value"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="fl" prop="addressSecond" v-if="form.resourceFormat === 1">
            <el-select v-model="apiForm.addressSecond" placeholder="请选择" :disabled="!hasAdrFirst">
            <el-option                                                                                
              v-for="item in sqlAdrSecond"
              :key="item.value"
              :value="item.value"
              >
            </el-option>
          </el-select>
          </el-form-item>
          </div>
          <el-form-item label="是否加密:" prop="isEncrypt" v-if="form.resourceFormat === 1">
            <el-radio-group v-model="apiForm.isEncrypt">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
             <!-- 信息项 -->
             <el-form-item label="信息项:"  required v-if="form.resourceFormat === 1&&menuForm.resourceType === '1'">
            </el-form-item>
            <el-table :data="infoForm" class="tb-edit" style="width: 100%" border v-if="form.resourceFormat === 1&&menuForm.resourceType === '1'">
              <el-table-column label="中文名称" align="center">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.cnName" placeholder="请输入中文名"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="英文名称" align="center">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.enName" placeholder="请输入英文名"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="数据类型" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="infoForm[scope.$index].type" placeholder="请选择">
                    <el-option v-for="item in infoType" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="数据长度" align="center">
                <template slot-scope="scope">
                  <el-input size="small" v-model="scope.row.dataLength" @change="changeDataLenth" placeholder="请输入数据长度"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="共享类型" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="infoForm[scope.$index].shareType" placeholder="请选择">
                    <el-option label="无条件共享" value="0"></el-option>
                    <el-option label="有条件共享" value="1"></el-option>
                    <el-option label="不予共享" value="2"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="是否开放" align="center">
                <template slot-scope="scope">
                  <el-select size="small" v-model="infoForm[scope.$index].openCommunity" placeholder="请选择">
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="delInfo(scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <div class="mb30 f-size-14 color-0072FF" style="text-align: center;border: 1px dashed #ECEEF3;padding: 10px; border-top:none"  v-if="form.resourceFormat === 1&&menuForm.resourceType === '1'"><span @click="addInfo" class="cur-p">+添加信息项</span></div>

          <el-form-item label="请求参数:" required prop="requestParams" v-show="form.resourceFormat === 1">
            <el-radio-group v-model="apiForm.requestParams">
              <el-radio :label="0">SQL语句</el-radio>
              <el-radio :label="1" disabled>表单内选择</el-radio>
            </el-radio-group>
            <el-input :rows="8" type="textarea" v-model="apiForm.sqlStr"></el-input>
          </el-form-item>

          <div class="clear">
          <el-form-item label="请求示例:" class="fl mt-14">
          </el-form-item>
          <el-form-item label-width="0" class="fl w-persent-90">
            <el-input :rows="8" type="textarea" v-model="apiForm.input"></el-input>
          </el-form-item>
          <el-form-item label="正常返回示例:" class="fl mt-14">
          </el-form-item>
          <el-form-item label-width="0" class="fl w-persent-90">
            <el-input :rows="8" type="textarea" v-model="apiForm.output"></el-input>
          </el-form-item>
          <el-form-item label="失败返回示例:" class="fl mt-14">
          </el-form-item>
          <el-form-item label-width="0" class="fl w-persent-90">
            <el-input :rows="8" type="textarea" v-model="apiForm.errput"></el-input>
          </el-form-item>
          </div>
          <div class="con-btn">
            <el-form-item label-width="0">
              <!-- <el-col :offset="6"> -->
              <el-button @click="confirmCheck(0)" class="w160 h60 mt44 mr30">暂存</el-button>
              <el-button type="primary" @click="confirmCheck(1)" class="w160 h60 mt44">提交审核</el-button>
              <!-- </el-col> -->
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- <p class="ta-c" v-show="menuForm.resourceType === '3'">
        <el-button @click="confirmCheck(0)" class="w160 h60 mr40">暂存</el-button>
        <el-button type="primary" @click="confirmCheck(1)" class="w160 h60">提交审核</el-button>
      </p> -->
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import _ from "lodash";
import api from "../../api/api.js";
import http from "../../api/http.js";
import ServerAddress from "../../api/serverAddress.js";
import { fullRules } from "./directoryOnChainRuler.js";
export default {
  name: "directoryOnChain",
  components: {},
  data() {
    return {
      isLoad: false,
      flag: true,
      createTime: 0,
      infoOptions: [],
      providerMenu: [],
      options5: [],
      showMenu: "",
      useInfo: [],
      form: {
        infoValues: [],
        name: "",
        cataType: "",
        isSecret: "",
        openType: "",
        resourceFormat: 0,
        cataCode: "",
        providerCode: "",
        cataPermission: ["在线查询"],
        providerName: "",
        relateCataCode: [
          {
            name: "",
            code: ""
          }
        ],
        updatePeriod: "", //校验
        shareType: "",
        shareCondition: "",
        openCommunity: "",
        resourceDescription: "",
        openCondition: ""
      },
      requestForm: [],
      infoForm: [],
      apiForm: {
        address: "",
        addressFirst: "",
        addressSecond: "",
        isEncrypt: "",
        sqlStr: "",
        requestParams: 0,
        directoryType: "",
        requestMethod: ["POST"],
        responseFormat: 0,
        input: "",
        output: "",
        errput: ""
      },
      menuForm: {
        resourceType: "1",
        infoValues: []
      },
      tag: "",
      tags: [],
      sqlAdrFirst: [
        {'value': 'test'},
        {'value': 'healthcase'}
      ],
      sqlAdrSecond: [],
      sqlParams: [],
      hasAdrFirst: false,
      hideData: false,
      hideArithmetic: false,
      hideCompute: false,
      required: [
        {
          value: "0",
          label: "是"
        },
        {
          value: "1",
          label: "否"
        }
      ],
      requestType: [
        {
          value: "0",
          label: "string"
        },
        {
          value: "1",
          label: "int"
        },
        {
          value: "2",
          label: "float"
        }
      ],
      infoType: [
        {
          value: "0",
          label: "字符型C"
        },
        {
          value: "1",
          label: "数值型N"
        },
        {
          value: "2",
          label: "货币型Y"
        },
        {
          value: "3",
          label: "日期型D"
        },
        {
          value: "4",
          label: "日期时间型T"
        },
        {
          value: "5",
          label: "逻辑型L"
        },
        {
          value: "6",
          label: "备注型M"
        },
        {
          value: "7",
          label: "通用型G"
        },
        {
          value: "8",
          label: "双精度型B"
        },
        {
          value: "9",
          label: "整型I"
        },
        {
          value: "10",
          label: "浮点型F"
        },
      ],
      activeNames: ["1"],
      infoMenu: {
        label: "Title",
        value: "Index",
        children: "children"
      },
      rules: {
        name: [
          { required: true, message: "请输入信息资源名称", trigger: "blur" },
          { min: 1, max: 20, message: "长度在1-20个字符", trigger: "blur" }
        ],
        region: [
          { required: true, message: "请选择活动区域", trigger: "change" }
        ],
        cataPermission: [
          {
            type: "array",
            required: true,
            message: "请至少选择一种共享方式",
            trigger: "change"
          }
        ],
        cataType: [
          { required: true, message: "请选择资源类型", trigger: "change" }
        ],
        openType: [
          { required: true, message: "请选择开放类型", trigger: "change" }
        ],
        isSecret: [
          { required: true, message: "请选择是否涉密", trigger: "change" }
        ],
        resourceFormat: [
          { required: true, message: "请选择信息提供方式", trigger: "change" }
        ],
        updatePeriod: [
          { required: true, message: "请选择信息提供方式", trigger: "change" }
        ],
        cataCode: [
          { required: true, message: "请输入信息资源代码", trigger: "blur" },
          { min: 1, max: 20, message: "长度在 1 到 20 个字符", trigger: "blur" }
        ],
        openType: [
          { required: true, message: "请选择开放类型", trigger: "change" }
        ],
        shareType: [
          { required: true, message: "请选择开共享类型", trigger: "change" }
        ],
        openCommunity: [
          { required: true, message: "请选择是否向社会开放", trigger: "change" }
        ],
        openCondition: [
          { required: true, message: "请输入开放条件", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        resourceDescription: [
          { required: true, message: "请输入信息资源摘要", trigger: "blur" },
          {
            min: 1,
            max: 200,
            message: "长度在 1 到 200 个字符",
            trigger: "blur"
          }
        ],
        address: [
          { required: true, message: "请输入信息资源地址", trigger: "blur" },
          { min: 1, message: "信息资源地址不能为空", trigger: "blur" }
        ],
        requestMethod: [
          {
            type: "array",
            required: true,
            message: "请至少选择一种请求方式",
            trigger: "change"
          }
        ],
        // useInfo: [
        //   {
        //     type: "array",
        //     required: true,
        //     message: "请至少选择一种用途",
        //     trigger: "change"
        //   }
        // ],
        responseFormat: [
          { required: true, message: "请选择返回格式", trigger: "change" }
        ],
        infoValues: [
          {
            type: "array",
            required: true,
            message: "请选择目录分类",
            trigger: "change"
          }
        ],
        resourceType: [
          {
            required: true,
            message: "请选择资源类别",
            trigger: "change"
          }
        ],
        addressFirst: [
          {
            required: true,
            message: "请选择信息资源地址",
            trigger: "change"
          }
        ],
        addressSecond: [
          {
            required: true,
            message: "请选择信息资源地址",
            trigger: "change"
          }
        ],
        isEncrypt: [
          {
            required: true,
            message: "请选择是否加密",
            trigger: "change"
          }
        ],
      },

      algorithmRuler: [
        "infoValues",
        "cataType",
        "isSecret",
        "openType",
        "cataCode",
        "updatePeriod",
        "cataPermission",
        "shareType",
        "openCommunity",
        "addressFirst",
        "addressSecond",
      ],
      computeRuler: [
        "infoValues",
        "cataType",
        "isSecret",
        "openType",
        "cataCode",
        "updatePeriod",
        "cataPermission",
        "shareType",
        "openCommunity",
        "resourceFormat",
        "address",
        "addressFirst",
        "addressSecond",
      ],
      sqlRuler: [
        "address",
        "requestMethod",
        "responseFormat"
      ],
      apiRuler: [
        "addressFirst",
        "addressSecond",
        "isEncrypt",
      ],
      formName: ["menuForm", "form", "apiForm"]
    };
  },
  methods: {
    ...mapActions(["getMessageList"]),
    //删除关键词
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
    },
    //添加关键词
    addTag() {
      if (this.tag.length < 1 || this.tag.match(/^[ ]+$/)) {
        this.$message.error("不能提交空白信息作为关键词");
      } else {
        if (this.tags.length > 5) {
          this.$message.error("标签数目已达上限");
        } else {
          this.tags.push(this.tag);
          this.tag = "";
        }
      }
    },
    //验证参数
    checkParam(paramsArr) {
      let arr = [];
      if (paramsArr.length > 0) {
        paramsArr.forEach(item => {
          for (let key in item) {
            arr.push(item[key]);
          }
        });
        let arr2 = arr.filter(item => {
          return item.length < 1 || item.match(/^[ ]+$/);
        });
        if (arr2.length > 0) {
          this.flag = false;
        } else {
          this.flag = true;
        }
      } else {
        this.flag = true;
      }
    },
    //添加请求参数
    addRequest() {
      this.checkParam(this.requestForm);
      if (this.flag) {
        this.requestForm.push({
          cnName: "",
          enName: "",
          required: "",
          type: "",
          note: ""
        });
      } else {
        this.$message.error("请先完善本项参数");
      }
    },
    //删除请求参数
    delRequest(index) {
      this.requestForm.splice(index, 1);
    },
    // 切换信息提供方式按钮
    changeFormat(val){
      this.flag= true;
      if (Number(val) === 1) {
        // 调接口
      }
      this.clickTab();
      
    },
    // 添加SQL信息项
    addInfo(){
      this.checkParam(this.infoForm);
      if(this.infoForm.length > 0 && !this.changeDataLenth(this.infoForm[this.infoForm.length - 1].dataLength)){
        return false;
      }
      if (this.flag) {
        this.infoForm.push({
          cnName: "",
          enName: "",
          type: "",
          dataLength: "",
          shareType: "",
          openCommunity: ""
        });
      } else {
        this.$message.error("请先完善本项信息");
      }
    },
    //删除SQL信息项
    delInfo(index) {
      this.infoForm.splice(index, 1);
    },
    // SQL选择信息资源地址
    changeAdrFirst (val) {
      this.hasAdrFirst = true;
      this.apiForm.addressSecond = '';
      if(val === 'test'){
        this.sqlAdrSecond = [{'value': 'user'}, {'value': 'zsba_address'}, {'value': 'zsba_questionnaire'}];
      }else if(val === 'healthcase'){
        this.sqlAdrSecond = [{'value': 'smscode'}, {'value': 'zsba_user'}, {'value': 'zsba_address'}];
      }

    },
    // 匹配SQL花括号正则
    matchSql(str){
      var regex3 = /\{\{(\.{1}.+?)\}\}/g; // {} 花括号，大括号
      var lastArr = str.match(regex3);
      var arr = [];
      // 输出是一个数组
      for(let i in lastArr){
        let param =  lastArr[i].slice(3, lastArr[i].length-2);
        arr.push({'cnName': param, 'enName': param, 'required': '0'});
      }
      console.log(arr);
      
      return arr;
    },
    // SQL信息项数据长度校验
    changeDataLenth(val){
      if (val <= 0 || val > 255 || !/^[0-9]*$/.test(Number(val))) {
        this.$message.error('请输入范围在0~255内的数字');
        return false;
      } else {
        return true;
      }
    },
    //添加关联资源
    addRelate(i) {
      if (
        this.form.relateCataCode[i].name.length > 0 &&
        this.form.relateCataCode[i].code.length > 0
      ) {
        this.form.relateCataCode.push({
          name: "",
          code: ""
        });
      } else {
        this.$message.error(`请您先完善资源${i + 1}`);
      }
    },
    //删除关联资源
    delRelate(i) {
      this.form.relateCataCode.splice(i, 1);
    },
    //获取信息资源分类
    getMenu() {
      http(ServerAddress.allMenu, "", "get").then(result => {
        // console.log(result)
        // this.infoOptions.push(result.data.data.dataList);
        this.infoOptions = result.data.data.dataList;
      });
    },
    // 选择资源类型
    clickTab() {
      this.rules = _.cloneDeep(fullRules);
      if (this.menuForm.resourceType === "1") {
        if(this.form.resourceFormat === 0){
          this.apiRuler.forEach(key => {
            delete this.rules[key];
          });
        }
        if(this.form.resourceFormat === 1){
          this.sqlRuler.forEach(key => {
            delete this.rules[key];
          });
        }
      }
      if (this.menuForm.resourceType === "2") {
        this.form.resourceFormat = 0;
        this.algorithmRuler.forEach(key => {
          delete this.rules[key];
        });
      } else if (this.menuForm.resourceType === "3") {
        this.computeRuler.forEach(key => {
          delete this.rules[key];
        });
      }
      setTimeout(() => {
        this.formName.forEach(item => {
          this.$refs[item].clearValidate();
        });
      }, 0);
    },
    //获取提供方分类
    // getOrganizationList() {
    //   http(ServerAddress.departmentList, "", "get").then(result => {
    //     this.providerMenu.push(result.data.data.dataList);
    //   });
    // },
    async sqlGetData(){
      let data = {
        'Sql': this.apiForm.sqlStr,
        'DataSource': this.apiForm.addressFirst
      }
      let response;
      try {
        let response = await http(ServerAddress.translateGetUrl, data, 'post', 'chain');
        let resultAdr = response.data.data.split('?')[0];
        let lastParam = response.data.data.split('?')[1];
        this.sqlParams = this.matchSql(this.apiForm.sqlStr);
        this.sqlParams.push({'adrKey': lastParam.split('=')[0], 'adrVal': lastParam.split('=')[1]});
        this.apiForm.address = resultAdr;
        return true;
      } catch (e) {
        console.log(e)
        this.$message.error("获取数据失败");
        return false;
      }
      //  await http(ServerAddress.apiDataUrl, data, 'post', 'gong').then(
      //   result => {
      //     if (result.data.code === 200) {
      //       this.apiForm.address = result.data.data;
      //     } else {
      //       this.$message.error("失败信息提示");
      //       // this.isLoad = false;
      //     }
      //   }
      // );
    },
    //提交审核,暂存
    async confirmCheck(status) {
      // let sqls = [];
      if (this.menuForm.resourceType === "1") {
        if (this.form.resourceFormat === 0){
          this.checkParam(this.requestForm);
        }else if (this.form.resourceFormat === 1){
          if(this.infoForm.length < 1){
            this.$message.error("请添加信息项");
            return false;
          }
          if (!this.changeDataLenth(this.infoForm[this.infoForm.length - 1].dataLength)){
            return false;
          }
          this.checkParam(this.infoForm);
          let urlflag = await this.sqlGetData();
          console.log(urlflag);
          if(!urlflag){
            return false;
          }
        }
      }
      let len = this.menuForm.infoValues.length;
      this.$refs["menuForm"].validate(valid => {
        if (valid) {
          this.$refs["form"].validate(valid => {
            if (valid) {
              this.$refs["apiForm"].validate(valid => {
                if (valid) {
                  if (len > 5) {
                    this.$message.error("信息分类最多只能选择5级菜单");
                  } else if (len < 2 && this.menuForm.resourceType === "1") {
                    this.$message.error("信息分类最少选择2级菜单");
                  } else {
                    if (this.flag) {
                      if (this.menuForm.resourceType === "1"&&this.form.resourceFormat === 0 ||this.menuForm.resourceType === "2") {
                        let ads = this.apiForm.address;
                        if (ads.length < 1 || ads.indexOf(" ") > -1) {
                          this.$message.error("请输入正确的信息资源地址");
                          return;
                        }
                        let reg = /^http:\/\/|https:\/\//i;
                        if (!reg.test(ads)) {
                          this.apiForm.address = `http://${
                            this.apiForm.address
                          }`;
                        }
                      }
                      if (this.menuForm.resourceType === "1"&&this.form.resourceFormat === 1) {
                        // if (this.infoForm.length < 1){
                        //   this.$message.error("请添加信息项");
                        //   return false;
                        // }
                        if (this.apiForm.sqlStr.length < 1){
                          this.$message.error("请输入sql语句");
                          return false;
                        }
                      }
                      if (this.menuForm.resourceType === "2") {
                        this.algorithmRuler.forEach(key => {
                          delete this.form[key];
                        });
                      } else if (this.menuForm.resourceType === "3") {
                        this.computeRuler.forEach(key => {
                          delete this.form[key];
                          delete this.apiForm[key];
                        });
                      }
                      this.apiForm.requestForm = this.requestForm;
                      if (this.form.resourceFormat === 1){
                        this.apiForm.requestForm = this.sqlParams;
                      }
                      this.apiForm.infoForm = this.infoForm;
                      let schemaJson = JSON.stringify(this.apiForm);
                      let data = {
                        issuer: JSON.parse(localStorage.getItem("userInfo"))
                          .address,
                        isSecret: this.form.isSecret,
                        createTime: this.createTime,
                        name: this.form.name,
                        type: Number(this.menuForm.resourceType),
                        category: this.menuForm.infoValues.join(","),
                        cataType: this.form.cataType,
                        openType: this.form.openType,
                        resourceFormat: this.form.resourceFormat,
                        cataCode: this.form.cataCode,
                        providerCode: this.form.providerCode,
                        providerName: this.form.providerName,
                        openCondition: this.form.openCondition, //开放条件
                        relateCataCode: JSON.stringify(
                          this.form.relateCataCode
                        ),
                        updatePeriod: this.form.updatePeriod,
                        keywords: this.tags.join(","),
                        cataPermission: 0,
                        shareType: this.form.shareType,
                        shareCondition:
                          this.form.shareType === 0
                            ? this.useInfo.join("/")
                            : this.form.shareCondition,
                        openCommunity: this.form.openCommunity,
                        resourceDescription: this.form.resourceDescription,
                        schemaJson,
                        status,
                        isEncrypt: this.form.resourceFormat ? this.form.resourceFormat === 0 ? 0 : this.apiForm.isEncrypt : 0
                      };
                      let id = this.$route.query.id;
                      if (id) {
                        data.id = Number(id);
                        this.isLoad = true;
                        http(ServerAddress.resourceUpdate, data).then(
                          result => {
                            if (result.data.code === 0) {
                              this.$router.push("/directoryManagement");
                              this.isLoad = false;
                            } else {
                              this.$message.error("获取数据失败");
                              this.isLoad = false;
                            }
                            // this.$router.push("/directoryManagement");
                            this.getMessageList();
                          }
                        );
                      } else {
                        this.isLoad = true;
                        http(ServerAddress.resourceAdd, data).then(result => {
                          // this.$router.push("/directoryManagement");
                          if (result.data.code === 0) {
                            this.$router.push("/directoryManagement");
                            this.isLoad = false;
                          } else {
                            this.$message.error("获取数据失败");
                            this.isLoad = false;
                          }
                          this.getMessageList();
                        });
                      }
                    } else {
                      this.$message.error("请完善参数信息");
                    }
                  }
                } else {
                  this.$message.error("请完善目录信息");
                }
              });
            } else {
              this.$message.error("请完善目录信息");
            }
          });
        } else {
          this.$message.error("请完善目录信息");
        }
      });
    },
    //修改目录,获取信息
    modifyResoruce() {
      this.getMenu();
      let id = this.$route.query.id;
      if (id) {
        let data = {
          id
        };
        http(ServerAddress.resourceDetail, data, "get").then(result => {
          let row = result.data.data;
          this.form = row;
          if (row.shareType === 0) {
            this.useInfo = row.shareCondition.split("/");
            // this.form.useInfo.splice(0, 1);
          }
          this.menuForm.resourceType = row.type.toString();
          this.form.relateCataCode = JSON.parse(row.relateCataCode);
          // this.form.infoValues = row.category.split(",");
          this.showMenu = row.category;
          if (row.keywords !== "") {
            this.tags = row.keywords.split(",");
          }
          this.apiForm = JSON.parse(row.schemaJson);
          this.requestForm = this.apiForm.requestForm;
          this.infoForm = this.apiForm.infoForm;
          this.form.cataPermission = ["在线查询"];
          this.setHideTab(this.form.type);
          let arr = row.category.split(",");
          let arr2 = [];
          for (let i in arr) {
            arr2.push(Number(arr[i]));
          }
          this.menuForm.infoValues = arr2;
          this.clickTab();
        });
      }
    },
    setHideTab(type){
      switch (type) {
        case 1:
          this.hideArithmetic = true;
          this.hideCompute = true;
          break;
        case 2:
          this.hideData = true;
          this.hideCompute = true;
          break;
        case 3:
          this.hideData = true;
          this.hideArithmetic = true;
          break;
      }
    },
    //获取用户信息
    getUser() {
      const userInfo = JSON.parse(api.getLS("userInfo"));
      const linkaddress = JSON.parse(userInfo.linkaddress);
      this.form.providerCode = linkaddress.Code;
      this.form.providerName = linkaddress.Title;
    },
    handleChange() {
      // alert(1);
      this.$forceUpdate();
    }
    // menuChange() {
    //   if (this.menuForm.infoValues.length > 4) {
    //     let list = document.querySelectorAll(".el-cascader-menus");
    //     for (let i = 0; i < list.length; i++) {
    //       list[i].style.display = "none";
    //     }
    //   }
    // }
  },
  created() {
    this.getMenu();
    // this.getOrganizationList();
    this.createTime = Date.parse(new Date()) / 1000;
    if (this.$route.query.id) {
      this.modifyResoruce();
    }
    this.getUser();
    // this.matchSql('select id, name from user where id={{.id}}');
    // this.form.useInfo = ["作为行政依据，工作参考"]
  }
};
</script>

<style lang="less">
.directory-on-chain {
  box-sizing: border-box;
  .directory-on-chain-head {
    width: 100%;
    height: 137px;
    box-sizing: border-box;
    background-color: #fff;
    padding: 24px 40px 0;
    .directory-on-chain-tabs {
      .el-tabs__nav {
        padding-bottom: 15px;
        .el-tabs__active-bar {
          height: 4px;
        }
        .el-tabs__item {
          box-sizing: border-box;
          font-size: 18px;
          font-weight: 550;
          text-align: center;
          &:nth-child(odd) {
            width: 120px;
          }
          &:nth-child(even) {
            width: 100px;
          }
        }
      }
      .el-tabs__nav-wrap::after {
        background-color: transparent;
        height: 4px;
      }
    }
  }
  .directory-on-chain-content {
    & > div {
      margin: 37px 40px;
      padding: 27px 50px;
      background-color: #fff;
      margin-bottom: 40px;
      & > p:first-child {
        padding-bottom: 30px;
        border-bottom: 1px solid #eceef3;
        margin-bottom: 40px;
      }
    }
    .el-cascader__label {
      font-size: 14px !important;
      color: #999 !important;
      span {
        color: #999;
      }
    }
  }
  & > p {
    font-size: 18px;
    padding: 10px 0px 30px;
  }
  .request-text {
    span {
      &:nth-child(1) {
        margin-left: 200px;
      }
      &:nth-child(2) {
        margin-left: 110px;
      }
      &:nth-child(3) {
        margin-left: 70px;
      }
      &:nth-child(4) {
        margin-left: 45px;
      }
      &:nth-child(5) {
        margin-left: 140px;
      }
    }
  }
  .response-text {
    span {
      &:nth-child(1) {
        margin-left: 100px;
      }
      &:nth-child(2) {
        margin-left: 127px;
      }
      &:nth-child(3) {
        margin-left: 69px;
      }
    }
  }
  .el-tag {
    border: 1px solid #2159d6;
    background-color: #fff;
    color: #2159d6;
    border-radius: 0px;
    height: 38px;
    line-height: 38px;
  }
  // .tb-edit .el-input,
  // .tb-edit .el-select {
  //   display: none;
  // }
  // .tb-edit .current-row .el-input,
  // .tb-edit .current-row .el-select {
  //   display: block;
  // }
  // .tb-edit .current-row .el-input + span,
  // .tb-edit .current-row .el-select + span {
  //   display: none;
  // }
    table {
      .el-input__inner {
        border: none;
        background: transparent;
        text-align: center;
      }
    }
  .api-info {
    .el-input-group__prepend {
      background: #dee0e4;
    }
  }
  .el-form-item {
    .el-form-item {
      margin-bottom: 0px;
    }
  }
  .con-btn {
    .el-form-item__content {
      text-align: center;
    }
  }
  .el-form-item__label {
    color: #999;
  }
  .menu-show {
    .el-cascader {
      min-width: 700px;
      border: none;
    }
    .el-cascader .el-input,
    .el-cascader .el-input__inner {
      border: none;
      .el-input__suffix {
        display: none;
      }
    }
    .directory-on-chain .menu-show .el-cascader .el-input,
    .directory-on-chain .menu-show .el-cascader .el-input__inner,
    .el-cascader.is-disabled .el-cascader__label {
      background-color: #fff;
      color: #000;
      font-size: 16px;
    }
  }
  .hint {
    color: #f56c6c;
    position: relative;
    top: -18px;
    display: block;
    margin-bottom: -40px;
  }
  .hint2 {
    color: #f56c6c;
    position: relative;
    display: block;
    margin-bottom: -40px;
  }
  .must-term-icon:before {
    content: "*";
    color: #f56c6c;
    position: relative;
    top: 31px;
    left: 7px;
  }
  .must-basis-icon:before {
    font-size: 14px;
    content: "*";
    color: #f56c6c;
    position: relative;
    top: 28px;
    left: 49px;
  }
  .el-radio {
    color: #333;
  }
  .icon {
    vertical-align: initial;
  }

  .open-term::before {
    top: 30px;
    left: 55px;
  }
  .w-persent-90 {
    width: 90%;
  }
  .el-table thead {
    color: #333;
  }
  .el-table th {
    background: #fafafa;
  }
}
</style>