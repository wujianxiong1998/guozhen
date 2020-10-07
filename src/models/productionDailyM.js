import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, saveOredit, deleteEntity} from '../services/exceedReason';
import {
    loadBusinessUnitSelect,
    loadCommonParamSelect,
    loadRegionalCompanySelect,
    loadWaterFactorySelect
} from "../services/remoteData";
import {deleteMessage, VtxUtil} from "../utils/util";

moment.locale('zh-cn');

const initParams = {
    report_code: 'assay',
    data_param: {
        waterFactoryIds: '',
        dataType: 'assay',
        dateValue: null,
        tenantId: VtxUtil.getUrlParam('tenantId')
    },
    report_param: {
        tenantId: VtxUtil.getUrlParam('tenantId')
    }
};

export default {
    namespace: 'productionDailyM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/productionDaily') {
                    dispatch({type: 'getBusinessUnitSelect'});
                    dispatch({type: 'loadRegionalCompanySelect'});
                    dispatch({type: 'loadWaterFactorySelect'});
                }
            });
        },
    },
    
    state: {
        businessUnitList: [],
        regionalCompanySelect: [],
        waterFactoryList: [],
        report_code: 'assay',
        waterFactoryIds: [],
        dataType: 'assay',
        dateValue: moment(),
        iframeSrc: ''
    },
    
    effects: {
        // 获取事业部下拉
        * getBusinessUnitSelect({payload = {}}, {call, put, select}) {
            const {data} = yield call(loadBusinessUnitSelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            businessUnitList: data.data
                        }
                    })
                }
            }
        },
        // 区域公司下拉
        * loadRegionalCompanySelect({payload}, {call, put, select}) {
            const {data} = yield call(loadRegionalCompanySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            regionalCompanySelect: data.data
                        }
                    })
                }
            }
        },
        // 选择水厂下拉
        * loadWaterFactorySelect({payload}, {call, put, select}) {
            const {data} = yield call(loadWaterFactorySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactoryList: data.data,
                            waterFactoryIds: [data.data[0].id]
                        }
                    });
                    yield put({type: 'changeUrl'})
                }
            }
        },
    },
    
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        clearParams(state,{payload}){
            return {
                ...state,
                waterFactoryIds: [state.waterFactoryList[0].id],
                dateValue: moment(),
            }
        },
        changeUrl(state, {payload}) {
            const {report_code, waterFactoryIds, dataType, dateValue} = state;
            const params = {
                report_code,
                data_param: {
                    waterFactoryIds: waterFactoryIds.join(','),
                    dataType,
                    dateValue: !!dateValue ? dateValue.format('YYYY-MM-DD') : null,
                    tenantId: VtxUtil.getUrlParam('tenantId')
                },
                report_param: {
                    tenantId: VtxUtil.getUrlParam('tenantId')
                }
            };
            return {
                ...state,
                iframeSrc: `${reportUrl}param=${JSON.stringify(params)}&${new Date().getTime()}`
            }
        }
    }
}
