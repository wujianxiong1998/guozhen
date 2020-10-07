import { getScoreConfigList,saveScoreConfig,getScoreConfig } from '../services/expertService';

const u = require('updeep');
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    sortField:'',
    order:'',
};

// 新增参数
let defaultNewItem = {
    askOnceScore : '', // 提问1次得
    askUpper : '', // 每月上限
    answerOnceScore : '', // 回答1次得
    answerUpper : '', // 每月上限
    uploadOnceScore : '', // 上传1次得
    uploadUpper : '' // 每月上限
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
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    }
};

export default {

    namespace : 'scoreConfig', // 积分汇总及配置

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/scoreConfig') {
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
            } = yield select(({scoreConfig}) => scoreConfig);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                order: queryParams.order === 'descend' ? 'desc' :
                    queryParams.order === 'ascend' ? 'asc' : queryParams.order,
                page : currentPage-1,
                rows : pageSize
            };
            const { data } = yield call(getScoreConfigList, VtxUtil.submitTrim(params));
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
        //获取积分配置
        *getScoreConfig({ payload }, { call, put, select }) {
            const {data} = yield call(getScoreConfig)
            if (!!data && data.result == 0) {
                yield put({
                    type:'updateState',
                    payload:{
                        newItem:{
                            ...data.data
                        }
                    }
                })
            }
        },
        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const { newItem, editItem } = yield select( ({scoreConfig}) => scoreConfig );
            const {
                id, askOnceScore, askUpper, answerOnceScore, answerUpper, uploadOnceScore, uploadUpper,
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id, askOnceScore, askUpper, answerOnceScore, answerUpper, uploadOnceScore, uploadUpper,
                tenantId : VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call( saveScoreConfig, VtxUtil.submitTrim(params));
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