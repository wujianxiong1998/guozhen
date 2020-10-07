import {
    getStructureList,
    pageList,
} from '../services/accountInformation';
import {getUserDetail} from "../services/commonIFS";
import {
    overHaulRecordService
} from "../services/overHaulService";
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    fileListVersion: 1,
    
    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据

};

export default {
    namespace: 'overHaulLog',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/overHaulLog') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    dispatch({type: 'getList'});
                    
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
            } = yield select(({overHaulLog}) => overHaulLog);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(overHaulRecordService.getList, params);
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

        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id
            };
            const { data } = yield call(overHaulRecordService.detail, params);
            if(!!data && !data.result){
                yield put({
                    type: 'updateState',
                    payload: {
                        getData: {
                            ...data.data,
                            sparePart: data.data.sparePart?JSON.parse(data.data.sparePart):[],
                            picIds: data.data.picIds?JSON.parse(data.data.picIds):[],
                            countTotal: data.data.countTotal
                        }
                        // getData: data.data
                    }
                })
            }
        }

    },

    reducers: {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
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
        updateViewItem(state, action){
            return {
                ...state,
                viewItem:{
                    ...state.viewItem,
                    ...action.payload
                }
            }
        },
    }
}
