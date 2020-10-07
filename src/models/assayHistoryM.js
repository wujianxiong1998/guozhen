import { loadWaterFactorySelect, getFillHistory } from '../services/remoteData';

const u = require('updeep');
import {message} from 'antd';
import _ from 'lodash'
import moment from 'moment';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId:'',//水厂
    startTime: moment().startOf('month').format('YYYY-MM-DD'),//开始时间
    endTime: moment().format('YYYY-MM-DD'),//结束时间
};


const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    queryParams: { ...initQueryParams }, // 查询列表参数
    loading: false, // 列表是否loading
    title:[],
    dataSource: [], // 列表数据源
    waterFactorySelect:[]
};

export default {

    namespace: 'assayHistory', // 化验数据填报历史

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/assayHistory') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                   
                }
            })
        }
    },

    effects: {
        // 选择水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactorySelect: data.data,
                            searchParams:{
                                waterFactoryId:data.data[0]?data.data[0].id:''
                            },
                            queryParams:{
                                waterFactoryId: data.data[0] ? data.data[0].id : ''
                            }
                        }
                    })
                }
            }
        },
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            let {
                queryParams
            } = yield select(({ assayHistory }) => assayHistory);
            let params = {
                ...queryParams,
                dataFillType :"assay",
            };
            const { data } = yield call(getFillHistory, VtxUtil.submitTrim(params));
            let dataSource = [],title=[], status = false;
            
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.resultList) && Array.isArray(data.data.titleName)) {
                    const result = data.data;
                    status = true;
                    dataSource = result.resultList;
                    title = result.titleName;

                    if(result.titleName&&result.titleName.length===0){
                        message.warn('该水厂未配置指标')
                    }
                }
            }
            let uState = {
                dataSource,
                title,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = { ...uState, ...payload });
            yield put({
                type: 'updateState',
                payload: { ...uState }
            })
        },

    },

    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },

        updateQueryParams(state, action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                queryParams: queryParams
            }
        },

        initQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                searchParams: initQueryParams,
                queryParams: initQueryParams
            }
        },
    }
}