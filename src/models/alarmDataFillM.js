import { alarmDataFillService, deleteService, alarmDataFillGetService } from "../services/alarmService";
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {loadEnum, loadWaterFactorySelect} from "../services/remoteData";
import {message} from 'antd';
import { generateTreeNameDataMul, VtxUtil} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备等级
    name: '',  // 项目名称
};

const defaultNewItem = {
    id: '',
    waterFactoryId: '',  // 污水处理厂
    libId: '',  // 报警指标
    upValue: '',  // 上限值
    downValue: '',  // 下限值
    sendPeopleId: [],  // 通知人员
    sendPeopleName: [],  // 通知人员
    sendPeopleIdName:[],
    typeCode: '',  // 类型
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
    userInfo:{},
    userList: [],  // 人员树
    waterFactoryList: [], //水厂列表
    libList: [], // 指标
    typeList: [
        {id: 'produce', name: '生产'},
        {id: 'assay', name: '化验'},
        {id: 'consum', name: '单耗'},
    ], //类型
};

export default {
    namespace: 'alarmDataFill',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/alarmDataFill') {
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
                    dispatch({type : 'loadWaterFactorySelect'});
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {

        // 获取水厂
        * loadWaterFactorySelect({payload}, {call, put, select}) {
            const {data} = yield call(loadWaterFactorySelect, {
                isControlPermission: 1
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            waterFactoryList: data.data
                        }
                    });
                }
            }
        },

        // 获取指标
        * loadLibSelect({ payload = {} }, {call, put, select}) {
            let {
                newItem
            } = yield select(({alarmDataFill}) => alarmDataFill);
            const { isEdit} = payload
            let { id,waterFactoryId, typeCode } = newItem;
            waterFactoryId = 'waterFactoryId' in payload ? payload.waterFactoryId : waterFactoryId;
            typeCode = 'typeCode' in payload ? payload.typeCode : typeCode;
            let params = {
                waterFactoryId,
                dataFillType: typeCode
            };
            const {data} = yield call(alarmDataFillGetService.detail, params);
            if (!isEdit){
                yield put({
                    type: 'updateNewItem',
                    payload: {
                        libId: ''
                    }
                })
            }
            
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.targetLibraryList)) {
                    if(!(waterFactoryId&&typeCode)){
                        yield put({
                            type: 'updateState',
                            payload: {
                                libList: [],

                            }
                        });
                    }else{
                        yield put({
                            type: 'updateState',
                            payload: {
                                libList: data.data.targetLibraryList,

                            }
                        });
                    }
                    
                }else{
                    yield put({
                        type: 'updateState',
                        payload: {
                            libList: [],

                        }
                    });
                }
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
            const { userInfo } = yield select(state => state.alarmDataFill);
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
                        userList: generateTreeNameDataMul(JSON.parse(data.data).items, ['staff'])
                    }
                })
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({alarmDataFill}) => alarmDataFill);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(alarmDataFillService.getList, params);
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
            const { newItem } = yield select( ({alarmDataFill}) => alarmDataFill );
            const { sendPeopleIdName} = newItem
            let sendPeopleIdArr = [],sendPeopleNameArr=[]
            sendPeopleIdName.map(item=>{
                sendPeopleIdArr.push(item.value);
                sendPeopleNameArr.push(item.label)
            })
            const params = {
                ...newItem,
                sendPeopleId: sendPeopleIdArr.join(','),
                sendPeopleName: sendPeopleNameArr.join(','),
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            delete params.sendPeopleIdName
            let { data } = yield call(alarmDataFillService.save, params);
            if(!!data && data.result == 0){
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
            const { newItem } = yield select( ({alarmDataFill}) => alarmDataFill );
            const { sendPeopleIdName } = newItem
            let sendPeopleIdArr = [], sendPeopleNameArr = []
            sendPeopleIdName.map(item => {
                sendPeopleIdArr.push(item.value);
                sendPeopleNameArr.push(item.label)
            })
            const params = {
                ...newItem,
                sendPeopleId: sendPeopleIdArr.join(','),
                sendPeopleName: sendPeopleNameArr.join(','),
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(alarmDataFillService.update, params);
            if(!!data && !data.result){
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
            };
            const { data } = yield call(alarmDataFillService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },
        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id,
                type: 'xjxmType',
            };
            const { data } = yield call(alarmDataFillService.detail, params);
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