import { getOnlineOperation, deleteOnlineOperation } from '../services/remoteData';
import { VtxUtil } from '../utils/util'
const u = require('updeep')


// 查询条件
let initQueryParams = {
    name: '',    //水厂名称
    mode: ''    //运维模式
}

// 新增参数
let defaultNewItem = {

}

// 数据记录
let initState = {
    searchParams: {...initQueryParams},  //搜索参数
    // 列表数据
    currentPage: 1,
    pageSize: 10,
    loading: false,
    total: 0,
    dataSource: [],
    selectedRowKeys: [],
    newItem: {...defaultNewItem},
    viewItem: { visible: false, loading: false },
    editItem: { visible: false, loading: false },
}

// dva redux-model
export default {

    namespace: 'onlineOperation', //在线运维

    state: {...initState},

    // 一旦 State 发生变化，就自动执行这个函数。
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/onlineOperation') {
                    // 初始化state
                    dispatch({ type: 'updateState', payload: {
                        ...initState,
                        searchParams: {
                            dataFillType: VtxUtil.getUrlParam('menuTab') || 'produce'
                        }
                    }})
                    // 发送请求获取表格数据
                    dispatch({ type: 'getList'})
                }
            })
        }
    },

    // 发送请求
    effects: {
        // 获取表格数据
        *getList({ payload = {}}, { call, put, select }) {
            yield put({ type: 'updateState', payload: {loading: true}})
            let { pageSize, currentPage, searchParams} = yield select(({onlineOperation})=>onlineOperation)
            currentPage = 'currentPage' in payload?payload.currentPage:currentPage;
            pageSize = 'pageSize' in payload?payload.pageSize:pageSize;
            let params = {
                ...searchParams,
                page: currentPage-1,
                size: pageSize
            }
            const { data } = yield call(getOnlineOperation, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item=>({
                        ...item,
                        key: item.id
                    }))
                }
                total = data.data.total;
            }
            // mock表格
            dataSource = [
                { a: 1, b: 2, c:3, d:4},
                { a: 1, b: 2, c:3, d:4},
                { a: 1, b: 2, c:3, d:4},
            ]
            let uState = { 
                dataSource,
                total,
                loading: false
            }
            status&&(uState = {...uState, ...payload})
            yield put({
                type: 'updateState',
                payload: {...uState}
            })
        },

        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            const { searchParams } = yield select( ({ onlineOperation}) => onlineOperation )
            let { ids = [] } = payload;
            const params = { ids: ids.join(',') };
            const { data } = yield call(deleteOnlineOperation, params, searchParams);
            if(!!data && data.result == 0) {
                payload.onSuccess(ids);
            } else {
                payload.onError( data ? data.msg : '删除失败');
            }
        },
    },

    // 更新参数(状态)
    reducers: {
        // 更新action的参数给state
        updateState(state, action) {
            return u(action.payload, state)
        },

        // 初始化表格页面参数（选择行）
        updateQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                selectedRowKeys: [],
                currentPage: 1
            }
        },

        // 初始化搜索条件
        initQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                currentPage: 1,
                pageSize: 10,
                searchParams: initQueryParams
            }
        },

        // 初始化新增模态框
        initNewItem(state, action) {
            return {
                ...state,
                newItem: {
                    ...defaultNewItem
                }
            }
        }
    }

}