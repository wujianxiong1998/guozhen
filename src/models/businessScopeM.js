import { getCraftClassesList,addCraftClasses,updateCraftClasses,commonDelete } from '../services/remoteData';

const u = require('updeep');
import { VtxUtil,deleteMessage } from '../utils/util';

// 查询条件
let initQueryParams = {
    name : '' // 名称
};

// 新增参数
let defaultNewItem = {
    name : '', // 名称
    code : '',//编码
    type: 'businessScope',
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    selectedRowKeys : [],
    newItem : {...defaultNewItem}, // 新增参数
    editItem:{ // 编辑参数
        type: 'businessScope',
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    }
};

export default {

    namespace : 'businessScope', // 业务范围

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/businessScope') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({businessScope}) => businessScope);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                type: 'businessScope',
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getCraftClassesList, VtxUtil.submitTrim(params));
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
        
        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const { newItem, editItem } = yield select( ({businessScope}) => businessScope );
            const {
                id, name,code
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id, name,code,
                type: 'businessScope',
                tenantId: VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                    addCraftClasses : updateCraftClasses, VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError();
            }
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : false }
                }
            });
        },
        
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(','),
                type:'businessScope'
            };
            const { data } = yield call(commonDelete, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                deleteMessage(data)
            }
        }
    },

    reducers : {
		updateState(state,action){
            return u(action.payload, state);
        },

		updateQueryParams(state,action) {
            let queryParams = _.pick(state.searchParams, _.keys(initQueryParams));
            return {
                ...state,
                ...action.payload,
                selectedRowKeys : [],
                currentPage : 1,
                queryParams : queryParams
            }
        },

        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                currentPage : 1,
                pageSize : 10,
				 searchParams : initQueryParams,
                queryParams : initQueryParams
            }
        },

        initNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...defaultNewItem
                }
            }
        }
    }
}