<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  
export default {
  name: 'App',
}
</script>

<style lang="less">
  @import './assets/css/main.less';
  @import './assets/css/element.less';
  *{
    padding: 0;
    margin: 0;
  }
  html, body{
    /* webkit-overflow-scrolling : touch; */
    height: 100%;
    margin: 0;
  }
  #app {
    font-family: 'Microsoft YaHei';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
  }
  .icon {
    width: 1em; height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }

</style>
