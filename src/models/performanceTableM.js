import {  auditSewageManagement, saveSewageManagement, getSewageManagementDetail,deleteSewageManagement,
    getDefaultSewageManagement, ifExistSewageManagement, getSevenDayData, isAdministrator, getSewageManagementList } from '../services/sewageService';
import { loadWaterFactorySelect, calculateTargetValue, calculateConsumeTargetValue} from '../services/remoteData'
import {message} from 'antd'
const u = require('updeep');
import moment from 'moment'
import _find from 'lodash/find'
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    regionalCompanyId: '',
    waterFactoryId: '',
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
    sewageManagementSelect : [], // 水厂下拉数据
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

    namespace : 'performanceTable', // 生产管理--数据填报

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/performanceTable') {
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
                            sewageManagementSelect : data.data,
                            searchParams:{
                                sewageManagementId:data.data[0].id
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
                pageSize, currentPage, queryParams, searchParams
            } = yield select(({performanceTable}) => performanceTable);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getSewageManagementList, VtxUtil.submitTrim(params));
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
                dataSource = [
                    { a: '制作', b: '2020-9-28', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '10', k: '11', l: '12', m: '13', n: '14', o: '15', p: '16', q: '17', r: '18', s: '19', t: '20', s: '21', t: '22', u: '23', v: '24' },
                    { a: '制作', b: '2020-9-28', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '10', k: '11', l: '12', m: 'ss', n: '14', o: 'av', p: '16', q: '17', r: 'ss', s: '19', t: '20', s: '21', t: '22', u: 'ww', v: 'qq' },
                ]
                title = [
                    { value: '区域', key: 'a' },
                    { value: '公司名称', key: 'b' },
                    { value: '证书编号', key: 'c' },
                    { value: '组织机构代码', key: 'd' },
                    { value: '法定代表人', key: 'e' },
                    { value: '发证单位', key: 'f' },
                    { value: '主要污染物种类及限排污染物名称', key: 'g' },
                    { value: '排放方式', key: 'h' },
                    { value: '排放口数量(座)', key: 'i' },
                    { value: '排放口分布情况', key: 'j' },
                    { value: '设计规模', key: 'k' },
                    { value: '执行的污染物排放标准', key: 'l' },
                    { value: '主要污染物排放浓度限值', key: 'm' },
                    { value: '年度污染物排放限值', key: 'n' },
                    { value: '排污许可证发证日期', key: 'o' },
                    { value: '排污许可证有效期', key: 'p' },
                    { value: '排污许可备注', key: 'q' },
                    { value: '环境影响评价报告', key: 'r' },
                    { value: '环境自行监测方案', key: 's' },
                    { value: '突发环境应急预案', key: 't' },
                    { value: '备注', key: 'u' },
                    { value: '排污许可证状态', key: 'v' }
                ]
            if(searchParams.dataFillType !== 'produce') {
                dataSource = [
                    { a: '制作', b: '2020-9-28', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '10', k: '11', l: '12', m: '13', n: '14', o: '15', p: '16', q: '17', r: '18', s: '19', t: '20', s: '21', t: '22', u: '23', v: '24' },
                    { a: '制作', b: '2020-9-28', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '10', k: '11', l: '12', m: 'ss', n: '14', o: 'av', p: '16', q: '17', r: 'ss', s: '19', t: '20', s: '21', t: '22', u: 'ww', v: 'qq' },
                    { a: '制作', b: '2020-9-28', c: '3', d: '4', e: '5', f: '6', g: '7', h: '8', i: '9', j: '10', k: '11', l: '12', m: 'ss', n: '14', o: 'av', p: '16', q: '17', r: 'ss', s: '19', t: '20', s: '21', t: '22', u: 'ww', v: 'qq' },
                ]
                title = [
                    { value: '区域', key: 'a',render: (text, record, index)=>{ return (<tr><td>1111</td><td>222</td></tr>) } },
                    { value: '公司名称', key: 'b',colSpan: 2 },
                    { value: '证书编号', key: 'c',colSpan: 0 },
                    { value: '组织机构代码', key: 'd',colSpan: 0 },
                    { value: '法定代表人', key: 'e',colSpan: 1 },
                    { value: '发证单位', key: 'f' },
                    { value: '主要污染物种类及限排污染物名称', key: 'g' },
                    { value: '排放方式', key: 'h' },
                    { value: '排放口数量(座)', key: 'i' },
                    { value: '排放口分布情况', key: 'j' },
                    { value: '设计规模', key: 'k' },
                    { value: '执行的污染物排放标准', key: 'l' },
                    { value: '主要污染物排放浓度限值', key: 'm' },
                    { value: '年度污染物排放限值', key: 'n' },
                    { value: '排污许可证发证日期', key: 'o' },
                    { value: '排污许可证有效期', key: 'p' },
                    { value: '排污许可备注', key: 'q' },
                    { value: '环境影响评价报告', key: 'r' },
                    { value: '环境自行监测方案', key: 's' },
                    { value: '突发环境应急预案', key: 't' },
                    { value: '备注', key: 'u' },
                    { value: '排污许可证状态', key: 'v' }
                ]
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
        *getDefaultSewageManagement({ payload }, { call, put, select }) {
            const { queryParams, sewageManagementSelect  } = yield select(({ performanceTable }) => performanceTable)
            const { sewageManagementId, dataFillType } = queryParams
            const sewageManagement = _find(sewageManagementSelect, { id: sewageManagementId })
            const { data } = yield call(getDefaultSewageManagement, {
                sewageManagementId,
                dataFillType
            })
            if (!!data && data.result == 0) {
                if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            newItem: {
                                sewageManagementName: sewageManagement.name,
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
            const { dataStatus, dataType, sewageManagementId} = payload
            const { newItem, editItem } = yield select( ({performanceTable}) => performanceTable );
            const {
                id, dateValue,fillData
            } = payload.btnType === 'add' ? newItem : editItem;
            if(payload.btnType==='add'){
                const { data: checkData } = yield call(ifExistSewageManagement,{
                    dateValue, sewageManagementId,
                    dataFillType:dataType
                })
                if (!!checkData && checkData.result == 0 && checkData.data) {//可以新增
                    let params = {
                        id, dateValue, dataStatus, dataType,
                        dataFillDetailJson: JSON.stringify(fillData),
                        sewageManagementId,
                        tenantId: VtxUtil.getUrlParam('tenantId')
                    };
                    const { data } = yield call(saveSewageManagement, VtxUtil.submitTrim(params));
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
                    sewageManagementId,
                    tenantId: VtxUtil.getUrlParam('tenantId')
                };
                const { data } = yield call(saveSewageManagement, VtxUtil.submitTrim(params));
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
            const { id, auditMemo, dateValue  } = yield select(({ performanceTable }) => performanceTable.viewItem);
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(auditSewageManagement, {
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
            const { dateValue, sewageManagementId, libraryId } = payload
            const {data} = yield call(getSevenDayData,{
                dateValue, sewageManagementId, libraryId
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
            const { queryParams } = yield select(({ performanceTable }) => performanceTable)
            const { startTime,endTime} = queryParams
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(','),
                startTime, endTime
            };
            const { data } = yield call(deleteSewageManagement, params);
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
            const { fillData } = yield select(({ performanceTable }) => performanceTable[itemName]);
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
            const { queryParams } = yield select(({ performanceTable }) => performanceTable);
            const { sewageManagementId } = queryParams
            const { fillData, dateValue } = yield select(({ performanceTable }) => performanceTable[itemName]);
            const { data } = yield call(calculateConsumeTargetValue, {
                tenantId: VtxUtil.getUrlParam('tenantId'),
                fillDate:dateValue,
                sewageManagementId,
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
            const { sewageManagementSelect} =state
            const firstWaterFactory = sewageManagementSelect[0].id
            return {
                ...state,
                ...action.payload,
                currentPage : 1,
                pageSize : 10,
				 searchParams : {
                     ...initQueryParams,
                     sewageManagementId: firstWaterFactory
                },
                queryParams: {
                    ...initQueryParams,
                    sewageManagementId: firstWaterFactory
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