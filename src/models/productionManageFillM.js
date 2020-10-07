import { getProductionManageFillList, auditProductionManageFill, saveProductionManageFill, getProductionManageFillDetail,deleteProductionManageFill,
    getDefaultProductionManageFill, ifExistProductionManageFill, getSevenDayData, isAdministrator } from '../services/produtionService';
import { loadWaterFactorySelect, calculateTargetValue, calculateConsumeTargetValue} from '../services/remoteData'
import {message} from 'antd'
const u = require('updeep');
import moment from 'moment'
import _find from 'lodash/find'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂
    quickDate: moment().format('YYYY-MM'), // 时间快速选择
    startTime: moment().startOf('month').format('YYYY-MM-DD'), // 开始时间
    endTime: moment().format('YYYY-MM-DD'), // 结束时间
    dataFillType: VtxUtil.getUrlParam('menuTab') || 'produce',//填报类型
};

// 新增参数
let defaultNewItem = {
    editType: 'edit',
    dateValue : '', // 计划填报
    fillData:[],
};

const initState = {
    isAdministrator:false,//是否为管理员
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    waterFactorySelect : [], // 水厂下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
    title:[],
    loading : false, // 列表是否loading
    dataSource : [], // 列表数据源
    total : 0, // 列表总条数
    selectedRowKeys : [],
    selectedRows:[],
    newItem : {...defaultNewItem}, // 新增参数
    editItem:{ // 编辑参数
        visible:false,
        loading:false
    },
    viewItem: { // 查看参数
        visible:false
    },
    chartItem:{
        name:'',//指标名称
        unit:'',//单位
        visible:false,
        xList:[],
        data:[],
    },
    showUploadModal: false,//导入显示隐藏
    importError: '',//导入报错信息
};

export default {

    namespace : 'productionManageFill', // 生产管理--数据填报

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/productionManageFill') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                            searchParams:{
                                dataFillType: VtxUtil.getUrlParam('menuTab')||'produce'
                            },
                            queryParams:{
                                dataFillType: VtxUtil.getUrlParam('menuTab') || 'produce'
                            }
                        }
                    })
                    dispatch({ type: 'isAdministrator' });
                    // 请求水厂下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                }
            })
        }
    },

    effects : {
        //判断是否为管理员
        *isAdministrator({ payload }, { call, put, select }) {
            const {data} = yield call(isAdministrator,{
                userId: VtxUtil.getUrlParam('userId')
            })
            if(data&&!data.result){
                yield put({
                    type:'updateState',
                    payload:{
                        isAdministrator:data.data
                    }
                })
            }
        },
        // 水厂下拉
        *loadWaterFactorySelect({ payload }, { call, put, select }) {
            yield put({ type: 'updateState', payload: { loading: true } });
            const { data } = yield call(loadWaterFactorySelect,{
                isControlPermission:'1'
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
            } = yield select(({productionManageFill}) => productionManageFill);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getProductionManageFillList, VtxUtil.submitTrim(params));
            let dataSource = [], total = 0, title = [],status = false;
            if(!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.resultList.rows) && Array.isArray(data.data.titleName)) {
                    const result = data.data;
                    status = true;
                    dataSource = result.resultList.rows;
                    total = result.resultList.total;
                    title = result.titleName;
                    if (result.titleName && result.titleName.length === 0) {
                        message.warn('该水厂未配置指标')
                    }
                }
            }
            let uState = {
                title,
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
        //获取详情
        *getDetail({ payload }, { call, put, select }) {
            const { id, itemName,dateValue } = payload
            const { data } = yield call(getProductionManageFillDetail, {
                id,
                dateValue
            })
            if (data && !data.result) {
                if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            [itemName]: {
                                ...data.data,
                                fillData: data.data.targetLibraryList
                            }
                        }
                    })
                }
            }
        },
        //获取初始填报数据
        *getDefaultProductionManageFill({ payload }, { call, put, select }) {
            const { queryParams, waterFactorySelect  } = yield select(({ productionManageFill }) => productionManageFill)
            const { waterFactoryId, dataFillType } = queryParams
            const waterFactory = _find(waterFactorySelect, { id: waterFactoryId })
            const { data } = yield call(getDefaultProductionManageFill, {
                waterFactoryId,
                dataFillType
            })
            if (!!data && data.result == 0) {
                if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            newItem: {
                                waterFactoryName: waterFactory.name,
                                fillData: data.data.targetLibraryList.map((item, index) => ({
                                    ...item,
                                    key: item.id
                                }))
                            }
                        }
                    })
                }
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
            const { dataStatus, dataType, waterFactoryId} = payload
            const { newItem, editItem } = yield select( ({productionManageFill}) => productionManageFill );
            const {
                id, dateValue,fillData
            } = payload.btnType === 'add' ? newItem : editItem;
            if(payload.btnType==='add'){
                const { data: checkData } = yield call(ifExistProductionManageFill,{
                    dateValue, waterFactoryId,
                    dataFillType:dataType
                })
                if (!!checkData && checkData.result == 0 && checkData.data) {//可以新增
                    let params = {
                        id, dateValue, dataStatus, dataType,
                        dataFillDetailJson: JSON.stringify(fillData),
                        waterFactoryId,
                        tenantId: VtxUtil.getUrlParam('tenantId')
                    };
                    const { data } = yield call(saveProductionManageFill, VtxUtil.submitTrim(params));
                    if (!!data && data.result == 0) {
                        yield put({ type: 'getList' });
                        payload.onSuccess();
                    } else {
                        payload.onError(data ? data.msg : '保存失败');
                    }
                }else{
                    message.warn('该水厂在当天已进行过填报！')
                }
            }else{
                let params = {
                    id, dateValue, dataStatus, dataType,
                    dataFillDetailJson: JSON.stringify(fillData),
                    waterFactoryId,
                    tenantId: VtxUtil.getUrlParam('tenantId')
                };
                const { data } = yield call(saveProductionManageFill, VtxUtil.submitTrim(params));
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
            const { id, auditMemo, dateValue  } = yield select(({ productionManageFill }) => productionManageFill.viewItem);
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(auditProductionManageFill, {
                id,
                auditMemo,
                dateValue,
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
                payload.onError(data ? data.msg : '提交审核失败');
            }
        },
        // 获取近七天数据
        *getSevenDayData({ payload }, { call, put, select }) {
            const { dateValue, waterFactoryId, libraryId } = payload
            const {data} = yield call(getSevenDayData,{
                dateValue, waterFactoryId, libraryId
            })
            if(data&&!data.result){
                yield put({
                    type:'updateState',
                    payload:{
                        chartItem:{
                            xList:data.data.xData,
                            data:data.data.yData
                        }
                    }
                })
            }
        },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            const { queryParams } = yield select(({ productionManageFill }) => productionManageFill)
            const { startTime,endTime} = queryParams
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(','),
                startTime, endTime
            };
            const { data } = yield call(deleteProductionManageFill, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
        //计算非原始指标
        *calculateTargetValue({ payload = {} }, { call, put, select }) {
            const {itemName} = payload
            const { fillData } = yield select(({ productionManageFill }) => productionManageFill[itemName]);
            const { data } = yield call(calculateTargetValue, {
                tenantId: VtxUtil.getUrlParam('tenantId'),
                dataFillDetailJson: JSON.stringify(fillData)
            });
            if(data&&!data.result){
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            [itemName]: {
                                fillData:data.data
                            }
                        }
                    })
                }
            }
        },
        //计算单耗非原始指标
        *calculateConsumeTargetValue({ payload = {} }, { call, put, select }) {
            const { itemName } = payload
            const { queryParams } = yield select(({ productionManageFill }) => productionManageFill);
            const { waterFactoryId } = queryParams
            const { fillData, dateValue } = yield select(({ productionManageFill }) => productionManageFill[itemName]);
            const { data } = yield call(calculateConsumeTargetValue, {
                tenantId: VtxUtil.getUrlParam('tenantId'),
                fillDate:dateValue,
                waterFactoryId,
                zhswDataFillDetailDTOS: fillData
            });
            if (data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            [itemName]: {
                                fillData: data.data
                            }
                        }
                    })
                }
            }
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