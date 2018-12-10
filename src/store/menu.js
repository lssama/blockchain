import { CHANGE_MENU } from './mutation-types';
const menu = {
  state: {
    menu: 0,
  },
  mutations: {
    [CHANGE_MENU] (state, menu) {
      state.menu = menu;
    },
  },
  actions: {

  },
};

export default menu;
