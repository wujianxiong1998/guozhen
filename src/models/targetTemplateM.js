import {
    getTargetTemplateList, addTargetTemplate, updateTargetTemplate, commonDelete, getTargetLibrarySelect,
    loadCommonParamSelect,} from '../services/remoteData';
import {message} from 'antd';
const u = require('updeep');
import { VtxUtil,deleteMessage } from '../utils/util';

// 查询条件
let initQueryParams = {
    name : '', // 名称
    code : '', // 编码
    businessId:'',//业务范围
};

// 新增参数
let defaultNewItem = {
    name:'',//模版名称
    businessId : '', // 业务范围
    processTypeId : '', // 工艺名称
    selectedTargets:[],//已选指标
    smallTypeId:'',//搜索条件 指标小类
    searchName:'',//搜索条件 指标名称
    targetList:[],//搜索结果 指标列表
    targetListLoading:false,
    checkedTargets:[],//选中的指标
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    businessSelect : [], // 业务范围下拉数据
    processTypeSelect : [], // 工艺名称下拉数据
    smallTypeSelect:[],//指标小类下拉数据
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

    namespace : 'targetTemplate', // 指标模版

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/targetTemplate') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求业务范围下拉数据
                    dispatch({type : 'loadBusinessSelect'});
                    // 请求工艺名称下拉数据
                    dispatch({type : 'loadProcessTypeSelect'});
                    //请求指标小类下拉数据
                    dispatch({ type:'loadSmallTypeSelect'})
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 业务范围下拉
        *loadBusinessSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'businessScope'
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
        // 工艺名称下拉
        *loadProcessTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect,{
                type: 'processType'
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            processTypeSelect : data.data
                        }
                    })
                }
            }
        },
        // 获取指标库
        *getTargetLibrarySelect({ payload = {} }, { call, put, select }) {
            const { itemName, searchValue,smallTypeId} = payload;
            const { businessId } = yield select(({ targetTemplate }) => targetTemplate[itemName])
            if(!businessId){
                message.warn('请先选择业务范围')
            }else{
                yield put({
                    type: 'updateState',
                    payload: {
                        [itemName]: {
                            targetListLoading: true
                        }
                    }
                })
                const {data} = yield call(getTargetLibrarySelect,{
                    businessId,
                    name:searchValue,
                    smallTypeId
                })
                yield put({
                    type: 'updateState',
                    payload: {
                        [itemName]: {
                            targetListLoading: false
                        }
                    }
                })
                if (!!data && !data.result) {
                    yield put({
                        type:'updateState',
                        payload:{
                            [itemName]:{
                                targetList:data.data
                            }
                        }
                    })
                }else{
                    message.error(data?data.msg:'查询失败')
                }

            }
        },
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({targetTemplate}) => targetTemplate);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getTargetTemplateList, VtxUtil.submitTrim(params));
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
            const { newItem, editItem } = yield select( ({targetTemplate}) => targetTemplate );
            const {
                id, name,businessId, processTypeId, selectedTargets
            } = payload.btnType === 'add' ? newItem : editItem;
            const targetIdArr = selectedTargets.map((item)=>item.id)
            let params = {
                id, name,businessId, processTypeId,
                libraryIds: targetIdArr.join(),
                tenantId : VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                    addTargetTemplate : updateTargetTemplate, VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'保存失败');
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
                type:'targetTemp'
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