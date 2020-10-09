import {  auditSewageManagement, saveSewageManagement, getSewageManagementDetail,deleteSewageManagement,
    getDefaultSewageManagement, ifExistSewageManagement, getSevenDayData, isAdministrator, getSewageManagementList,getSewageReport } from '../services/sewageService';
import { loadWaterFactorySelect, calculateTargetValue, calculateConsumeTargetValue,loadRegionalCompanySelect,addSewageManagement,updateSewageManagement,
    addSewageReport,updateSewageReport
} from '../services/remoteData'
import {message} from 'antd'
const u = require('updeep');
import moment from 'moment'
import _find from 'lodash/find'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    regionalCompanyId: '',
    waterFactoryId: '',
    startTime: moment().format('YYYY-MM-DD'), // 开始时间
    endTime: moment().format('YYYY-MM-DD'),// 结束时间
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
    regionalCompanySelect : [], // 区域公司下拉数据
    waterFactorySelect: [], // 公司下拉
    sewageManagementSelect : [], // 水厂下拉数据
    currentPage : 1, // 页码
    pageSize : 10, // 每页条数
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

    namespace : 'sewageManagement', // 生产管理--数据填报

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/sewageManagement') {
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
                    dispatch({type : 'loadRegionalCompanySelect'});
                    dispatch({type : 'getList'});
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

        *getList({ payload = {} }, { call, put, select }) {
            
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams, searchParams
            } = yield select(({sewageManagement}) => sewageManagement);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(searchParams.dataFillType==='produce'?getSewageManagementList:getSewageReport, VtxUtil.submitTrim(params));
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
            if(searchParams.dataFillType==='produce') {
                dataSource.forEach(item=>{
                    item.envReport = item.envReport===true?'有':'无'
                    item.envScheme = item.envScheme===true?'有':'无'
                    item.contingencyPlan = item.contingencyPlan===true?'有':'无'
                })
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
    
           
        //获取详情
        *getDetail({ payload }, { call, put, select }) {
            const { id, itemName,dateValue } = payload
            const { data } = yield call(getSewageManagementDetail, {
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
        // *getDefaultSewageManagement({ payload }, { call, put, select }) {
        //     const { queryParams, sewageManagementSelect  } = yield select(({ sewageManagement }) => sewageManagement)
        //     const { sewageManagementId, dataFillType } = queryParams
        //     const sewageManagement = _find(sewageManagementSelect, { id: sewageManagementId })
        //     const { data } = yield call(getDefaultSewageManagement, {
        //         sewageManagementId,
        //         dataFillType
        //     })
        //     if (!!data && data.result == 0) {
        //         if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
        //             yield put({
        //                 type: 'updateState',
        //                 payload: {
        //                     newItem: {
        //                         sewageManagementName: sewageManagement.name,
        //                         fillData: data.data.targetLibraryList.map((item, index) => ({
        //                             ...item,
        //                             key: item.id
        //                         }))
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // },
     
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

        // 公司下拉
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



        *saveOrUpdate({ payload }, { call, put, select }) {
        	yield put({
                type : 'updateState',
                payload : {
                    [payload.btnType === 'add' ? 'newItem' : 'editItem'] : { loading : true }
                }
            });
            const { dataStatus, dataType, sewageManagementId} = payload
            const { newItem, editItem } = yield select( ({sewageManagement}) => sewageManagement );
            const {
                id, dateValue,fillData,
                regionalCompanyName,regionalCompanyId ,waterFactoryName,waterFactoryId,permissionCode,
                orgCode,legalRepresentative,issueUnit,
                mainContaminant,emissionsWay,dischargeOutletNum,
                dischargeOutletDistribution,scale,exeStandard,
                limitConcentrationVolume,yearLimitVolume,startDate,
                endDate,permitRemark,envReport,envScheme,contingencyPlan,
                remark,state, permission,username,password,
                concentrationCod,concentrationNh3n,concentrationTn,concentrationTp,date,name,pollutionCod,pollutionNh3n,
                pollutionTn,pollutionTp,
                waterVolume,
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                regionalCompanyId,waterFactoryId,permissionCode,
                orgCode,legalRepresentative,issueUnit,
                mainContaminant,emissionsWay,dischargeOutletNum,
                dischargeOutletDistribution,scale,exeStandard,
                limitConcentrationVolume,yearLimitVolume,startDate,
                endDate,permitRemark,envReport,envScheme,contingencyPlan,
                remark,state,permission,username,password,
                concentrationCod,concentrationNh3n,concentrationTn,concentrationTp,date,name,pollutionCod,pollutionNh3n,
                pollutionTn,pollutionTp,
                waterVolume,
                tenantId: VtxUtil.getUrlParam('tenantId')
            };
            if(dataType==='produce'&&payload.btnType === 'edit') {
                params.envReport = params.envReport==='有'?true:false
                params.envScheme = params.envScheme==='有'?true:false
                params.contingencyPlan = params.contingencyPlan==='有'?true:false
            }
            if(payload.btnType === 'edit') {
                params.id = id
            }
            if(dataType==='produce') {
                const { data } = yield call( payload.btnType === 'add' ? 
                addSewageManagement : updateSewageManagement, VtxUtil.submitTrim(params));
                if(!!data && data.result == 0) {
                    yield put({type:'getList'});
                    payload.onSuccess();
                } else {
                    payload.onError();
                }
            } else {
                const { data } = yield call( payload.btnType === 'add' ? 
                addSewageReport : updateSewageReport, VtxUtil.submitTrim(params));
                if(!!data && data.result == 0) {
                    yield put({type:'getList'});
                    payload.onSuccess();
                } else {
                    payload.onError();
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
        // *handleAudit({ payload }, { call, put, select }) {
        //     const { operateType } = payload
        //     const { id, auditMemo, dateValue  } = yield select(({ sewageManagement }) => sewageManagement.viewItem);
        //     yield put({
        //         type: 'updateState',
        //         payload: {
        //             viewItem: {
        //                 loading: true
        //             }
        //         }
        //     })
        //     const { data } = yield call(auditSewageManagement, {
        //         id,
        //         auditMemo,
        //         dateValue,
        //         operateType
        //     })
        //     yield put({
        //         type: 'updateState',
        //         payload: {
        //             viewItem: {
        //                 loading: false
        //             }
        //         }
        //     })
        //     if (!!data && data.result == 0) {
        //         yield put({ type: 'getList' });
        //         payload.onSuccess();
        //     } else {
        //         payload.onError(data ? data.msg : '提交审核失败');
        //     }
        // },
        // // 获取近七天数据
        // *getSevenDayData({ payload }, { call, put, select }) {
        //     const { dateValue, sewageManagementId, libraryId } = payload
        //     const {data} = yield call(getSevenDayData,{
        //         dateValue, sewageManagementId, libraryId
        //     })
        //     if(data&&!data.result){
        //         yield put({
        //             type:'updateState',
        //             payload:{
        //                 chartItem:{
        //                     xList:data.data.xData,
        //                     data:data.data.yData
        //                 }
        //             }
        //         })
        //     }
        // },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            const { queryParams, searchParams } = yield select(({ sewageManagement }) => sewageManagement)
            const { startTime,endTime} = queryParams
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(','),
                startTime, endTime
            };
            const { data } = yield call(deleteSewageManagement, params, searchParams);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
        //计算非原始指标
        // *calculateTargetValue({ payload = {} }, { call, put, select }) {
        //     const {itemName} = payload
        //     const { fillData } = yield select(({ sewageManagement }) => sewageManagement[itemName]);
        //     const { data } = yield call(calculateTargetValue, {
        //         tenantId: VtxUtil.getUrlParam('tenantId'),
        //         dataFillDetailJson: JSON.stringify(fillData)
        //     });
        //     if(data&&!data.result){
        //         if ('data' in data && Array.isArray(data.data)) {
        //             yield put({
        //                 type: 'updateState',
        //                 payload: {
        //                     [itemName]: {
        //                         fillData:data.data
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // },
        // //计算单耗非原始指标
        // *calculateConsumeTargetValue({ payload = {} }, { call, put, select }) {
        //     const { itemName } = payload
        //     const { queryParams } = yield select(({ sewageManagement }) => sewageManagement);
        //     const { sewageManagementId } = queryParams
        //     const { fillData, dateValue } = yield select(({ sewageManagement }) => sewageManagement[itemName]);
        //     const { data } = yield call(calculateConsumeTargetValue, {
        //         tenantId: VtxUtil.getUrlParam('tenantId'),
        //         fillDate:dateValue,
        //         sewageManagementId,
        //         zhswDataFillDetailDTOS: fillData
        //     });
        //     if (data && !data.result) {
        //         if ('data' in data && Array.isArray(data.data)) {
        //             yield put({
        //                 type: 'updateState',
        //                 payload: {
        //                     [itemName]: {
        //                         fillData: data.data
        //                     }
        //                 }
        //             })
        //         }
        //     }
        // },
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
        // initQueryParams(state,action) {
        //     const { regionalCompanySelect} =state
        //     const firstWaterFactory = regionalCompanySelect[0].id
        //     return {
        //         ...state,
        //         ...action.payload,
        //         currentPage : 1,
        //         pageSize : 10,
		// 		 searchParams : {
        //              ...initQueryParams,
        //              regionalCompanyId: firstWaterFactory
        //         },
        //         queryParams: {
        //             ...initQueryParams,
        //             regionalCompanyId: firstWaterFactory
        //         },
        //     }
        // },

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