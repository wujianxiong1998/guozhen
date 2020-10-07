const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getTargetSelect, getWaterFactoryInfo, getPlanAnalysisChart, getPlanAnalysisProgress} from '../services/produtionService'
import {loadRegionalCompanySelect, loadWaterFactorySelect,} from '../services/remoteData';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    timeType:'month',
    startTime:moment().format('YYYY-MM'),
    endTime: moment().format('YYYY-MM'),
    waterFactoryId:undefined,
    regionalCompanyId: undefined,
};
let progressData = []
for(let i=0;i<20;i++){
    progressData.push({
        id:i,
        name:'处理水量(万吨)',
        num:100,
        total:500,
    })
}

const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    regionalCompanySelect: [], // 区域公司下拉数据
    waterFactorySelect: [], // 选择水厂下拉数据
    targetSelect:[],//指标下拉数据
    waterFactoryInfo:{
        processSize: "",//处理水量
        processTypeName: "",//处理工艺
        productTypeName: "",//项目类型
        waterFactoryName: "",//当天水厂
        workDayNum: ""//运行天数
    },
    targetProps:{
        targetIds:[],
        data: [],
        loading:false
    },
    leftTopChartProps:{
        targetIds: [],
        data: [],
        loading: false
    },
    rightTopChartProps:{
        targetIds: [],
        data: [],
        loading: false
    },
    leftBottomChartProps:{
        targetIds: [],
        data: [],
        loading: false
    },  
    rightBottomChartProps: {
        targetIds: [],
        data: [],
        loading: false
    },
};
export default {

    namespace: 'planAnalysis', // 计划分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/planAnalysis') {
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
    effects:{
        // 区域公司下拉
        *loadRegionalCompanySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadRegionalCompanySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            regionalCompanySelect: data.data,
                            
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
                    yield put({ type: 'getTargetSelect' })
                }
            }
        },
        //获取水厂信息
        *getWaterFactoryInfo({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ planAnalysis }) => planAnalysis)
            const {waterFactoryId} = searchParams
            const {data} = yield call(getWaterFactoryInfo,{
                waterFactoryId
            })
            if (!!data && !data.result) {
                yield put({
                    type:'updateState',
                    payload:{
                        waterFactoryInfo:data.data
                    }
                })
            }
        },
        //获取指标下拉
        *getTargetSelect({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ planAnalysis }) => planAnalysis)
            const { waterFactoryId } = searchParams
            const { data } = yield call(getTargetSelect, {
                waterFactoryId
            })
            if (!!data && !data.result&&data.data && Array.isArray(data.data)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        targetSelect: data.data
                    }
                })
            }
        },
        //获取进度条数据
        *getPlanAnalysisProgress({ payload }, { call, put, select }) {
            const { searchParams,targetProps } = yield select(({ planAnalysis }) => planAnalysis)
            const { waterFactoryId, startTime, endTime, timeType } = searchParams
            const {targetIds} = targetProps
            yield put({
                type:'updateState',
                payload:{
                    targetProps:{
                        loading:true
                    }
                }
            })
            const {data} = yield call(getPlanAnalysisProgress,{
                waterFactoryId, startTime, endTime,
                mOry: timeType==='month'?'M':'Y',
                targetIds:targetIds.join()
            })
            yield put({
                type: 'updateState',
                payload: {
                    targetProps: {
                        loading: false
                    }
                }
            })
            if (!!data && !data.result && data.data && Array.isArray(data.data)) {
                yield put({
                    type: 'updateState',
                    payload: {
                        targetProps: {
                            data: data.data
                        }
                    }
                })
            }
        },
        //获取图表数据
        *getPlanAnalysisChart({ payload }, { call, put, select }) {
            const {itemName} = payload
            const { searchParams } = yield select(({ planAnalysis }) => planAnalysis)
            const { waterFactoryId, startTime, endTime, timeType } = searchParams
            const { targetIds } = yield select(({ planAnalysis }) => planAnalysis[itemName])
            yield put({
                type:'updateState',
                payload:{
                    [itemName]:{
                        loading:true
                    }
                }
            })
            const {data} = yield call(getPlanAnalysisChart,{
                waterFactoryId, startTime, endTime,
                mOry: timeType === 'month' ? 'M' : 'Y',
                targetIds: targetIds.join()
            })
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        [itemName]: {
                            data:data.data
                        }
                    }
                })
            }
            yield put({
                type: 'updateState',
                payload: {
                    [itemName]: {
                        loading: false
                    }
                }
            })
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