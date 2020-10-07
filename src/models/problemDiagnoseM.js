const u = require('updeep');
import {message} from 'antd'
import { getAllRules, saveUserOperation, searchHistory, getHistoryList} from '../services/expertService'
import { VtxUtil, } from '../utils/util';

const initState = {
    ruleList:[{
        id:'1',
        flagCode:'tn',
        targetName:'TN',
        ruleName:'出水TN超标',
        standard:'15',
        unit:'mg/L'
    },{
        id:'2',
            flagCode: 'nhn',
        targetName:'氨氮',
        ruleName: '出水氨氮超标',
        standard:'5',
        unit:'mg/L'
    },{
        id:'3',
            flagCode: 'cod',
        targetName:'COD',
        ruleName: '出水COD超标',
        standard:'50',
        unit:'mg/L'
    },{
        id:'4',
            flagCode: 'ss',
        targetName:'SS',
        ruleName: '出水SS超标',
        standard:'15',
        unit:'mg/L'
    },{
        id:'5',
            flagCode: 'tp',
        targetName:'TP',
        ruleName: '出水TP超标',
        standard:'0.5',
        unit:'mg/L'
    }],
    loading:false,
    allRules:[],
    showPanel:'homepage',//显示的面板 homepage,detail,history
    navigationContent:[],//详情面板左侧数据
    causeContent:[],//详情面板右侧数据
    causeContentHead:'',
    showCauseContentHead:false,
    historyList: []
};
export default{
    namespace:'problemDiagnose',
    state:{
        ...initState
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/problemDiagnose') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState
                        }
                    })
                    dispatch({ type:'getAllRules'})
                }
            })
        }
    },
    effects: {
        *getAllRules({payload},{call,put,select}){
            const { data } = yield call(getAllRules)
            if(data&&!data.result){
                if('data' in data && Array.isArray(data.data)){
                    yield put({
                        type:'updateState',
                        payload:{
                            allRules:data.data
                        }
                    })
                }
            }

        },
        //保存操作
        *saveUserOperation({payload},{call,put,select}){
            const { navigationContent } = yield select(({ problemDiagnose }) => problemDiagnose)
            const resultArray = navigationContent.map(item=>({id:item.id,rule:item.rule,flagCode:item.flagCode}))
            yield put({
                type: 'updateState',
                payload: {
                    loading: true
                }
            })
            const { data } = yield call(saveUserOperation,{
                settingIds: JSON.stringify(resultArray),
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

            }
        },
        //获取历史记录
        *getHistoryList({ payload }, { call, put, select }){
            const {data} = yield call(getHistoryList,{
                page:0,
                size:5
            })
            if (data && !data.result) {
                if ('data' in data && Array.isArray(data.data.rows)) {
                    let historyList = []
                    data.data.rows.map(item=>{
                        historyList.push({id:item.id, list:JSON.parse(item.settingIds)})
                    })
                    yield put({
                        type: 'updateState',
                        payload: {
                            historyList
                        }
                    })
                }
            }
        },
        //历史记录页面点击单条
        *searchHistory({ payload }, { call, put, select }) {
            const {data} = yield call(
                searchHistory,{
                    id:payload.id
                }
            )
            if(data&&!data.result){
               
                yield put({
                    type:'updateState',
                    payload:{
                        showPanel:'detail',
                        navigationContent:data.data
                    }
                })
                refreshContent(data.data)
            }else{
                
            }
        }
    },
    reducers: {
        updateState(state, action) {
            return u(action.payload, state);
        }
    }
}