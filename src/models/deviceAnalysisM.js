const u = require('updeep');
import _ from 'lodash'
import moment from 'moment';
import { getDeviceList,getDeviceChartData,getMalfunctionData } from '../services/produtionService'
import { loadRegionalCompanySelect, loadBusinessUnitSelect, } from '../services/remoteData';
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    startTime: moment().startOf('month').format('YYYY-MM-DD'),
    endTime: moment().format('YYYY-MM-DD'),
    businessUnitId: undefined, // 事业部
    deviceName:'',
    deviceId: '',
    // regionalCompanyId: undefined
};

const initState = {
    searchParams: { ...initQueryParams }, // 搜索参数
    businessUnitList:[],//事业部下拉数据
    deviceSelect: [],//设备下拉
    diffLevelProps: {//不同等级设备的故障频次对比
        loading:false,
        dataType:'grade',
        xList:[],
        data:[]
    },
    diffFacrotyProps:{
        loading:false,
        dataType: 'price',
        xList: [],
        data: []
    }
    
};

export default {

    namespace: 'deviceAnalysis', // 设备分析

    state: { ...initState },

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/deviceAnalysis') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    // 请求事业部下拉数据
                    dispatch({ type: 'getBusinessUnitSelect' });
                    //请求设备下拉
                    dispatch({ type: 'loadDeviceSelect' });
                }
            })
        }
    },

    effects: {
        // 设备下拉
        *loadDeviceSelect({ payload }, { call, put, select }) {
            const { data } = yield call(getDeviceList);
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            deviceSelect: data.data,

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
        //获取故障频次
        *getMalfunctionData({ payload = {} }, { call, put, select }) {
            const { searchParams, diffLevelProps } = yield select(({ deviceAnalysis}) => deviceAnalysis)
            const {startTime,endTime,businessUnitId,deviceName} = searchParams
            const { dataType } = diffLevelProps
            yield put({
                type: 'updateState',
                payload: {
                    diffLevelProps:{
                        loading:true
                    }
                }
            })
            const {data} = yield call(getMalfunctionData,{
                dataType,
                startTime, endTime, businessUnitId,
                name:deviceName
            })
            yield put({
                type: 'updateState',
                payload: {
                    diffLevelProps: {
                        loading: false
                    }
                }
            })
            if(data&&!data.result&&data.data){
                yield put({
                    type: 'updateState',
                    payload: {
                        diffLevelProps: {
                            xList: data.data.xData||[],
                            data:data.data.yData||[]
                        }
                    }
                })
            }
        },
        //获取图标数据
        *getDeviceChartData({ payload = {} }, { call, put, select }) {
            const { searchParams, diffFacrotyProps } = yield select(({ deviceAnalysis }) => deviceAnalysis)
            const { startTime, endTime, businessUnitId, deviceName } = searchParams
            const { dataType } = diffFacrotyProps
            yield put({
                type: 'updateState',
                payload: {
                    diffFacrotyProps: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(getDeviceChartData, {
                dataType,
                startTime, endTime, businessUnitId,
                name: deviceName
            })
            yield put({
                type: 'updateState',
                payload: {
                    diffFacrotyProps: {
                        loading: false
                    }
                }
            })
            if (data && !data.result && data.data) {
                yield put({
                    type: 'updateState',
                    payload: {
                        diffFacrotyProps: {
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