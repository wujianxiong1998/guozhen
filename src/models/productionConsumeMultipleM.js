import { getProductionDataList} from '../services/produtionService';
import { loadBusinessUnitSelect, loadRegionalCompanySelect } from '../services/remoteData'
const u = require('updeep');
import _ from 'lodash';
import moment from 'moment'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    businessUnitId: undefined, // 事业部
    regionalCompanyId:undefined,
    startTime: moment().format('YYYY-MM-DD'), // 开始时间
    endTime: moment().format('YYYY-MM-DD'),// 结束时间
};



const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    queryParams: { ...initQueryParams }, // 查询列表参数
    businessUnitList: [], // 事业部下拉数据
    regionalCompanySelect: [],// 区域公司下拉
    currentPage: 1, // 页码
    pageSize: 10, // 每页条数
    loading: false, // 列表是否loading
    title:[],
    dataSource: [], // 列表数据源
    total: 0, // 列表总条数
    selectedRowKeys: [],
};

export default {

    namespace: 'productionConsumeMultiple', // 生产单耗（多厂）

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/productionConsumeMultiple') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    dispatch({ type: 'getList' });
                    // 请求事业部下拉数据
                    dispatch({ type: 'getBusinessUnitSelect' });
                    dispatch({ type: 'loadRegionalCompanySelect' });
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
        // 区域公司下拉
        *loadRegionalCompanySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadRegionalCompanySelect);
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

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({ productionConsumeMultiple }) => productionConsumeMultiple);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                dataType:'consum',
                mfOrSf:'mf',
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
                selectedRowKeys: [],
                currentPage: 1,
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