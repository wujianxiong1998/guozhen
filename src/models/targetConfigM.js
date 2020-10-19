import { getTargetConfigList,addTargetConfig,updateTargetConfig,commonDelete,
    loadBusinessUnitSelect, loadRegionalCompanySelect, loadWaterFactorySelect, getTargetTemplateSelect,
    getTargetsByTemplateId, getTargetConfigTree } from '../services/remoteData';

const u = require('updeep');
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex'
import { VtxUtil,deleteMessage } from '../utils/util';

// 查询条件
let initQueryParams = {
    name : '', // 名称
    businessUnitId : '', // 事业部
    regionalCompanyId : '', // 区域公司
    typeCode: 'JHZB',//指标类型--页签
    businessName: '',
    waterFactoryId : ''
};

// 新增参数
let defaultNewItem = {
    waterFactoryId : '', // 选择水厂
    selectedTargets:[],//已选指标
    checkedTemplates:[],//勾中的模版多选框
    checkedTargets:[],//勾中的指标行
    targetList:[],
    targetListLoading:false,
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    businessUnitSelect : [], // 事业部下拉数据
    regionalCompanySelect : [], // 区域公司下拉数据
    waterFactorySelect : [], // 选择水厂下拉数据
    templateSelect: [],//所有模版
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

    namespace : 'targetConfig', // 指标配置

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/targetConfig') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 获取树
                    dispatch({ type: 'getTree'})
                    // 请求事业部下拉数据
                    dispatch({type : 'loadBusinessUnitSelect'});
                    // 请求区域公司下拉数据
                    dispatch({type : 'loadRegionalCompanySelect'});
                    // 请求选择水厂下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    dispatch({type : 'getTargetTemplateSelect'})
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 树
        *getTree({payload}, {call, put, select}) {
            const {data} = yield call(getTargetConfigTree);
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

        // 事业部下拉
        *loadBusinessUnitSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadBusinessUnitSelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            businessUnitSelect : data.data
                        }
                    })
                }
            }
        },

        // 区域公司下拉
        *loadRegionalCompanySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadRegionalCompanySelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            regionalCompanySelect : data.data
                        }
                    })
                }
            }
        },

        // 选择水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadWaterFactorySelect);
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            waterFactorySelect : data.data
                        }
                    })
                }
            }
        },
        // 获取模版列表
        *getTargetTemplateSelect({ payload = {} }, { call, put, select }) {
            const {data} = yield call(getTargetTemplateSelect);
            if(!!data&&!data.result){
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            templateSelect: data.data.map(item=>{
                                return {
                                    label:item.name,
                                    value:item.id
                                }
                            })
                        }
                    })
                }
            }
        },
        //根据模版id获取指标
        *queryTargetsByTemplateId({ payload = {} }, { call, put, select }) {
            const { ids, itemName, typeCode} = payload;
            const { selectedTargets,checkedTargets} = yield select(({targetConfig}) => targetConfig[itemName])
            yield put({
                type:'updateState',
                payload:{
                    [itemName]:{
                        targetListLoading: true
                    }
                }
            })
            const { data } = yield call(getTargetsByTemplateId,{
                templateIds:ids,
                typeCode
            })
            yield put({
                type: 'updateState',
                payload: {
                    [itemName]: {
                        targetListLoading: false
                    }
                }
            })
            if (!!data && !data.result){
                if ('data' in data && Array.isArray(data.data)) {
                    let targetList = data.data;
                    // let newSelectedTargets = [],newCheckedTargets=[];
                    selectedTargets.map((item)=>{
                        const index = _findIndex(targetList, { id: item.id })
                        if (index>-1){
                            targetList[index].rationalRange = item.rationalRange
                        }
                    })
                    yield put({
                        type:'updateState',
                        payload:{
                            [itemName]: {
                                targetList,
                                // selectedTargets:newSelectedTargets,
                                // checkedTargets:newCheckedTargets
                            }
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
            } = yield select(({targetConfig}) => targetConfig);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getTargetConfigList, VtxUtil.submitTrim(params));
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
            const { newItem, editItem } = yield select( ({targetConfig}) => targetConfig );
            const {
                id, waterFactoryId, selectedTargets, typeCode,
            } = payload.btnType === 'add' ? newItem : editItem;
            const libraryInfoList = selectedTargets.map((item,index)=>{
                return {
                    libraryId:item.id,
                    orderIndex:index+1,
                    rationalRange: item.rationalRange
                }
            })
            let params = {
                id, waterFactoryId,
                typeCode,
                libraryInfoJson: JSON.stringify(libraryInfoList),
                tenantId: VtxUtil.getUrlParam('tenantId') 
            };
            const { data } = yield call( payload.btnType === 'add' ? 
                    addTargetConfig : updateTargetConfig, VtxUtil.submitTrim(params));
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
                type:'targetConfig'
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