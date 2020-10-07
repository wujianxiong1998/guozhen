import { alarmSetService, deleteService } from "../services/alarmService";
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {message} from 'antd';
import {loadEnum} from "../services/remoteData";
import { generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备等级
    name: '',  // 项目名称
};

const defaultNewItem = {
    id: '',
    code: '',  // 设备等级
    orderIndex1: '',  // 巡检项目
};


const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],

    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据
    
    modelLonding: false,
    newItem : {...defaultNewItem},

    AlertLocationSel: [],   // 报警位置
    AlertTypeSel: [],   // 报警类型
    AlertGradeSel: [],   // 报警级别
    userInfo:{},
    userList: [],  // 人员树
};

export default {
    namespace: 'alarmSet',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/alarmSet') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    dispatch({ type: 'getUserDetail' }).then(() => {
                        dispatch({ type: 'loadStaffTree' })
                    })
                    dispatch({type : 'loadAlertLocation'});
                    dispatch({type : 'loadAlertType'});
                    dispatch({type : 'loadAlertGrade'});
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {

        //获取报警位置
        * loadAlertLocation({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceStatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        AlertLocationSel: data.data
                    }
                })
            }
        },
        //获取报警类型
        * loadAlertType({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceStatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        AlertTypeSel: data.data
                    }
                })
            }
        },
        //获取报警级别
        * loadAlertGrade({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceStatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        AlertGradeSel: data.data
                    }
                })
            }
        },
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
            const { userInfo } = yield select(state => state.alarmSet);
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
            } = yield select(({alarmSet}) => alarmSet);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                type: 'xjxmType',
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(alarmSetService.getList, params);
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

        // 保存
        *save(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem } = yield select( ({alarmSet}) => alarmSet );
            let { id, code, name } = newItem;
            const params = {
                id,
                type: 'xjxmType',
                code,
                name,
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(alarmSetService.save, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 修改
        *update(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem } = yield select( ({alarmSet}) => alarmSet );
            let { id, code, name } = newItem;
            const params = {
                id,
                code,
                name,
                type: 'xjxmType',
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(alarmSetService.update, params);
            if(!!data && !data.result){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('修改成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
                type: 'xjxmType',
            };
            const { data } = yield call(deleteService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                // payload.onError( data ? data.msg : '删除失败' );
                deleteMessage(data);
            }
        },
        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id,
                type: 'xjxmType',
            };
            const { data } = yield call(alarmSetService.detail, params);
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
    }
}