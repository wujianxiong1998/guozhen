import { loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {message} from 'antd'
import { taskService } from "../services/maintainService";
import {generateTreeNameData, VtxUtil} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const defaultNewItem = {
    id: '',
    approveContent : '',  // 审批内容
    
};

const defaultMissionItem = {
    id: '',
    accRepareManId: '',  // 保养执行人id
    accRepareMan: '',  // 保养执行人
    completeTime : '',  // 养护时间
    picIds: [],  // 附件
};

const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],
    fileListVersion: 1,
    
    modelLonding: false,
    newItem : {...defaultNewItem},
    missionItem:{ ...defaultMissionItem},
    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据
    userInfo: {},
    userList: [],  // 人员树
    detail: {}
};

export default {
    namespace: 'maintainTask',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/maintainTask') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    dispatch({ type: 'getUserDetail' }).then(() => {
                        dispatch({ type: 'loadStaffTree' })
                    });
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {
        //获取当前用户信息
        * getUserDetail({ payload }, { call, put, select }) {
            const { data } = yield call(getUserDetail, {
                userId: VtxUtil.getUrlParam('userId')
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo: data.data
                    }
                })
            }
        },
        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const { userInfo } = yield select(state => state.maintainTask);
            const { data } = yield call(loadStaffTreeNew, {
                parameters: JSON.stringify({
                    tenantId: VtxUtil.getUrlParam('tenantId'),
                    companyId: userInfo.companyId
                })
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userList: generateTreeNameData(JSON.parse(data.data).items, ['staff'])
                    }
                })
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({maintainTask}) => maintainTask);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(taskService.getList, params);
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

        // 回单
        *publish({ payload },{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { missionItem } = yield select( ({maintainTask}) => maintainTask );
            let { id, accRepareManId, accRepareMan, completeTime, picIds } = missionItem;
            const params = {
                id,
                accRepareManId,
                accRepareMan,
                completeTime,
                picIds,
                dataStatus: payload.dataStatus
            };
            let { data } = yield call(taskService.publish, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('回单成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 审核
        *aduit({ payload },{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem } = yield select( ({maintainTask}) => maintainTask );
            let { id, approveContent } = newItem;
            const params = {
                id,
                approveContent ,
                auditStatus: payload.auditStatus
            };
            let { data } = yield call(taskService.aduit, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('审批成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids
            };
            const { data } = yield call(taskService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },

        //查看详情
        * getDetail({payload}, {call, put, select}) {
            const { newItem } = yield select( ({maintainTask}) => maintainTask );
            const {data} = yield call(taskService.detail, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        detail: data.data,
                    }
                });
            }
        },

        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id
            };
            const { data } = yield call(taskService.detail, params);
            if(!!data && !data.result){
                yield put({
                    type: 'updateState',
                    payload: {
                        getData: data.data
                    }
                })
            }
        }



    },

    reducers: {
        updateState(state,action){
            return {
                ...state,
                ...action.payload
            }
        },
        initParams(state,action) {
            return {
                ...state,
                newItem:{
                    ...defaultNewItem
                },
                missionItem:{
                    ...defaultMissionItem
                },
                attachmentIds: [],   // 附件
            }
        },
        initQueryParams(state,action) {
            return {
                ...state,
                ...action.payload,
                ...initQueryParams,
                currentPage : 1,
                pageSize : 10,
                queryParams : initQueryParams
            }
        },
        updateNewItem(state, action){
            return {
                ...state,
                newItem:{
                    ...state.newItem,
                    ...action.payload
                }
            }
        },
        updateMissionItem(state, action){
            return {
                ...state,
                missionItem:{
                    ...state.missionItem,
                    ...action.payload,
                }
            }
        },
        updateViewItem(state, action){
            return {
                ...state,
                viewItem:{
                    ...state.viewItem,
                    ...action.payload
                }
            }
        },
    }
}