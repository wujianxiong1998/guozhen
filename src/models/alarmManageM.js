import { alarmManangeService, alarmSetService } from "../services/alarmService";
import {getUserDetail} from "../services/commonIFS";
import {message} from 'antd';
import {loadEnum} from "../services/remoteData";
import { generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备等级
    name: '',  // 项目名称
};

const defaultNewItem = {
    id: '',
    code: '',  // 设备等级
    orderIndex1: '',  // 巡检项目
};


const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],

    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据
    
    modelLonding: false,
    newItem : {...defaultNewItem},

    AlertLocationSel: [],   // 报警位置
    AlertTypeSel: [],   // 报警类型
    AlertGradeSel: [],   // 报警级别
    userList: [],  // 人员树
};

export default {
    namespace: 'alarmManage',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/alarmManage') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({alarmManage}) => alarmManage);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                type: 'xjxmType',
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(alarmSetService.getList, params);
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

    },

    reducers: {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
            }
        },
        initParams(state,action) {
            return {
                ...state,
                newItem:{
                    ...defaultNewItem
                },
            }
        },
        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                ...initQueryParams,
                currentPage : 1,
                pageSize : 10,
                queryParams : initQueryParams
            }
        },
        updateNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...state.newItem,
                    ...action.payload
                }
            }
        },
    }
}