<template>
  <div class="menu-page" ref="menuPage">
    <el-menu :router="true" :default-active="defaultActive" :default-openeds="defaultOpeneds">
      <div class="menu-page-sub-menu" v-for="(subMenu, index) in menuList" :key="subMenu.index" :index="subMenu.index">
        <template v-if="subMenu.children">
          <el-submenu :index="subMenu.index">
            <template slot="title">
              <svg class="icon mr10 f-size-18" aria-hidden="true">
                  <use :xlink:href="subMenu.icon"></use>
              </svg>
              <!-- <span v-show="!isCollapse">{{subMenu.title}}</span> -->
              {{subMenu.title}}
            </template>
            <el-menu-item-group>
              <el-menu-item :index="menuItem.index.toString()" v-for="(menuItem, index) in subMenu.children" :key="menuItem.index">
                {{menuItem.title}}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </template>
        <template v-else-if="subMenu.index">
          <el-menu-item class="sub-main-item" :index="subMenu.index" >
            <svg class="icon mr10 f-size-18" aria-hidden="true">
              <use :xlink:href="subMenu.icon"></use>
            </svg>
            <!-- <span v-show="!isCollapse">{{subMenu.title}}</span> -->
            {{subMenu.title}}
          </el-menu-item>
        </template>
        
      </div>
      <!-- <template> -->
        <div>

          <span class="newAPIPage" @click="apiPage()" target="_blank">
              <!-- <el-menu-item class="sub-main-item"> -->
              <svg class="icon mr10 f-size-18" aria-hidden="true">
                <use xlink:href="#icon-api"></use>
              </svg>
              API服务
            <!-- </el-menu-item> -->
          </span>
        </div>
          <!-- <el-menu-item class="sub-main-item"  index>
              {{subMenu.title}}
            </el-menu-item> -->
        <!-- </template> -->
    </el-menu>
    <!-- <i class="el-icon-arrow-left menu-collapse" @click="collapse"></i> -->
  </div>
</template>

<script>
  import { mapMutations, mapState } from 'vuex'
  import api from '../../api/api.js'
  export default {
    name: 'navMenu',
    data() {
      return {
        defaultActive: '',
        isCollapse: true,
        defaultOpeneds: [],
        menuList: [
          {
            title: '首页',
            index: '/home',
            icon: '#icon-homePage'
          },
          {
            title: '资源广场',
            index: '/0',
            icon: '#icon-dataMall',
            children: [
              {
                title: '数据资源',
                index: '/resourceMall/1',
              },
              {
                title: '算法资源',
                index: '/resourceMall/2',
              },
              {
                title: '算力资源',
                index: '/resourceMall/3',
              },
            ]
          },
          {
            title: '资源管理',
            index: '1',
            icon: '#icon-onChain',
            children: [
              {
                title: '资源上链',
                index: '/directoryOnChain',
              },
              {
                title: '我的资源',
                index: '/directoryManagement',
              },
              {
                title: '资源审核',
                index: '/directoryCheckList',
              },
            ]
          },
          {
            title: '合约管理',
            index: '2',
            icon: '#icon-constract',
            children: [
              {
                title: '我的合约',
                index: '/myContract',
              },
              {
                title: '合约审核',
                index: '/contractCheck',
              },
              {
                title: '被订阅的合约',
                index: '/contractMonitor',
              },
              // {
              //   title: '发起合约',
              //   index: '2-4',
              // },
            ]
          },
          {
            title: '系统管理',
            index: '3',
            icon: '#icon-setting',
            children: [
              {
                title: '分类管理',
                index: '/listManagement',
              },
              {
                title: '机构管理',
                index: '/agencyManagement',
              },
              {
                title: '用户管理',
                index: '/userManagement',
              },
            ]
          },
          {
            title: '我的消息',
            index: '/newsList',
            icon: '#icon-message',
          },
          {
            title: 'API服务',
            index: '',
            icon: '#icon-api',
          },
        ],
      }
    },
    watch: {
      '$route'(value) {
        this.defaultActive = this.$route.path;
        this.CHANGE_MENU(this.$route.name)
      },
    },
    methods: {
      ...mapMutations([
        'CHANGE_MENU'
      ]),
      _resize() {
        this.$refs.menuPage.style.height = (document.body.clientHeight - 60) + 'px';
      },
      collapse() {
        this.isCollapse = !this.isCollapse;
      },
      apiPage(){
        window.open('/static/switchAPI.html');
      }
    },
    props: {
      type: {
        required: true,
        type: String,
        default: '1'
      }
    },
    created() {
      this.defaultActive = this.$route.path;
    },
    mounted() {
      const userInfo = JSON.parse(api.getLS('userInfo'));
      if (userInfo) {
        window.addEventListener('resize', this._resize, false);
        this.$refs.menuPage.style.height = (document.body.clientHeight - 60) + 'px';
      }
      this.CHANGE_MENU(this.$route.name)
    },
    components: {
    },
    computed: {
      ...mapState({
      })
    },
    beforeDestroy() {
      window.removeEventListener('resize', this._resize);
    },
  }
</script>

<style lang="less">
  .menu-page {
    overflow-y: auto;
    position: relative;
    height: 815px;
    padding-top: 40px;
    .menu-page-sub-menu {
      margin-top: 35px;
    }
    .menu-collapse {
      position: absolute;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      left: 0;
      bottom: 0;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
    }
    .page-title {
      height: 80px;
      line-height: 80px;
      text-align: center;
      color: #fff;
      font-size: 20px;
      cursor: pointer;
      /* background: url('../../assets/imgs/data_market/title_bg.png') no-repeat; */
    }
    .el-menu {
      border-right: none;
      background: transparent;
      width: 250px;
      .el-submenu__title {
        text-align: left;
        padding-left: 40px !important;
        border-radius: 2px;
        color: #fff;
        &:hover {
          background-color: #2159D6;
        }
      }
      .el-menu-item {
        border-radius: 2px;
        color: #fff;
        padding-left: 82px !important;
        &:hover {
          background-color: #2159D6;
          color: #fff;
        }
        &.sub-main-item {
          padding-left: 40px !important;
        }
      }
      .el-menu-item-group__title {
        display: none
      }
      .el-menu-item.is-active {
        background-color: #2159D6;
        color: #fff;
      }
    }
    .newAPIPage{
      color: #fff;
      display: inline-block;
      width: 100%;
      background: #041233;
      padding-left: 40px !important;
      font-size: 14px;
      padding-top: 20px;
      padding-bottom: 20px;
      cursor: pointer;
      border-radius: 2px;
      box-sizing: border-box;
    }
    /* .newAPIPage:visited { 
    color:red; 
    text-decoration:none; 
    }  */
    .newAPIPage:hover { 
      /* color: #fff;
      display: inline-block; */
      background: #2159D6;
    }
  }
</style>