<template>
  <div class="home">
    <div class="home-header">
      <div class="clear">
        <!-- <div class="fl">
          <div class="head-pic fl ml40">
            <svg class="icon f-size-100 color-fff" aria-hidden="true">
              <use xlink:href="#icon-touxiang"></use>
            </svg>
          </div>
          <div class="fl ml22">
            <p class="mt20 f-size-20">{{userInfo.username}}</p>
            <p class="mt10 f-size-14 color-grey">{{userInfo.address}}</p>
          </div>
        </div> -->
        <div class="fr mr20">
          <div v-for="(item,index) in homeInfo" :key="index" class="fl l-line">
            <div class="f-size-30 ta-c">{{getAnmationNumber(index)}}</div>
            <div class="f-size-14 ta-c line-desc">{{item}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="home-banner">
      <div v-for="item in menuList" :key="item.path" @click="clickMenu(item)">
        <div class="home-banner-icon">
          <svg class="icon f-size-34 color-fff" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
        </div>
        <div class="mt18 f-size-16 cur-p" >
          {{item.name}}
        </div>
      </div>
    </div>
    <div class="home-dashbord">
      <div class="left">
        <div class="dashbord-line bgi-left">
          <div class="dashbord-title">目录上链统计</div>
          <div class="mt7 top-text">TOP8</div>
          <DirectoryOnChain />
        </div>
        <div class="dashbord-pie bgi-left">
          <div class="dashbord-title">目录主题统计</div>
          <div class="mt7 top-text">TOP8</div>
            <DirectoryCategory />
        </div>
      </div>
      <div class="content bgi-center">
        <!-- <img class="img-center" src="../../assets/imgs/homePage/分组2.svg" alt=""> -->
        <div class="dashbord-title ta-c">机构部门合约关系图</div>
        <div class="mt40 ml40">
          <el-row>
            <el-col v-for="(item, index) in relationInfo" :key="index" :span="7" :push="2">
              <div>
                <span class="f-size-40 relation-top-num">{{getAnmationNumber(index + 4)}}</span>
                <span class="f-size-16 relation-top-text">个</span>
              </div>
              <div class="f-size-16 color-grey mt12">{{item}}</div>
            </el-col>
          </el-row>
        </div>
        <DepartmentRelationship />
      </div>
      <div class="right">
        <div class="dashbord-line bgi-right">
          <div class="dashbord-title ta-r">合约数量统计</div>
          <div class="mt7 top-text ta-r">TOP8</div>
          <ContractNum />
        </div>
        <div class="dashbord-pie bgi-right">
          <div class="dashbord-title ta-r">合约执行数据统计</div>
          <div class="mt7 top-text ta-r">TOP8</div>
          <ExcuteContract />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {TweenMax, TimelineLite} from "gsap";
  import { mapState } from 'vuex'
  import _ from 'lodash'
  import DirectoryOnChain from './directoryOnChain.vue'
  import ContractNum from './contractNum.vue'
  import DepartmentRelationship from './departmentRelationship.vue'
  import DirectoryCategory from './directoryCategory.vue'
  import ExcuteContract from './excuteContract.vue'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
  import api from '../../api/api.js'
  
  export default {
    name: 'homePage',
    components: {
      DirectoryOnChain,
      ContractNum,
      DepartmentRelationship,
      DirectoryCategory,
      ExcuteContract
    },
    data () {
      return { 
        homeInfo: ["目录上链", "合约总量", "合约审批", "待审合约"],
        relationInfo: ["部门上链", "目录", "累计交易数据"],
        menuList: [
          {
            name: '资源广场',
            path: '/resourceMall/1',
            icon: '#icon-jianzhu',
          },
          {
            name: '资源上链',
            path: '/directoryOnChain',
            icon: '#icon-mulu-sekuaiicon',
          },
          {
            name: '资源管理',
            path: '/listManagement',
            icon: '#icon-guanligenjin',
          },
          {
            name: '我的合约',
            path: '/myContract',
            icon: '#icon-heyueguanli',
          },
          {
            name: '上链审核',
            path: '/directoryCheckList',
            icon: '#icon-shenhe',
          },
          {
            name: '合约审核',
            path: '/contractCheck',
            icon: '#icon-shenpi',
          },
        ],
        resourceCount: 0,   //目录上链
        tweenedResourceCount: 0,
        contractCount: 0,   //合约总量
        tweenedContractCount: 0,
        auditedContractCount: 0,  //合约审批
        tweenedAuditedContractCount: 0,
        waitAuditContractCount: 0,  //代审合约
        tweenedWaitAuditContractCount: 0,
        organizationCount: 0, //部门上链
        tweenedOrganizationCount: 0,
        resourceTotalCount: 0,    //目录
        tweenedResourceTotalCount: 0,
        contractExecCount: 0,   //累计交易数据
        tweenedContractExecCount: 0,
      }
    },
    watch: {
      resourceCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedResourceCount: newValue });
      },
      contractCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedContractCount: newValue });
      },
      auditedContractCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedAuditedContractCount: newValue });
      },
      waitAuditContractCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedWaitAuditContractCount: newValue });
      },
      organizationCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedOrganizationCount: newValue });
      },
      resourceTotalCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedResourceTotalCount: newValue });
      },
      contractExecCount: function(newValue) {
        TweenLite.to(this.$data, 0.5, { tweenedContractExecCount: newValue });
      },
    },
    methods: {
      //获取资源合约
      async getMyResourceAndContract() {
        const userInfo = JSON.parse(api.getLS('userInfo'))
        const params = {
					issuer: userInfo.address,
				}
				let response;
				try {
          response = await http(ServerAddress.getMyResourceAndContract, params, 'get')
          const { data: { data : {auditedContractCount, contractCount, contractExecCount, organizationCount, resourceCount, waitAuditContractCount, resourceTotalCount}}} = response;
          _.assign(this, {
            resourceCount,
            contractCount,
            auditedContractCount,
            waitAuditContractCount,
            organizationCount,
            resourceTotalCount,
            contractExecCount
          })
          // this.resourceCount = 20;
          // this.contractCount = 25;
          // this.auditedContractCount = 30;
          // this.waitAuditContractCount = 35;
          // this.organizationCount = 40;
          // this.resourceTotalCount = 45;
          // this.contractExecCount = 50;
				} catch (e) {
					console.log(e)
        }
      },
      clickMenu(menu) {
        this.$router.push(menu.path);
      },
      getAnmationNumber(index) {
        switch (index) {
          case 0:
            return this.animatedResourceCount;
          case 1:
            return this.animatedContractCount;
          case 2:
            return this.animatedAuditedContractCount;
          case 3:
            return this.animatedWaitAuditContractCount;
          case 4:
            return this.animatedOrganizationCount;
          case 5:
            return this.animatedResourceTotalCount;
          case 6:
            return this.animatedContractExecCount;
          default:
            break;
        }
      }
    },
    created() {
      this.getMyResourceAndContract();
    },
    computed: {
      ...mapState({
        userInfo: state => state.user.userInfo
      }),
      animatedResourceCount: function() {
        return this.tweenedResourceCount.toFixed(0);
      },
      animatedContractCount: function() {
        return this.tweenedContractCount.toFixed(0);
      },
      animatedAuditedContractCount: function() {
        return this.tweenedAuditedContractCount.toFixed(0);
      },
      animatedWaitAuditContractCount: function() {
        return this.tweenedWaitAuditContractCount.toFixed(0);
      },
      animatedOrganizationCount: function() {
        return this.tweenedOrganizationCount.toFixed(0);
      },
      animatedResourceTotalCount: function() {
        return this.tweenedResourceTotalCount.toFixed(0);
      },
      animatedContractExecCount: function() {
        return this.tweenedContractExecCount.toFixed(0);
      },
    }
  }
</script>

<style lang="less">
  .home {
    padding: 0px 21px 74px 11px;
    /* margin-bottom: 40px; */
    box-sizing: border-box;
    color: #fff;
    border-left: 1px solid #404F73;
    .home-header {
      padding: 43px 0 47px;
      .head-pic {
        height: 100px;
        width: 100px;
        border-radius: 50%;
      }
      .l-line {
        &:nth-child(n + 2) {
          border-left: 2px solid #000000;
          margin-left: 34px;
          padding-left: 38px;
        }
      }
      .t-color {
        color: rgba(0, 0, 0, 0.45);
      }
      .line-item{
        
      }
      .line-desc{
        font-size: 16px;
        color: #8E97C1;
        letter-spacing: 1.21px;
      }
    }
    .home-banner {
      /* padding: 40px 0;
      margin-top: 60px; */
      display: flex;
      & > div {
        flex: 1;
        text-align: center;
      }
      .home-banner-icon {
        width: 109px;
        height: 109px;
        line-height: 85px;
        box-sizing: border-box;
        /* background-color: rgba(0,93,255,0.80); */
        background-image: url('../../assets/imgs/homePage/ellipse.svg');
        border-radius: 50%;
        /* border: 3px solid #005DFF; */
        margin: 0 auto;
        transition: all linear .3s;
        cursor: pointer;
        svg{
          margin-top: 22px;
          margin-left: 5px;
          vertical-align: middle;
        }
      }
    }
    .home-dashbord {
      margin-top: 64px;
      display: flex;
      /* overflow-x: auto; */
      .left, .right {
        width: 359px;
        .dashbord-line {
          width: 100%;
          height: 476px;
          /* background-color: #112451; */
          padding: 15px 12px;
          box-sizing: border-box;
        }
        .dashbord-pie {
          width: 100%;
          height: 476px;
          /* background-color: #112451; */
          margin-top: 20px;
          padding: 15px 12px;
          box-sizing: border-box;
        }
      }
      .content {
        position: relative;
        flex: 1;
        height: 965px;
        background-color: #112451;
        margin: 0 20px;
        box-sizing: border-box;
        padding: 14px 20px 28px;
        .relation-top-num{
          color: #72C8FD;
        }
        .relation-top-text{
          color: #8E97C1;
        }
      }
      .dashbord-title {
        padding-bottom: 14px;
        padding-top: 3px;
        /* border-bottom: 1px solid rgba(255, 255, 255, .2); */
        font-size: 18px;
        color: #8E93AB;
        letter-spacing: 2px;
      }
      .top-text{
        color: #8E93AB;
        font-size: 14px;
      }
      .bgi-left{
        background: url('../../assets/imgs/homePage/left.png');
        background-repeat: no-repeat;
        background-size:100% 100%; 
      }
      .bgi-right{
        background: url('../../assets/imgs/homePage/right.png');
        background-repeat: no-repeat;
        background-size: 100% 100%; 
      }
      .bgi-center{
        background: url('../../assets/imgs/homePage/center.png');
        background-repeat: no-repeat;
        background-size:100% 100%; 
      }
      /* .img-center{
        position: absolute;
        width: 100%;
        height: 100%;
      } */
    }
  }
</style>