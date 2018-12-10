import { Message, MessageBox } from 'element-ui';
import { ADD_RESOURCE_ITEM, CLEAR_RESOURCE_ITEM, DEL_RESOURCE, CHANGE_PATH } from './mutation-types';
const menu = {
  state: {
    mixResource: [],
    pathType: 1,
  },
  mutations: {
    [ADD_RESOURCE_ITEM] (state, resource) {
      const index = state.mixResource.findIndex(x => x.id === resource.id)
      if (index > -1) {
        if (state.mixResource[index].id === resource.id) {
          Message.error('资源已经添加至组合合约，请勿重复添加！');
        }
      } else {
        const typeIndex = state.mixResource.findIndex(x => x.type === resource.type)
        if (typeIndex > -1) {
          MessageBox.confirm('<h4>目前支持选择一个数据资源、一个算法资源、一个算力资源的组合合约，暂未开放多个组合的功能，是否替换已选择的资源？</h4>', '', {
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
            state.mixResource.splice(typeIndex, 1, resource);
          }).catch(() => {
          });
        }
        if (typeIndex === -1 && index === -1) {
          state.mixResource.push(resource);
        }
      }
    },
    [DEL_RESOURCE] (state, resource) {
      const index = state.mixResource.findIndex(x => x.id === resource.id)
      state.mixResource.splice(index, 1);
    },
    [CLEAR_RESOURCE_ITEM] (state) {
      state.mixResource = [];
    },
    [CHANGE_PATH] (state, type) {
      state.pathType = type;
    }
  },
  actions: {
    
  },
};

export default menu;
