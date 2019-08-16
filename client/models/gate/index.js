// import Api from '../request';
import API from '@/utils/api';

const gate = {
  name: 'gate',
  state: {
    banners: [],
    doors: []
  },
  reducers: {
    receiveVipInfo(state, payload) {
      state.vipInfo = payload;
      return state;
    },
    increment(state, payload) {
      return {
        ...state,
        couter: state.couter + payload,
      };
    },
    getGateConfigSuc(state, data) {
      return state;
    },
  },
  effects: {
    async getGateConfig(payload) {
      const resp = await API.get('/locals/getLocalConfig', {
        name: 'articleTypes',
        ...payload
      });
      if (resp.code === 0) {
        this.getGateConfigSuc(resp.data);
      }
    },
    async incrementAsync(payload) {
      await new Promise(resolve => setTimeout(resolve, 300));
      this.increment(payload);
    },
  },

};


export default gate;
