import { loadWaterFactorySelect, getProductionFillList,saveProductionFill,calculateTargetValue } from '../services/remoteData';

const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId:'',//水厂
    dateValue : moment().format('YYYY-MM-DD') // 时间选择
};


const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    queryParams: { ...initQueryParams }, // 查询列表参数
    loading: false, // 列表是否loading
    id:'',
    waterFactoryName:'',
    dataSource: [], // 列表数据源
    waterFactorySelect:[],
    showUploadModal: false,//导入显示隐藏
    importError: '',//导入报错信息
};

export default {

    namespace: 'assayFill', // 化验数据填报

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/assayFill') {
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
            } = yield select(({ assayFill }) => assayFill);
            let params = {
                ...queryParams,
                dataFillType :"assay",
            };
            const { data } = yield call(getProductionFillList, VtxUtil.submitTrim(params));
            let dataSource = [], status = false, id = '', waterFactoryName='';
            
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
                    const result = data.data
                    status = true;
                    id=result.id;
                    waterFactoryName = result.waterFactoryName;
                    dataSource = result.targetLibraryList.map(item => ({
                        ...item,
                        key: item.id
                    }));
                }
            }
            let uState = {
                id,
                waterFactoryName,
                dataSource,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = { ...uState, ...payload });
            yield put({
                type: 'updateState',
                payload: { ...uState }
            })
        },
        //保存或修改
        *saveOrUpdate({ payload = {} }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            const { dataStatus} = payload;
            const { queryParams,id, dataSource }=yield select(({ assayFill }) => assayFill);
            const {dateValue,waterFactoryId} = queryParams;
            const { data } = yield call(saveProductionFill,{
                id,
                dateValue,
                waterFactoryId,
                dataStatus,
                dataType:'assay',
                tenantId: VtxUtil.getUrlParam('tenantId'),
                dataFillDetailJson: JSON.stringify(dataSource)
            })
            if (!!data && !data.result) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'保存失败');
            }
        },
        //计算非原始指标
        *calculateTargetValue({ payload = {} }, { call, put, select }) {
            const { dataSource } = yield select(({ assayFill }) => assayFill);
            const {data} = yield call(calculateTargetValue,{
                tenantId: VtxUtil.getUrlParam('tenantId'),
                dataFillDetailJson: JSON.stringify(dataSource)
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload:{
                            dataSource: data.data
                        }
                    })
                }
                
                // yield put({ type: 'getList' });
            } else {
            }
        }

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