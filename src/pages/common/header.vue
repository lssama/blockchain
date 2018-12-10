<template>
  <div class="header" :class="menu === 'home' ? 'home-header' : ''">
    <!-- <span class="cur-p" @click="toEntry">
      <svg class="icon f-size-16 enter-icon" :class="menu === 'home' ? 'color-6D93FF' : 'color-fff'" aria-hidden="true">
        <use xlink:href="#icon-entry-icon"></use>
      </svg>
      <span class="enter" :class="menu === 'home' ? 'color-6D93FF' : 'color-fff'">快捷入口</span>
    </span> -->
    <span class="fr color-fff cur-p ml32 f-size-12 cancle" @click="logout">注销</span>
    <span class="fr color-fff f-size-12">{{userInfo.username}}</span>
    <el-dropdown placement="bottom" class="fr">
      <div class="logo fr">
        <svg class="icon f-size-24 color-fff" aria-hidden="true">
          <use xlink:href="#icon-touxiang"></use>
        </svg>
        <i v-show="dataList.length > 0">{{total}}</i>
      </div>
      <el-dropdown-menu class="head-drop-menu" :class="menu === 'home' ? 'home-drop-menu' : ''" slot="dropdown">
        <el-dropdown-item v-for="item in dataList" :key="item.Id">
          <div class="head-dropdown-item" @click="detail(item)">
            <div class="color-000" :class="menu === 'home' ? 'color-fff' : ''">
              {{item.AuditType === 0 ? '上链审核' : '合约审核'}}【{{getStatus(item)}}】：{{item.AuditName}}
            </div>
            <div class="f-size-12 color-grey">{{item.CreateTime | formDate}}</div>
          </div>
        </el-dropdown-item>
        <h5 v-show="dataList.length > 0" class="head-read-more" @click="readMore">查看更多 +</h5>
      </el-dropdown-menu>
    </el-dropdown>
    
  </div>
</template>
<script>
  import moment from 'moment'
  import _ from 'lodash'
  import { mapState, mapMutations, mapActions } from 'vuex'
	import ServerAddress from '../../api/serverAddress.js'
	import http from '../../api/http.js'
	import api from '../../api/api.js'
  export default {
    name: 'webHeader',
    data () {
      return {
        userInfo: JSON.parse(api.getLS('userInfo'))
      }
    },
    methods: {
      ...mapMutations([
        'CHANGE_USER_INFO'
      ]),
      ...mapActions([
        'getMessageList'
      ]),
      logout() {
        api.clearLS();
        this.$router.push('/login');
      },
      //获取数据列表
			async getData() {
				const userInfo = JSON.parse(api.getLS('userInfo'))
				const params = {
					address: userInfo.address,
					StartDate: 0,
					EndDate: 0,
					role: userInfo.role.join(','),
					page: 1,
					size: 1000,
				}
				let response;
				try {
					response = await http(ServerAddress.messageSearch, params, 'post')
          const { data: { Details = [], Page, Size, Total } } = response.data;
          const filter = _.filter(Details, x => x.MsgStatus === 0)
          const dataList = filter.slice(0, 5);
					Object.assign(this, {
            // dataList,
            Total: filter.length,
					})
				} catch (e) {
					console.log(e)
				}
      },
      readMore() {
        this.$router.push('/newsList');
      },
      //详情
			async detail(message) {
				if (message.AuditType === 0) {
					this.$router.push(`/directoryCheck/${message.AuditId}`);
				} else {
					if (message.AuditStatus === 0) {
						this.$router.push({
							path: 'contractCheck',
							query: {
								id: message.AuditId
							}
						})
					} else {
						this.$router.push({
							path: 'myContract',
							query: {
								id: message.AuditId
							}
						})
					}
				}
				if (message.MsgStatus === 0) {
					const params = {
						id: message.Id,
						status:1
					}
					await http(ServerAddress.messageUpdateStatus, params, 'post')
          this.getMessageList();
				}
      },
      // 跳转入口
      toEntry() {
        this.$router.push('/entry');
      },
      // 获取状态
			getStatus(message) {
				if (message.AuditType === 0) {
					switch (message.AuditStatus) {
						case 0:
							return '未提交审核'
						case 1:
							return '审核中'
						case 2:
							return '审核通过'
						case 3:
							return '驳回'
						default:
							break;
					}
				} else {
					switch (message.AuditStatus) {
						case 0:
							return '审核中'
						case 1:
							return '审核通过'
						case 2:
							return '驳回'
						default:
							break;
					}
				}
			},
    },
    created() {
      // this.getData();
      this.getMessageList();
      const userInfo = JSON.parse(api.getLS('userInfo'));
      if (!userInfo) {
        this.$router.push('/login');
      }
      this.CHANGE_USER_INFO(userInfo);
    },
    computed: {
      ...mapState({
        dataList: state => state.header.dataList,
        total: state => state.header.total,
        menu: state => state.menu.menu
      })
    },
    filters: {
      formDate(time) {
        if (time) {
          time = time * 1000;
          return moment(time).format('YYYY-M-D HH:mm:ss')
        }
      }
    },
    components: {
    }
  }
</script>
<style lang="less">
  .color-6D93FF {
    color: #6D93FF;
  }
  .header {
    width: 100%;
    height: 58px;
    line-height: 58px;
    padding: 0 30px;
    background: #1F2E49;
    box-sizing: border-box;
    .enter-icon{
      vertical-align: middle;
      /* color: #6D93FF; */
    }
    .enter{
      font-size: 12px;
      letter-spacing: 0.91px;
      margin-left: 15px;
    }
    .cancle{
      opacity: 0.65;
      
    }
    &.home-header {
      border-left: 1px solid #404F73
    }
    .logo {
      width: 60px;
      height: 60px;
      margin-top: 3px;
      /* background-color: #fff; */
      border-radius: 50%;
      position: relative;
      i {
        position: absolute;
        right: 26px;
        top: 8px;
        width: 18px;
        height: 18px;
        line-height: 18px;
        text-align: center;
        box-sizing:border-box;
        color: #fff;
        background: #D62121;
        border-radius: 50%;
        font-size: 12px;
      }
    }
  }
  .head-drop-menu {
    &.home-drop-menu {
      background-color: #112451;
      color: #fff;
      .head-read-more {
        color: #fff;
      }
      .el-dropdown-menu__item {
        &:hover {
          background-color: #112451;
        }
      }
    }
    &.el-popper {
      margin-top: 0px;
      margin-right: 30px;
      width: 300px;
    }
    &.el-dropdown-menu--small {
      padding: 0;
    }
    .el-dropdown-menu__item {
      padding: 0;
      width: 300px;
    }
    .popper__arrow {
      display: none;
    }
    .head-dropdown-item {
      box-sizing: border-box;
      width: 300px;
      padding: 18px 20px;
      border-bottom: 1px solid #DEE0E4 ;
    }
    .head-read-more {
      width: 100%;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #2159D6;
      font-size: 16px;
      cursor: pointer;
    }
  }
</style>