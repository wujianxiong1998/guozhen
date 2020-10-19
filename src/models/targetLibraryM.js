import { getTargetLibraryList,addTargetLibrary,updateTargetLibrary,commonDelete,
    loadEnum, loadCommonParamSelect, getTargetLibraryTree } from '../services/remoteData';

const u = require('updeep');
import { VtxUtil,deleteMessage } from '../utils/util';

// 查询条件
let initQueryParams = {
    name : '', // 名称
    code : '', // 编码
    typeId:undefined,//指标大类
    smallTypeId:undefined,//指标小类
    businessId:undefined,//业务范围
};

// 新增参数
let defaultNewItem = {
    name : '', // 指标名称
    code:'',//指标编码
    businessId : '', // 业务范围
    typeId : '', // 指标类型
    smallTypeId:'',//指标小类
    categoryKey: 'primitiveTarget', // 指标类别
    unitId : '', // 指标单位
    decimalDigits : '', // 保留位数
    rationalRange : '', // 合理范围
    formula : '' // 公式
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    businessSelect : [], // 业务范围下拉数据
    typeSelect : [], // 指标类型下拉数据
    smallTypeSelect:[],//指标小类下拉数据
    categorySelect : [], // 指标类别下拉数据
    unitSelect : [], // 指标单位下拉数据
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
    },
    treeDatas: {}, //树
    isToggle: false
};

export default {

    namespace : 'targetLibrary', // 指标库

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/targetLibrary') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 获取树
                    dispatch({ type: 'getTree'})
                    // 请求业务范围下拉数据
                    dispatch({type : 'loadBusinessSelect'});
                    // 请求指标类型下拉数据
                    dispatch({type : 'loadTypeSelect'});
                    dispatch({ type: 'loadSmallTypeSelect' });
                    // 请求指标类别下拉数据
                    dispatch({type : 'loadCategorySelect'});
                    // 请求指标单位下拉数据
                    dispatch({type : 'loadUnitSelect'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 树
        *getTree({payload}, {call, put, select}) {
            const {data} = yield call(getTargetLibraryTree);
            // if(!!data && !data.result) {
            //     if('data' in data) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            treeDatas: data.data
                        }
                    })
                // }
            // }
        },
        // 业务范围下拉
        *loadBusinessSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'businessScope',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            businessSelect : data.data
                        }
                    })
                }
            }
        },

        // 指标大类下拉
        *loadTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'targetType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            typeSelect : data.data
                        }
                    })
                }
            }
        },
        // 指标小类下拉
        *loadSmallTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'targetSmallType',
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            smallTypeSelect: data.data
                        }
                    })
                }
            }
        },
        // 指标单位下拉
        *loadUnitSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'targetUnit',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            unitSelect : data.data
                        }
                    })
                }
            }
        },
        //指标类别下拉
        *loadCategorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadEnum, {
                enumName: 'TargetCategoryEnum',
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            categorySelect: data.data
                        }
                    })
                }
            }
        },
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({targetLibrary}) => targetLibrary);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getTargetLibraryList, VtxUtil.submitTrim(params));
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
            const { newItem, editItem } = yield select( ({targetLibrary}) => targetLibrary );
            const {
                id, name, code, businessId, typeId, smallTypeId,categoryKey, unitId, decimalDigits,
                rationalRange, formula,
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id, name, code, businessId, typeId, smallTypeId,categoryKey, unitId, decimalDigits,
                rationalRange, formula,
                tenantId: VtxUtil.getUrlParam('tenantId') 
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                   addTargetLibrary : updateTargetLibrary, VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError(data ? data.msg : '保存失败');
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
                type:'targetLibrary'
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