import { getAbormoalTaskList,deleteAbormoalTask,uploadAbormoalTask,auditAbormoalTask } from '../services/produtionService';
import { loadEnum} from '../services/remoteData';
import { loadStaffTree } from '../services/commonIFS'
const u = require('updeep');
import { VtxUtil, generateUserTreeData } from '../utils/util';

// 查询条件
let initQueryParams = {
    startTime : '', // 开始时间
    endTime : '', // 结束时间
    taskDealStatus:'',//任务状态
};

// 新增参数
let defaultNewItem = {
    dealMan : undefined, // 异常处理人
    handleDate : '', // 处理日期
    handleContent : '', // 处理内容
    attachment : [] // 附件
};

const initState = {
    searchParams : {...initQueryParams}, // 搜索参数
    queryParams : {...initQueryParams}, // 查询列表参数
    taskDealStatusSelect:[],//任务状态下拉
    userTree : [], // 人员树
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

    namespace : 'abnormalTask', // 异常任务

    state : {...initState},

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if(pathname === '/abnormalTask') {
					// 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState
                        }
                    })
                    
                    dispatch({ type:'loadAbnormalStatusSelect'})
                    dispatch({ type: 'loadStaffTree'});
                    dispatch({type : 'getList'});
                }
            })
        }
    },

    effects : {
        // 任务状态下拉
        *loadAbnormalStatusSelect({ payload }, { call, put, select }) {
            const { data } = yield call(loadEnum, {
                enumName: 'TaskDealStatusEnum'
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            taskDealStatusSelect: data.data
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
            } = yield select(({abnormalTask}) => abnormalTask);
        	currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
        	pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage-1,
                size : pageSize
            };
            const { data } = yield call(getAbormoalTaskList, VtxUtil.submitTrim(params));
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
        
        // 上传回单
        *uploadAbormoalTask({ payload }, { call, put, select }) {
        	yield put({
                type : 'updateState',
                payload : {
                   editItem : { loading : true }
                }
            });
            const { editItem } = yield select( ({abnormalTask}) => abnormalTask );
            const {
                exceptionTaskId, dealMan, handleDate, handleContent,
            } = editItem
            let params = {
                exceptionTaskId, dealMan,
                taskDealDate:handleDate,
                content:handleContent,
                tenantId : VtxUtil.getUrlParam('tenantId')
            };
            const { data } = yield call(uploadAbormoalTask , VtxUtil.submitTrim(params));
            if(!!data && data.result == 0) {
                yield put({type:'getList'});
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'上传失败');
            }
        	yield put({
                type : 'updateState',
                payload : {
                    editItem : { loading : false }
                }
            });
        },
        //审核
        *audit({ payload }, { call, put, select }) {
            const { auditStatus} = payload
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: { loading: true }
                }
            });
            const { id,auditContent } = yield select(({ abnormalTask }) => abnormalTask.viewItem);
            const {data} = yield call(auditAbormoalTask,{
                id,
                auditContent,
                auditStatus,
            })
            if (!!data && data.result == 0) {
                yield put({ type: 'getList' });
                payload.onSuccess();
            } else {
                payload.onError(data?data.msg:'操作失败');
            }
            yield put({
                type: 'updateState',
                payload: {
                    viewItem: { loading: false }
                }
            });
        },
        // 删除
        *deleteItems({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids : ids.join(',')
            };
            const { data } = yield call(deleteAbormoalTask, params);
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