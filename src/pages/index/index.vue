<template>
  <div class="page">
    <div class="page-content dis-flex overflow-h" ref="container" :class="menu === 'home' ? 'home-contet' : ''">
      <div class="page-menu">
        <navMenu type="1"/>
      </div>
      <div class="market-list-box">
      <WebHead/>
        <router-view></router-view>
      </div>
    </div>
    <transition name="fade" >
      <div ref="resourceBar" class="resource-bar clear" v-show="mixResource.length > 0 && menu !== 'contractStart'">
        <div class="ml40 fl">
          <div class="resource-item clear" v-for="item in mixResource" :key="item.id">
            <div class="fl clear">
              <svg class="icon ml20 f-size-32 fl mt16" aria-hidden="true">
                <use :xlink:href="getResourceIcon(item)"></use>
              </svg>
              <div class="resource-name">{{ item.name }}</div>
            </div>
            <i class="el-icon-close close-item-icon" @click="delResource(item)"></i>
          </div>
        </div>
        <div class="fr">
          <div class="close-resource-bar" @click="delAllResource">关闭</div>
          <el-button class="commit-resource" type="primary" @click="commitResource">发起组合合约</el-button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
  import WebHead from '../common/header.vue'
  import navMenu from '../common/navMenu.vue'
  import api from '../../api/api.js'
  export default {
    name: 'index',
    components: {
      WebHead,
      navMenu
    },
    data () {
      return { 
        
      }
    },
    beforeRouteLeave (to, from, next) {
      window.removeEventListener('resize', this._resize);
      next();
    },
    methods: {
      ...mapMutations([
        'CLEAR_RESOURCE_ITEM',
        'DEL_RESOURCE'
      ]),
      // 浏览器resize
      _resize() {
        this.$refs.container.style.minHeight = (document.body.clientHeight - 60) + 'px';
        if (document.body.clientWidth < 1280) {
          this.$refs.resourceBar.style.width = 1280 - 250 + 'px';
        } else {
          this.$refs.resourceBar.style.width = (document.body.clientWidth - 250) + 'px';
        }
      },
      // 删除资源
      delResource(resource) {
        this.DEL_RESOURCE(resource);
      },
      // 删除全部资源
      delAllResource() {
        this.$confirm('<h4>已有资源被添加至组合合约，退出后已选择的资源将被清空，是否确定退出？</h4>', '', {
					confirmButtonText: '是',
					cancelButtonText: '否',
          type: 'warning',
          showClose: false,
          dangerouslyUseHTMLString: true,
          customClass: 'message-box-class',
          cancelButtonClass: 'message-cancel-button',
          confirmButtonClass: 'message-confirm-button',
          iconClass: 'el-icon-question color-FAAD14'
				}).then(() => {
					this.CLEAR_RESOURCE_ITEM();
        }).catch(() => {
				});
      },
      // 获取对应icon
      getResourceIcon(resource) {
        if (resource.type === 1) {
          return '#icon-data'
        } else if (resource.type === 2) {
          return '#icon-algorithm'
        } else {
          return '#icon-compute'
        }
      },
      // 发起组合合约
      commitResource() {
        let count = 0;
        this.mixResource.forEach(item => {
          if (item.type === 1 || item.type === 2 || item.type === 3) {
            count++;
          }
        });
        if (count < 3) {
          this.$message.error('发起组合合约必须选择一个数据资源、一个算法资源和一个算力资源！');
        } else {
          const json = JSON.stringify(this.mixResource);
          api.setSS('resource', json);
          this.$router.push({path: '/contractStart', query: {path: this.pathType}});
        }
      }
    },
    mounted() {
      const userInfo = JSON.parse(api.getLS('userInfo'));
      if (userInfo) {
        window.addEventListener('resize', this._resize, false);
        this.$refs.container.style.minHeight = (document.body.clientHeight - 60) + 'px';
        if (document.body.clientWidth < 1280) {
          this.$refs.resourceBar.style.width = 1280 - 250 + 'px';
        } else {
          this.$refs.resourceBar.style.width = (document.body.clientWidth - 250) + 'px';
        }
      }
    },
    computed: {
			...mapState({
				menu: state => state.menu.menu,
				mixResource: state => state.resource.mixResource,
				pathType: state => state.resource.pathType
			})
		},
  }
</script>

<style lang="less">
  .page {
    min-width: 1280px;
    height: 100%;
    overflow-y: hidden;
    .page-content {
      min-width: 1280px;
      display: flex;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      overflow: hidden;
      &.home-contet {
        background-color: #191A2F;
      }
      & > div {
        width: 100%;
      }
      .page-menu {
        width: auto;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        background: #041233;
      }
      .market-list-box {
        overflow:auto;
        flex: 1;
        /* margin-bottom: 80px; */
        position: relative;
      }
    }
    .resource-bar {
      position: absolute;
      left: 250px;
      bottom: 0;
      width: auto;
      height: 120px;
      background-color: #fff;
      z-index: 999;
      box-shadow: 0 -2px 2px #ccc;
      .resource-item {
        width: 298px;
        border-right: 1px solid #ccc;
        height: 70px;
        line-height: 70px;
        margin-top: 25px;
        border: 1px solid #CCCCCC;
        border-radius: 8px;
        float: left;
        margin-right: 20px;
        .resource-name {
          width: 190px;
          float: left;
          white-space:nowrap;
          overflow:hidden;
          text-overflow:ellipsis;
          margin-left: 10px;
        }
        .close-item-icon {
          float: right;
          width: 37px;
          height: 70px;
          line-height: 70px;
          text-align: center;
          background-color: #ccc;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          border-radius: 0 8px 8px 0;
        }
      }
      .close-resource-bar {
        text-align: right;
        margin-right: 40px;
        font-size: 12px;
        margin-top: 12px;
        cursor: pointer;
      }
      .commit-resource {
        width: 150px;
        height: 50px;
        margin-right: 40px;
        margin-top: 12px;
      }
    }
  }
  
</style>
  