import { CHANGE_USER_INFO } from './mutation-types';
const user = {
  state: {
    userInfo: 0,
  },
  mutations: {
    [CHANGE_USER_INFO] (state, info) {
      state.userInfo = info;
    },
  },
  actions: {

  },
};

export default user;
