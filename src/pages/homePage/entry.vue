<template>
  <div class="entry">
    <div class="entry-box">
      <ul class="entry-top">
        <li :class="{'disabled' : item.disabled}" v-for="(item, index) in entryTop" :key="index" @click="routerJump(item)">
          <svg class="icon f-size-50 mt40" aria-hidden="true">
            <use :xlink:href="item.icon"></use>
          </svg>
          <div class="f-size-14 mt32">{{item.name}}</div>
        </li>
      </ul>
      <div class="entry-bottom">
        <div>
          <p class="f-size-18 color-fff mb10">主题信息</p>
          <ul class="entry-bottom-ul">
            <li :class="{'disabled' : item.disabled}" v-for="(item, index) in themeInfo" :key="index">
              <svg class="icon f-size-50 mt40" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <div class="f-size-14 mt32">{{item.name}}</div>
            </li>
          </ul>
        </div>
        <div>
          <p class="f-size-18 color-fff mb10">基础</p>
          <ul class="entry-bottom-ul">
            <li :class="{'disabled' : item.disabled}" v-for="(item, index) in base" :key="index">
              <svg class="icon f-size-50 mt40" aria-hidden="true">
                <use :xlink:href="item.icon"></use>
              </svg>
              <div class="f-size-14 mt32">{{item.name}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'entry',
    components: {
    },
    data() {
      return {
        entryTop: [
          {
            name: '可信数据共享系统',
            icon: '#icon-entry1',
            path: '/home',
            target: '_router',
            disabled: false,
          },
          {
            name: '监控系统',
            icon: '#icon-entry2',
            path: '',
            target: '_blank',
            disabled: false,
          },
          {
            name: '安全监管',
            icon: '#icon-entry3',
            path: '',
            disabled: true,
          },
          {
            name: '电子证件照',
            icon: '#icon-entry4',
            path: '',
            disabled: true,
          },
          {
            name: '区块链浏览器',
            icon: '#icon-entry5',
            path: '',
            disabled: true,
          },
          {
            name: 'BaaS',
            icon: '#icon-entry6',
            path: '',
            disabled: true,
          },
        ],
        themeInfo: [
          {
            name: '社会信用库',
            icon: '#icon-entry7',
            path: '',
            disabled: true,
          },
          {
            name: '地理信息库',
            icon: '#icon-entry8',
            path: '',
            disabled: true,
          },
          {
            name: '宏观经济库',
            icon: '#icon-entry9',
            path: '',
            disabled: true,
          },
        ],
        base: [
          {
            name: '人口基础数据库',
            icon: '#icon-entry10',
            path: '',
            disabled: true,
          },
          {
            name: '法人库',
            icon: '#icon-entry11',
            path: '',
            disabled: true,
          },
        ],
      }
    },
    methods: {
      routerJump(item) {
        if (item.target === '_blank') {
          window.open('http://www.monitor-web.zsbatech.com/#/index', '_blank');
        } else if (item.target === '_router') {
          this.$router.push(item.path);
        }
      }
    },
    created() {
    },
  }
</script>

<style lang="less">
  .entry-li {
    flex: 1;
    height: 172px;
    background: rgba(255, 255, 255, .27);
    border-radius: 12px;
    margin-right: 12px;
    text-align: center;
    color: #fff;
    cursor: pointer;
    transition: all .2s linear;
    &:nth-last-child(1) {
      margin-right: 0;
    }
    &.disabled {
      cursor: not-allowed;
      background: rgba(255, 255, 255, .1);
      color: rgba(255, 255, 255, .5);
    }
    &:hover:not(.disabled) {
      transform: translateY(-10px);
      /* box-shadow: 0 0 10px rgba(255, 255, 255, .5); */
    }
  }
  .entry {
    height: 100%;
    overflow: hidden;
    background-color: #fff;
    background: url('../../assets/imgs/login/entry.png') no-repeat;
    background-size: 100% 100%;
    position: relative;
    .entry-box {
      width: 912px;
      height: 412px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      .entry-top {
        display: flex;
        li {
          .entry-li
        }
      }
      .entry-bottom {
        display: flex;
        margin-top: 30px;
        > div {
          flex: 1;
          height: 172px;
          &:nth-child(1) {
            margin-right: 12px;
          }
        }
        .entry-bottom-ul {
          display: flex;
          li {
            .entry-li
          }
        }
      }
    }
  }
</style>