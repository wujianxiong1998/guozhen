import { getDataReportIntimeList } from '../services/produtionService';
import { loadWaterFactorySelect } from '../services/remoteData'
const u = require('updeep');
import moment from 'moment'
import _ from 'lodash'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId : '', // 水厂名称
    startTime: moment().format('YYYY-MM'), // 开始时间
    endTime: moment().format('YYYY-MM'), // 结束时间
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    waterFactorySelect : [], // 水厂名称下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
};

export default {

    namespace : 'dataReportIntime', // 数据上报审核技及时率

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/dataReportIntime') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求水厂名称下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 水厂名称下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            waterFactorySelect : data.data
                        }
                    })
                }
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({dataReportIntime}) => dataReportIntime);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getDataReportIntimeList, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map((item,index) => ({
                        ...item, 
                        key : index
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
        },

		updateQueryParams(state,action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                selectedRowKeys : [],
                currentPage : 1,
                queryParams : queryParams
            }
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                currentPage : 1,
                pageSize : 10,
				 searchParams : initQueryParams,
                queryParams : initQueryParams
            }
        },

    }
}