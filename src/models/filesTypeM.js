import { filesTypeService } from '../services/alarmService';
import {message} from 'antd'
import { VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 排序号
    name: '',  // 项目名称
};

const defaultNewItem = {
    id: '',
    orderIndex: '',  // 排序号
    typeName: '',  // 类型名称
    typeCode: '',  // 类型code
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

};

export default {
    namespace: 'filesType',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/filesType') {
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
            } = yield select(({filesType}) => filesType);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page: currentPage-1,
                size: pageSize
            };
            const { data } = yield call(filesTypeService.getList, params);
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

        // 保存
        *save(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem } = yield select( ({filesType}) => filesType );
            let { id, code, name } = newItem;
            const params = {
                ...newItem
            };
            let { data } = yield call(filesTypeService.save, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 判断能不能删除
        *wheatherDelete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
            };
            const { data } = yield call(filesTypeService.wheatherDelete, params);
            if(data.data){
                return true;
            }
            else{
                return false;
            }
        },

        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
            };
            const { data } = yield call(filesTypeService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
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