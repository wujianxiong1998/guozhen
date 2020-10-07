import React from 'react';

import { VtxUtil } from '../../utils/util';
import { getAccessControl } from '../../services/commonIFS';
/**
 * @module accessControlM
 * @desc 权限控制
 * @author zzz
*/

export default {

    namespace: 'accessControlM',

    /**
     * @name state
     * @prop {obj}
    */
    state: {
        otherData: [],
    },

    subscriptions: {
        setup({ dispatch, history }) {
            history.listen(({ pathname }) => {
                dispatch({ type: 'getAccessControl' });
            });
        },
    },

    effects: {
        /**
         * @method getAccessControl 获取权限.
         * @description 调用获取权限接口
         */
        *getAccessControl({ payload }, { select, put, call }) {
            const [{data}] = yield [call(getAccessControl, { userId: VtxUtil.getUrlParam('userId'), systemCode: VtxUtil.getUrlParam('systemCode') })]
            let accessControlState = {};
            if (data && data.result == 0) {
                data.data.map(
                    (item, index) => {
                        let splitArrs = item.code.split('_');
                        let pageName = splitArrs[2];
                        let accessBtnName = null;
                        accessBtnName = splitArrs[4] ? splitArrs[3] + '_' + splitArrs[4] : splitArrs[3];
                        let _pageName = pageName ? pageName.toLowerCase() : '';
                        accessControlState[_pageName] = {
                            ...accessControlState[_pageName],
                            [accessBtnName]: true
                        }
                    }
                )
                yield put({
                    type: 'updateState',
                    payload: {
                        ...accessControlState,
                    }
                });
            }
        },
    },

    reducers: {
        updateState(state, action) {
            return { ...state, ...action.payload };
        },
    }
}
