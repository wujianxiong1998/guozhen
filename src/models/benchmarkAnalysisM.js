const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getBenchmarkAnalysisChart} from '../services/produtionService'
import { loadRegionalCompanySelect, loadWaterFactorySelect, loadCommonParamSelect, loadBusinessUnitSelect, getTargetLibrarySelect} from '../services/remoteData';
import { VtxUtil } from '../utils/util';
const initState = {
    regionalCompanySelect: [], // 区域公司下拉数据
    waterFactorySelect: [], // 选择水厂下拉数据
    processTypeSelect:[],//工艺下拉
    businessUnitList:[],//事业部下拉
    targetSelect:[],//指标下拉
    waterStandardSelect:[],//出水标准下拉
    diffAreaProps:{//不同区域之间对比
        startTime:moment().format('YYYY-MM'),
        endTime: moment().format('YYYY-MM'),
        businessUnitId:undefined,//事业部
        libraryId:undefined,//指标
        xList:[],
        data:[],
        loading:false

    },
    diffFactoryProps:{//同区域不同水厂之间对比
        startTime: moment().format('YYYY-MM'),
        endTime: moment().format('YYYY-MM'),
        regionalCompanyId:undefined,//区域
        libraryId: undefined,//指标
        data: [],
        loading: false
    },
    diffCraftProps:{//不同工艺之间对比
        startTime: moment().format('YYYY-MM'),
        endTime: moment().format('YYYY-MM'),
        businessUnitId: undefined,//事业部
        libraryId: undefined,//指标
        data: [],
        loading: false
    },
    sameCraftProps:{//同工艺之间对比
        startTime: moment().format('YYYY-MM'),
        endTime: moment().format('YYYY-MM'),
        processTypeId:undefined,//工艺
        regionalCompanyId: undefined,//区域
        libraryId: undefined,//指标
        data: [],
        loading: false
    },
    sameCraftStandardProps: {//同工艺、同出水标准之间的对比
        startTime: moment().format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        processTypeId: undefined,//工艺
        regionalCompanyId: undefined,//区域
        libraryId: undefined,//指标
        waterStandardId: undefined,//出水标准
        data: [],
        loading: false
    }
};
export default {

    namespace: 'benchmarkAnalysis', // 对标分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/benchmarkAnalysis') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    //请求指标下拉
                    dispatch({ type: 'loadTargetSelect' });
                    // 请求区域公司下拉数据
                    dispatch({ type: 'loadRegionalCompanySelect' });
                    // 请求选择水厂下拉数据
                    dispatch({ type: 'loadWaterFactorySelect' });
                    // 请求工艺类型下拉数据
                    dispatch({ type: 'loadProcessTypeSelect' });
                    // 获取事业部下拉
                    dispatch({ type: 'getBusinessUnitSelect' });
                }   
            })
        }
    },
    effects:{
        *loadTargetSelect({ payload }, { call, put, select }) {
            const { data } = yield call(getTargetLibrarySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            targetSelect: data.data
                        }
                    })
                }
            }
        },
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
        // 工艺类型下拉
        *loadProcessTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'processType',
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            processTypeSelect: data.data
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

        // 选择水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactorySelect: data.data
                        }
                    })
                }
            }
        },
        //不同区域图表
        *getDiffAreaChart({ payload }, { call, put, select }) {
            const { diffAreaProps } = yield select(({ benchmarkAnalysis }) => benchmarkAnalysis)
            const {startTime,endTime,businessUnitId,libraryId} = diffAreaProps;
            yield put({
                type: 'updateState',
                payload: {
                    diffAreaProps: {
                        loading:true
                    }
                }
            })
            const {data} = yield call(getBenchmarkAnalysisChart,{
                monthStartDate:startTime,
                monthEndDate:endTime,
                libraryId,
                businessUnitId,
                dataType:'qy'
            })
            yield put({
                type: 'updateState',
                payload: {
                    diffAreaProps: {
                        loading: false
                    }
                }
            })
            if(data&&!data.result&&data.data){
                yield put({
                    type: 'updateState',
                    payload: {
                        diffAreaProps: {
                           xList:data.data.xData||[],
                           data:data.data.yData||[]
                        }
                    }
                })
            }
        },
        //同区域各水厂图表
        *getDiffFactoryChart({ payload }, { call, put, select }) {
            const { diffFactoryProps } = yield select(({ benchmarkAnalysis }) => benchmarkAnalysis)
            const { startTime, endTime, regionalCompanyId, libraryId } = diffFactoryProps;
            yield put({
                type: 'updateState',
                payload: {
                    diffFactoryProps: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(getBenchmarkAnalysisChart, {
                monthStartDate: startTime,
                monthEndDate: endTime,
                libraryId,
                regionalCompanyId,
                dataType: 'sc'
            })
            yield put({
                type: 'updateState',
                payload: {
                    diffFactoryProps: {
                        loading: false
                    }
                }
            })
            if (data && !data.result && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        diffFactoryProps: {
                            xList: data.data.xData || [],
                            data: data.data.yData || []
                        }
                    }
                })
            }
        },
        //不同工艺图表
        *getDiffCraftChart({ payload }, { call, put, select }) {
            const { diffCraftProps } = yield select(({ benchmarkAnalysis }) => benchmarkAnalysis)
            const { startTime, endTime, businessUnitId, libraryId } = diffCraftProps;
            yield put({
                type: 'updateState',
                payload: {
                    diffCraftProps: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(getBenchmarkAnalysisChart, {
                monthStartDate: startTime,
                monthEndDate: endTime,
                libraryId,
                businessUnitId,
                dataType: 'gy'
            })
            yield put({
                type: 'updateState',
                payload: {
                    diffCraftProps: {
                        loading: false
                    }
                }
            })
            if (data && !data.result && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        diffCraftProps: {
                            xList: data.data.xData || [],
                            data: data.data.yData || []
                        }
                    }
                })
            }
        },
        //同工艺图表
        *getSameCraftChart({ payload }, { call, put, select }) {
            const { sameCraftProps } = yield select(({ benchmarkAnalysis }) => benchmarkAnalysis)
            const { startTime, endTime, processTypeId,regionalCompanyId, libraryId } = sameCraftProps;
            yield put({
                type: 'updateState',
                payload: {
                    sameCraftProps: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(getBenchmarkAnalysisChart, {
                monthStartDate: startTime,
                monthEndDate: endTime,
                processTypeId,
                libraryId,
                regionalCompanyId,
                dataType: 'sc'
            })
            yield put({
                type: 'updateState',
                payload: {
                    sameCraftProps: {
                        loading: false
                    }
                }
            })
            if (data && !data.result && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        sameCraftProps: {
                            xList: data.data.xData || [],
                            data: data.data.yData || []
                        }
                    }
                })
            }
        },
        //同工艺图表
        *getSameCraftStandardChart({ payload }, { call, put, select }) {
            const { sameCraftStandardProps } = yield select(({ benchmarkAnalysis }) => benchmarkAnalysis)
            const { startTime, endTime, processTypeId, regionalCompanyId, waterStandardId, libraryId } = sameCraftStandardProps;
            yield put({
                type: 'updateState',
                payload: {
                    sameCraftStandardProps: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(getBenchmarkAnalysisChart, {
                monthStartDate: startTime,
                monthEndDate: endTime,
                processTypeId,
                libraryId,
                regionalCompanyId,
                waterStandard: waterStandardId,
                dataType: 'sc'
            })
            yield put({
                type: 'updateState',
                payload: {
                    sameCraftStandardProps: {
                        loading: false
                    }
                }
            })
            if (data && !data.result && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        sameCraftStandardProps: {
                            xList: data.data.xData || [],
                            data: data.data.yData || []
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
    }
}