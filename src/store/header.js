import { CHANGE_MESSAGE_LIST } from './mutation-types';
import api from '../api/api'
import http from '../api/http'
import ServerAddress from '../api/serverAddress'
const header = {
  state: {
    dataList: [],
    total: 0,
  },
  mutations: {
    [CHANGE_MESSAGE_LIST] (state, payload) {
      state.dataList = payload.dataList;
      state.total = payload.total;
    },
  },
  actions: {
    async getMessageList ({ commit }) {
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
        const { data: { Details = [] } } = response.data;
        const filter = _.filter(Details, x => x.MsgStatus === 0)
        const dataList = filter.slice(0, 5);
        const payload = {
          dataList,
          total: filter.length
        }
        commit('CHANGE_MESSAGE_LIST', payload);
      } catch (e) {
        console.log(e)
      }
    }
  },
};

export default header;
