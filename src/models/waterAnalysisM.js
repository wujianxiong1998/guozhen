const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getWaterAnalysisInfo,getWaterAnalysisChart,getWaterFactoryInfo} from '../services/produtionService'
import { loadRegionalCompanySelect, loadWaterFactorySelect, } from '../services/remoteData';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    timeType: 'month',
    startTime: moment().startOf('month').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    waterFactoryId: undefined,
    regionalCompanyId: undefined,
};

const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    regionalCompanySelect: [], // 区域公司下拉数据
    waterFactorySelect: [], // 选择水厂下拉数据
    waterFactoryInfo: {
        processSize: "",//处理水量
        processTypeName: "",//处理工艺
        productTypeName: "",//项目类型
        waterFactoryName: "",//当天水厂
        workDayNum: ""//运行天数
    },
    waterAnalysisInfo:{
        dealWaterPer: "",
        dealWaterValue: "",
        moneyWaterPer: "",
        moneyWaterValue: ""
    },
    tabKey:'clsl',
    xList:[],
    yBurden:[],
    yWater:[],
    chartLoading:false
};
export default {

    namespace: 'waterAnalysis', // 水量分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/waterAnalysis') {
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
                    dispatch({ type: 'loadWaterFactorySelect' });

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
                    yield put({ type: 'getWaterAnalysisInfo' })
                    yield put({ type: 'getChartData' })
                }
            }
        },
        //获取水厂信息
        *getWaterFactoryInfo({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ waterAnalysis }) => waterAnalysis)
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
        //获取水量分析基本信息
        *getWaterAnalysisInfo({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ waterAnalysis }) => waterAnalysis)
            const {startTime,endTime,waterFactoryId} = searchParams
            const {data} = yield call(getWaterAnalysisInfo,{
                startTime,
                endTime,
                waterFactoryId
            })
             if (!!data && !data.result) {
                 yield put({
                     type: 'updateState',
                     payload: {
                         waterAnalysisInfo: data.data
                     }
                 })

             }
        },
        //获取数据
        *getChartData({payload},{call,put,select}){
            const { searchParams,tabKey } = yield select(({ waterAnalysis }) => waterAnalysis)
            const { startTime, endTime, waterFactoryId } = searchParams
            yield put({
                type:'updateState',
                payload:{
                    chartLoading:true
                }
            })
            const {data} = yield call(getWaterAnalysisChart,{
                startTime, endTime, waterFactoryId,
                tab:tabKey
            })
            yield put({
                type: 'updateState',
                payload: {
                    chartLoading: false
                }
            })
            if (data && !data.result&&data.data){
                yield put({
                    type: 'updateState',
                    payload:{
                        xList: data.data.xDate || [],
                        yBurden: data.data.yBurden || [],
                        yWater: data.data.yWater || []
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