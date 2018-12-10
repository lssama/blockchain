import Vue from 'vue';
import Vuex from 'vuex';
import user from './user'
import header from './header'
import menu from './menu'
import resource from './resource'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    user,
    header,
    menu,
    resource,
  },
});
