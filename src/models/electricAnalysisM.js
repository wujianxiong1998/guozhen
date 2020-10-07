const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getWaterFactoryInfo,getElecAnalysisChart} from '../services/produtionService'
import {loadRegionalCompanySelect, loadWaterFactorySelect,} from '../services/remoteData';
import { VtxUtil } from '../utils/util';
// 查询条件
let initQueryParams = {
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
    consumeProps:{//电单耗
        loading: false,
        tabKey:'D',
        xList:[],
        data:[]
    },
    costProps:{//电成本
        loading: false,
        tabKey: 'D',
        xList: [],
        data: []
    }
};
export default {

    namespace: 'electricAnalysis', // 电耗分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/electricAnalysis') {
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
                    yield put({ type: 'getChartData',payload:{chartName:'consumeProps'} })
                    yield put({ type: 'getChartData', payload: { chartName: 'costProps' } })
                }
            }
        },
        //获取水厂信息
        *getWaterFactoryInfo({ payload }, { call, put, select }) {
            const { searchParams } = yield select(({ electricAnalysis }) => electricAnalysis)
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
        //获取图标数据
        *getChartData({ payload }, { call, put, select }) {
            const {chartName} = payload
            const { searchParams } = yield select(({ electricAnalysis }) => electricAnalysis)
            const {startTime,endTime,waterFactoryId,regionalCompanyId} = searchParams
            const { tabKey } = yield select(({ electricAnalysis }) => electricAnalysis[chartName])
            yield put({
                type: 'updateState',
                payload: {
                    [chartName]: {
                        loading:true
                    }
                }
            })
            const {data} = yield call(getElecAnalysisChart,{
                startTime, endTime, waterFactoryId,
                mOrd:tabKey,
                tab: chartName == 'consumeProps' ? 'powerConsume' :'powerCost'
            })
            yield put({
                type: 'updateState',
                payload: {
                    [chartName]: {
                        loading: false
                    }
                }
            })
            if(data&&!data.result){
                yield put({
                    type: 'updateState',
                    payload: {
                        [chartName]: {
                            xList:data.data.xData||[],
                            data:data.data.yData||[]
                        }
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