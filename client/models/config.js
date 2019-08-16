import API from '@/utils/api';

const user = {
    name: 'config',
    state: {
    },
    reducers: {
        getGlobalConfigSuc(state, payload) {
            return {
                ...state,
                ...payload
            };
        },
    },
    effects: {
        
        async getGlobalConfig(payload, rootState) {
            const resp = await API.get('/locals/getGlobalConfig', {
                ctx: payload.ctx
            });
            if (resp.code === 0) {
                this.getGlobalConfigSuc(
                    resp.data
                );
            }
        },
    },

};


export default user;
