import { getProductionPlanList, auditProductionPlan, saveProductionPlan, getDefaultProductionFill, deleteProductionPlan, getProductionPlanDetail,
    ifExistProductionPlan, isAdministrator } from '../services/produtionService';
import { loadWaterFactorySelect,} from '../services/remoteData'
const u = require('updeep');
import _find from 'lodash/find';
import {message} from 'antd'
import moment from 'moment'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂
    startDate : '', // 开始时间
    endDate : '' // 结束时间
};

// 新增参数
let defaultNewItem = {
    editType: 'edit',
    dateValue : '', // 计划填报
    waterFactoryName:'',
    fillData:[],
};

const initState = {
    isAdministrator:false,
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    waterFactorySelect : [], // 水厂下拉数据
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
    showUploadModal: false,//导入显示隐藏
    importError: '',//导入报错信息
};

export default {

    namespace : 'productionPlan', // 生产计划

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/productionPlan') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求水厂下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    dispatch({ type: 'isAdministrator' });
                }
            })
        }
    },

    effects : {
        //判断是否为管理员
        *isAdministrator({ payload }, { call, put, select }) {
            const { data } = yield call(isAdministrator, {
                userId: VtxUtil.getUrlParam('userId')
            })
            if (data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        isAdministrator: data.data
                    }
                })
            }
        },
        // 水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            const { data } = yield call(loadWaterFactorySelect, {
                isControlPermission: '1'
            });
            yield put({ type: 'updateState', payload: { loading: false } });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)&&data.data[0]) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            waterFactorySelect : data.data,
                            searchParams:{
                                waterFactoryId:data.data[0].id
                            }
                        }
                    })
                    VtxUtil.delay(10)
                    yield put({ type: 'updateQueryParams' })
                    yield put({type:'getList'})
                }
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({productionPlan}) => productionPlan);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getProductionPlanList, VtxUtil.submitTrim(params));
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
        //获取初始填报数据
        *getDefaultProductionFill({ payload }, { call, put, select }) {
            const { queryParams, waterFactorySelect } = yield select(({ productionPlan}) => productionPlan)
            const {waterFactoryId} = queryParams
            const waterFactory= _find(waterFactorySelect, { id: waterFactoryId})
            const {data} = yield call(getDefaultProductionFill,{
                waterFactoryId
            })
            if (!!data && data.result == 0) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type:'updateState',
                        payload:{
                            newItem:{
                                waterFactoryName: waterFactory.name,
                                fillData:data.data.map((item,index)=>({
                                    ...item,
                                    key:index
                                }))
                            }
                        }
                    })
                }
            }
        },
        //获取详情
        *getDetail({ payload }, { call, put, select }) {
            const {id,itemName} = payload
            const {data} = yield call(getProductionPlanDetail,{
                id
            })
            if(data&&!data.result){
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type:'updateState',
                        payload:{
                            [itemName]:{
                                fillData:data.data
                            }
                        }
                    })
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            [itemName]: {
                                fillData: []
                            }
                        }
                    })
                }
            }
        },
        // 新增or编辑
        *saveOrUpdate({ payload }, { call, put, select }) {
            const { waterFactoryId } = yield select(({ productionPlan }) => productionPlan.queryParams)
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
           
            const { newItem, editItem } = yield select( ({productionPlan}) => productionPlan );
            const {
                id, dateValue,fillData
            } = payload.btnType === 'add' ? newItem : editItem;
            //验重
            if (payload.btnType === 'add') {
                const { data: checkData } = yield call(ifExistProductionPlan, {
                    dateValue, waterFactoryId 
                })
                if (!!checkData && checkData.result == 0 && checkData.data){//可以新增
                    let params = {
                        id, dateValue, waterFactoryId,
                        operateType: payload.operateType,
                        tenantId: VtxUtil.getUrlParam('tenantId'),
                        fillDetailDTOS: fillData
                    };
                    const { data } = yield call(
                        saveProductionPlan, VtxUtil.submitTrim(params));
                    if (!!data && data.result == 0) {
                        yield put({ type: 'getList' });
                        payload.onSuccess();
                    } else {
                        payload.onError(data ? data.msg : '保存失败');
                    }
                }else{
                    message.warn('该水厂在此年份已进行过填报！')
                }
            }else{
                let params = {
                    id, dateValue, waterFactoryId,
                    operateType: payload.operateType,
                    tenantId: VtxUtil.getUrlParam('tenantId'),
                    fillDetailDTOS: fillData
                };
                const { data } = yield call(
                    saveProductionPlan, VtxUtil.submitTrim(params));
                if (!!data && data.result == 0) {
                    yield put({ type: 'getList' });
                    payload.onSuccess();
                } else {
                    payload.onError(data ? data.msg : '保存失败');
                }
            }
            
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : false }
                }
            });
        },
        //审核
        *handleAudit({ payload }, { call, put, select }) {
            const { operateType } = payload
            const { id, auditMemo } = yield select(({ productionPlan }) => productionPlan.viewItem);
            yield put({
                type:'updateState',
                payload:{
                    viewItem:{
                        loading:true
                    }
                }
            })
            const {data} = yield call(auditProductionPlan,{
                id,
                auditMemo,
                operateType
            })
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: {
                        loading: false
                    }
                }
            })
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'提交审核失败');
            }
        },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(',')
            };
            const { data } = yield call(deleteProductionPlan, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
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
            const { waterFactorySelect} =state
            const firstWaterFactory = waterFactorySelect[0].id
            return {
                ...state,
                ...action.payload,
                currentPage : 1,
                pageSize : 10,
				 searchParams : {
                     ...initQueryParams,
                     waterFactoryId: firstWaterFactory
                },
                queryParams: {
                    ...initQueryParams,
                    waterFactoryId: firstWaterFactory
                },
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