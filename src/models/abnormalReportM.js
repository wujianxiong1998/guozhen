import { getAbnormalReportList, deleteAbnormalReport, saveAbnormalReport, loadExceptionSmallTypeSelect, assignMission, neglectAbnormalReport } from '../services/produtionService';
import { loadWaterFactorySelect, loadCommonParamSelect,loadEnum } from '../services/remoteData'
import { loadStaffTree }from '../services/commonIFS'
const u = require('updeep');
import { VtxUtil,generateUserTreeData } from '../utils/util';

// 查询条件
let initQueryParams = {
    startTime : '', // 上报时间
    endTime : '', // 上报时间
    exceptionStatus : '', // 异常状态
    waterFactoryId : '' // 运营厂
};

// 新增参数
let defaultNewItem = {
    waterFactoryId : undefined, // 运营厂
    exceptionTypeId : undefined, // 异常大类
    exceptionSmallTypeId : undefined, // 异常小类
    exceptionTypeList:[],//异常模版数据
    description : '', // 异常描述
    attachment : [],// 附件
    reportDate:'',
    exceptionStatus:''
};
//任务下达参数
let defaultAssignItem = {
    executeMan:'',//执行人
    taskName:'',//任务名称

}
const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    exceptionStatusSelect : [], // 异常状态下拉数据
    waterFactorySelect : [], // 运营厂下拉数据
    exceptionTypeSelect : [], // 异常大类下拉数据
    exceptionSmallTypeSelect : [], // 异常小类下拉数据
    userTree:[],//人员树
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
    assignItem:{
        visible:false,
        ...defaultAssignItem
    }
};

export default {

    namespace : 'abnormalReport', // 异常上报

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/abnormalReport') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    // 请求异常状态下拉数据
                    dispatch({type : 'loadAbnormalStatusSelect'});
                    // 请求运营厂下拉数据
                    dispatch({type : 'loadWaterFactorySelect'});
                    // 请求异常大类下拉数据
                    dispatch({type : 'loadExceptionTypeSelect'});
                    // 请求人员树
                    dispatch({ type: 'loadStaffTree' });
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 异常状态下拉
        *loadAbnormalStatusSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadEnum,{
                enumName :'ExceptionStatusEnum'
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            exceptionStatusSelect : data.data
                        }
                    })
                }
            }
        },

        // 运营厂下拉
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

        // 异常大类下拉
        *loadExceptionTypeSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadCommonParamSelect, {
                type: 'exceptionType',
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            exceptionTypeSelect : data.data
                        }
                    })
                }
            }
        },

        // 异常小类下拉
        *loadExceptionSmallTypeSelect({ payload }, { call, put, select }) {
            const { exceptionTypeId} = payload
            const { data } = yield call(loadExceptionSmallTypeSelect,{
                exceptionTypeId
            });
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type : 'updateState',
                        payload : {
                            exceptionSmallTypeSelect : data.data
                        }
                    })
                }
            }
        },
        //获取人员树
        * loadStaffTree({ payload }, { call, put, select }) {
            const { data } = yield call(loadStaffTree);
            if (!!data && data.result == 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userTree: generateUserTreeData(JSON.parse(data.data).items, ['staff'])
                    }
                })
            }
        },
        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({abnormalReport}) => abnormalReport);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getAbnormalReportList, VtxUtil.submitTrim(params));
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
        //任务下达
        *assignMission({ payload }, { call, put, select }) {
            yield put({
                type:'updateState',
                payload:{
                    assignItem:{
                        loading:true
                    }
                }
            })
            const {assignItem} = yield select(({abnormalReport}) => abnormalReport)
            const { executeMan, taskName, exceptionReportId}  = assignItem
            yield put({
                type: 'updateState',
                payload: {
                    assignItem: {
                        loading: false
                    }
                }
            })
            const {data} = yield call(assignMission,VtxUtil.submitTrim({
                executeMan, taskName, exceptionReportId, tenantId: VtxUtil.getUrlParam('tenantId')
            }))
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data ? data.msg : '操作失败');
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
            const { newItem, editItem } = yield select( ({abnormalReport}) => abnormalReport );
            const {
                id, waterFactoryId, exceptionTypeId, exceptionSmallTypeId, description, attachment, exceptionTypeList,
                reportDate, exceptionStatus
            } = payload.btnType === 'add' ? newItem : editItem;
            let params = {
                id,
                waterFactoryId,
                exceptionTypeId,
                exceptionSmallTypeId,
                reportDate, exceptionStatus,
                exceptionDescription:description,
                annex: JSON.stringify(attachment),
                exceptionTypeJson: JSON.stringify(exceptionTypeList),
                reportPerson : VtxUtil.getUrlParam('userId'),
                tenantId: VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call(saveAbnormalReport, VtxUtil.submitTrim(params));
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
                ids : ids.join(',')
            };
            const { data } = yield call(deleteAbnormalReport, params);
            if(!!data && data.result==0){
                payload.onSuccess(ids);
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
        //忽略
        *handleNeglect({ payload }, { call, put, select }) {
            const {id} = payload
            const {data} = yield call(neglectAbnormalReport,{
                id
            })
            if (!!data && data.result == 0) {
                payload.onSuccess();
            }
            else {
                payload.onError(data ? data.msg : '操作失败');
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
        },
        initAssignItem(state, action) {
            return {
                ...state,
                assignItem: {
                    ...defaultAssignItem
                }
            }
        }
    }
}