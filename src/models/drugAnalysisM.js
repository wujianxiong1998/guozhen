const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getWaterFactoryInfo, getDrugAnalysisChart } from '../services/produtionService'
import { loadRegionalCompanySelect, loadWaterFactorySelect, getTargetLibrarySelect} from '../services/remoteData';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    startTime: moment().startOf('month').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    waterFactoryId: undefined,
    regionalCompanyId: undefined,
    libraryId:undefined
};

const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    regionalCompanySelect: [], // 区域公司下拉数据
    waterFactorySelect: [], // 选择水厂下拉数据
    drugNameSelect:[],//药剂名称下拉
    waterFactoryInfo: {
        processSize: "",//处理水量
        processTypeName: "",//处理工艺
        productTypeName: "",//项目类型
        waterFactoryName: "",//当天水厂
        workDayNum: ""//运行天数
    },
    loading:false,
    xList:[],
    yDrugCost:[],
    yDrugConsume:[],
};
export default {

    namespace: 'drugAnalysis', // 药耗分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/drugAnalysis') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    // 请求区域公司下拉数据
                    dispatch({ type: 'loadRegionalCompanySelect' });
                    // 请求选择水厂下拉数据
                    dispatch({ type: 'loadWaterFactorySelect' }).then(()=>{
                        dispatch({ type: 'loadDrugSelect' });
                    }).then(()=>{
                        dispatch({ type: 'getData' })
                    });
                    
                    

                }
            })
        }
    },
    effects: {
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

        // 选择水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactorySelect: data.data,
                            searchParams: {
                                waterFactoryId: data.data[0] ? data.data[0].id : ''
                            }
                        }
                    })
                    VtxUtil.delay(10)
                    yield put({ type: 'getWaterFactoryInfo' })
                }
            }
        },
        //获取水厂信息
        *getWaterFactoryInfo({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ drugAnalysis }) => drugAnalysis)
            const { waterFactoryId } = searchParams
            const { data } = yield call(getWaterFactoryInfo, {
                waterFactoryId
            })
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        waterFactoryInfo: data.data
                    }
                })
            }
        },
        //药剂名称下拉
        *loadDrugSelect({ payload }, { call, put, select }) {
            const { data } = yield call(getTargetLibrarySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            drugNameSelect: data.data
                        }
                    })
                }
            }
        },
        //获取数据
        *getData({payload},{call,put,select}){
            const { searchParams } = yield select(({ drugAnalysis }) => drugAnalysis)
            const { startTime, endTime, waterFactoryId, regionalCompanyId, libraryId
                } = searchParams
            yield put({
                type:'updateState',
                payload:{
                    loading:true
                }
            })
            const {data} = yield call(
                getDrugAnalysisChart,{
                    startTime, endTime, waterFactoryId, libraryId
                }
            )
            yield put({
                type: 'updateState',
                payload: {
                    loading: false
                }
            })
            if (!!data && !data.result&&data.data) {
                yield put({
                    type:'updateState',
                    payload:{
                        xList:data.data.xDate||[],
                        yDrugConsume:data.data.yDrugConsume||[],
                        yDrugCost:data.data.yDrugCost||[]
                    }
                })
            }
        }
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },
        initQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                searchParams: initQueryParams,
            }
        },
    }
}