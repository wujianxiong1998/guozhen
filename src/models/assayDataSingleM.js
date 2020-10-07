import { getProductionDataList,getAssaySingleChart} from '../services/produtionService';
import { loadBusinessUnitSelect, loadWaterFactorySelect } from '../services/remoteData'
const u = require('updeep');
import _ from 'lodash';
import moment from 'moment'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    businessUnitId: undefined, // 事业部
    waterFactoryId:undefined,//运营厂
    startTime: moment().format('YYYY-MM-DD'), // 开始时间
    endTime: moment().format('YYYY-MM-DD'),// 结束时间
};



const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    queryParams: { ...initQueryParams }, // 查询列表参数
    businessUnitList: [], // 事业部下拉数据
    waterFactorySelect: [],// 水厂下拉
    currentPage: 1, // 页码
    pageSize: 10, // 每页条数
    loading: false, // 列表是否loading
    title:[],
    dataSource: [], // 列表数据源
    total: 0, // 列表总条数
    selectedRowKeys: [],
    chartItem:{
        name: '',//指标名称
        unit: '',//单位
        visible: false,
        xList: [],
        data: {},
    }
};

export default {

    namespace: 'assayDataSingle', // 化验数据（单厂）

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/assayDataSingle') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    // 请求事业部下拉数据
                    dispatch({ type: 'getBusinessUnitSelect' });
                    dispatch({ type: 'loadWaterFactorySelect' });
                }
            })
        }
    },

    effects: {
        // 获取事业部下拉
        *getBusinessUnitSelect({ payload = {} }, { call, put, select }) {
            const { data } = yield call(loadBusinessUnitSelect);
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
        // 水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data) && data.data[0]) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactorySelect: data.data,
                            searchParams: {
                                waterFactoryId: data.data[0].id
                            }
                        }
                    })
                    VtxUtil.delay(10)
                    yield put({ type: 'updateQueryParams' })
                    yield put({ type: 'getList' })
                }
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({ assayDataSingle }) => assayDataSingle);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                dataType:'assay',
                mfOrSf:'sf',
                page: currentPage - 1,
                size: pageSize
            };
            const { data } = yield call(getProductionDataList, VtxUtil.submitTrim(params));
            let dataSource = [], title = [], total = 0, status = false;
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.data) && Array.isArray(data.data.title)) {
                    status = true;
                    title = data.data.title
                    dataSource = data.data.data.map(item => ({
                        ...item,
                        // key: item.id
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                title,
                total,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = { ...uState, ...payload });
            yield put({
                type: 'updateState',
                payload: { ...uState }
            })
        },
        *getAssaySingleChart({ payload = {} }, { call, put, select }) {
            const {codes,unit} = payload;
            let { queryParams } = yield select(({ assayDataSingle }) => assayDataSingle);
            const {data} = yield call(getAssaySingleChart,{
                dataType:'assay',
                codes,
                ...queryParams
            })
            if(data&&!data.result){
                yield put({
                    type:'updateState',
                    payload:{
                        chartItem: {
                            unit,//单位
                            xList: data.data.xData,
                        }
                    }
                })
                yield put({
                    type:'updateChartData',
                    payload:
                       data.data.yData,
                })
            }
        }
    },

    reducers: {
        updateChartData(state,action){
            return u({chartItem:{data:u.constant(action.payload)}},state)
        },
        updateState(state, action) {
            return u(action.payload, state);
        },

        updateQueryParams(state, action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                selectedRowKeys: [],
                currentPage: 1,
                queryParams: queryParams
            }
        },

        initQueryParams(state, action) {
            const { waterFactorySelect } = state
            const firstWaterFactory = waterFactorySelect[0].id
            return {
                ...state,
                ...action.payload,
                currentPage: 1,
                pageSize: 10,
                searchParams: {
                    ...initQueryParams,
                    waterFactoryId: firstWaterFactory
                },
                queryParams: {
                    ...initQueryParams,
                    waterFactoryId: firstWaterFactory
                },
            }
        },
    }
}