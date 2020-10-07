import moment from 'moment'
const u = require('updeep');
import {message} from 'antd'
import { getFillConfigData, saveFillConfigData} from '../services/produtionService'
import { VtxUtil } from '../utils/util';

const initState = {
    id:'',
    date:moment().format('YYYY-MM'),//选择时间
    disabledDate: [],
    loading:false
}
export default {
    namespace: 'fillDateConfig', // 填报日期配置

    state: { ...initState },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/fillDateConfig') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    dispatch({ type:'getConfigData'})
                }
            })
        }
    },
    effects: {
        //获取日期配置数据
        *getConfigData({ payload }, { call, put, select }) {
            const { date } = yield select(({ fillDateConfig}) => fillDateConfig)
            const { data } = yield call(getFillConfigData,{
                date,
                startDate:moment(date).startOf('month').format('YYYY-MM-DD'),
                // startDate: (moment(date).month() == moment().month() && moment(date).year() == moment().year()) ? moment().format('YYYY-MM-DD') : moment(date).startOf('month').format('YYYY-MM-DD'),
                endDate: moment(date).endOf('month').format('YYYY-MM-DD'),
            })
            if (data && !data.result && Array.isArray(data.data.notFillDateList) ){
                yield put({
                    type:'updateState',
                    payload:{
                        id:data.data.id,
                        disabledDate: data.data.notFillDateList
                    }
                })
            }
        },
        //保存日期配置数据
        *saveConfigData({ payload }, { call, put, select }) {
            const { disabledDate, id } = yield select(({ fillDateConfig }) => fillDateConfig)
            yield put({
                type:'updateState',
                payload:{
                    loading:true
                }
            })
            const { data } = yield call(saveFillConfigData,{
                id,
                notFillDateList:disabledDate,
                tenantId: VtxUtil.getUrlParam('tenantId')
            })
            yield put({
                type: 'updateState',
                payload: {
                    loading: false
                }
            })
            if(data&&!data.result){
                message.success('保存成功')
            }else{
                message.error(data?data.msg:'保存失败')
            }
        }
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        },
    }
}
