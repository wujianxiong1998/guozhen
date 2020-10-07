import { getReportDelayAuditList, auditReportDelayAudit, deleteReportDelayAudit, saveReportDelayAudit } from '../services/produtionService';
import { loadWaterFactorySelect,loadEnum} from '../services/remoteData'

const u = require('updeep');
import { VtxUtil } from '../utils/util';

// 查询条件
let initQueryParams = {
    waterFactoryId : undefined, // 水厂名称
    applyStatus : undefined // 申请状态
};

// 新增参数
let defaultNewItem = {
    waterFactoryId : undefined, // 水厂名称
    date : '', // 报表日期
    delayReason : '', // 延期原因
    attachment : [] // 附件上传
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    waterFactorySelect : [], // 水厂名称下拉数据
    applyStatusSelect : [], // 申请状态下拉数据
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

    namespace : 'reportDelayAudit', // 数据上报延迟审批

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/reportDelayAudit') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求水厂名称下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    // 请求申请状态下拉数据
                    dispatch({type : 'loadApplyStatusSelect'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 水厂名称下拉
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

        // 申请状态下拉
        *loadApplyStatusSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadEnum,{
                enumName:'ApplyStatusEnum'
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            applyStatusSelect : data.data
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
            } = yield select(({reportDelayAudit}) => reportDelayAudit);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getReportDelayAuditList, VtxUtil.submitTrim(params));
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
            const { newItem, editItem } = yield select( ({reportDelayAudit}) => reportDelayAudit );
            const {
                id, waterFactoryId, date, delayReason, attachment,
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id,
                waterFactoryId,
                dateValue:date,
                delayReason,
                annx:JSON.stringify(attachment),
                tenantId : VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call( saveReportDelayAudit, VtxUtil.submitTrim(params));
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
                ids : ids.join(',')
            };
            const { data } = yield call(deleteReportDelayAudit, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
        //审核
        *handleAudit({ payload }, { call, put, select }) {
            const {applyStatus} = payload
            const { id, auditMemo } = yield select(({ reportDelayAudit }) => reportDelayAudit.viewItem);
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: {
                        loading: true
                    }
                }
            })
            const { data } = yield call(auditReportDelayAudit, {
                id,
                auditMemo,
                applyStatus
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