import API from '@/utils/api';

const user = {
    name: 'user',
    state: {
        vipInfo: {
            is_valid: false,
            vip_level_int: 0,
            is_experience: false,
            isValidVip: false, // 是否vip
            isVip1: false, // 是否尊享版vip
            isVip2: false, // 是否专业版vip
            isExperienceVip: false, // 是否已过期vip
        },
        userInfo: {
            user_id: undefined,
            nick_name: undefined,
            register_platform: undefined,
            register_channel: undefined,
            bind_mobile: undefined
        },
        scoreInfo: {

        }
    },
    reducers: {
        getVipAndUserInfoSuc(state, { vip_info, user_info }) {
            state.vipInfo = vip_info;
            state.userInfo = user_info;
            return state;
        },
        getScoreInfoSuc(state, payload) {
            state.scoreInfo = payload;
            return state;
        },
    },
    effects: {

        async getVipAndUserInfo(payload, rootState) {
            const resp = await API.get('/pay/getVipAndUserInfo', {
                ctx: payload.ctx
            });
            if (resp.code === 0) {
                this.getVipAndUserInfoSuc(
                    resp.data
                );
            }
        },

        async getScoreInfo(payload, rootState) {
            const resp = await API.get('/pay/getScoreInfo', {
                ctx: payload.ctx
            });
            if (resp.code === 0) {
                this.getScoreInfoSuc(
                    resp.data
                );
            }
        },
    },

};


export default user;
