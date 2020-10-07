import { getWorkDayAndStopAnalysis, getDealWaterAnalysis, getWaterInOutAnalysis, getPowerConsumeAnalysis, getDrugAnalysis,
    getMudCakeAnalysis, getProcessChange } from '../services/produtionService';
import { loadWaterFactorySelect } from '../services/remoteData'
const u = require('updeep');
import { VtxUtil } from '../utils/util';
import _ from 'lodash'

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂名称
    date : '', // 日期
    dataType:'yxts',//月报类型
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
    title:[],
};

export default {

    namespace : 'productionMonthReport', // 生产月报

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/productionMonthReport') {
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
            } = yield select(({productionMonthReport}) => productionMonthReport);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            let tabFunc
            switch (queryParams.dataType) {
                case 'yxts':
                    tabFunc = getWorkDayAndStopAnalysis
                    break;
                case 'clsl':
                    tabFunc=getDealWaterAnalysis
                    break;
                case 'jcsz':
                    tabFunc = getWaterInOutAnalysis
                    break;
                case 'dh':
                    tabFunc = getPowerConsumeAnalysis
                    break;
                case 'yh':
                    tabFunc=getDrugAnalysis
                    break;
                case 'wnts':
                    tabFunc=getMudCakeAnalysis
                    break;
                case 'gytz':
                    tabFunc=getProcessChange
                    break;
                default:
                    break;
            }
            const { data } = yield call(tabFunc, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, status = false,title=[];
            if(!!data &&data.data && !data.result) {
                if (queryParams.dataType === 'yh' || queryParams.dataType ==='gytz'){
                    if ('data' in data.data && Array.isArray(data.data.data.rows)) {
                        status=true
                        dataSource=data.data.data.rows.map((item,index) => ({
                            ...item,
                            key: index
                        }));
                        title=data.data.title
                    }
                }else{
                    if ('data' in data && Array.isArray(data.data.rows)) {
                        status = true;
                        dataSource = data.data.rows.map((item,index) => ({
                            ...item,
                            key: index
                        }));
                        total = data.data.total;
                    }
                }
                
            }
            let uState = {
                dataSource,
                total,
                title,
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