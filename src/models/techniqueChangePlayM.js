import {
    getStructureList,
    pageList,
} from '../services/accountInformation';
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {
    techniqueChangePlayService, deleteService
} from "../services/overHaulService";
import {loadEnum} from "../services/remoteData";
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
    dataStatus: '',  // 状态
};

const defaultNewItem = {
    id: '',
    structuresId: '全部',  // 安装位置
    structuresName: '',
    deviceId: '',  // 设备ID
    name: '全部',  // 设备名称
    code: '',  // 设备编码
    planDateStr: '',  // 计划执行时间
    planMoney: '',  // 预算总价
    reason: '',  // 描述
    specificThing: '',  // 具体事项

    chargeManId: '',  // 养护人id
    chargeManName: '',  // 养护人
};

const defaultMissionItem = {
    code: '',  // 养护人
    repareManId: '',  // 养护人id
    repareMan: '',  // 养护人
};


const initState = {
    queryParams : {...initQueryParams},
    currentPage : 1,
    pageSize : 10,
    loading : false,
    dataSource : [],
    total : 0,
    selectedRowKeys : [],
    
    modelLonding: false,
    newItem : {...defaultNewItem},
    missionItem:{ ...defaultMissionItem},
    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据

    structureList: [],  //安装位置
    userInfo:{},
    userList: [],  // 人员树
    statusSel: [],  // 状态

    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },

    structuresTotal: 0,  // 安装位置total
};

export default {
    namespace: 'techniqueChangePlay',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/techniqueChangePlay') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    Promise.all([
                        dispatch({type : 'getStructureList'}),
                        dispatch({type: 'getEquipmentList'}),
                        
                        dispatch({type: 'getUserDetail'}),
                        dispatch({type: 'loadFailureStatus'}),
                    ]).then(() => {
                        dispatch({type: 'loadStaffTree'});
                        dispatch({type: 'getList'});
                    });
                    
                }
            });
        }
    },

    effects: {

        //获取故障状态
        * loadFailureStatus({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceBigRepareStatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        statusSel: data.data,
                    }
                })
            }
        },

        //获取安装位置
        * getStructureList({payload}, {call, put, select}) {
            const {data} = yield call(getStructureList);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        structureList: data.data,
                        structuresTotal: data.data.length
                    }
                });
                return data.data;
            }
        },

        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const { userInfo } = yield select(state => state.techniqueChangePlay);
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

        //获取当前用户信息
        * getUserDetail({payload}, {call, put, select}) {
            const {missionItem} = yield select(state => state.techniqueChangePlay.equipmentSelect);
            const {data} = yield call(getUserDetail, {
                userId: VtxUtil.getUrlParam('userId')
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        userInfo:data.data,
                        missionItem: {
                            ...missionItem,
                            repareManId: data.data.id,
                            repareMan: data.data.name
                        },
                    }
                })
            }
        },

        //获取所属设备列表
        * getEquipmentList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.techniqueChangePlay.equipmentSelect);
            let {
                newItem
            } = yield select(({techniqueChangePlay}) => techniqueChangePlay);
            const {data} = yield call(pageList, {
                ...searchParams,
                structuresId: newItem.structuresId === '全部'?'':newItem.structuresId
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        equipmentSelectList: data.data.rows.map(item => ({
                            ...item,
                            key : item.id
                        })),
                        equipmentSelectTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试');
            }
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({techniqueChangePlay}) => techniqueChangePlay);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(techniqueChangePlayService.getList, params);
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
            const { newItem, structureList, structuresTotal, equipmentSelectTotal } = yield select( ({techniqueChangePlay}) => techniqueChangePlay );
            // let { code, name, orderIndex } = newItem;
            let structuresName = newItem.structuresId === '全部'?'全部':structureList.filter(item => item.id === newItem.structuresId)[0].name;
            let structuresId = newItem.structuresId === '全部'?'':newItem.structuresId;
            console.log(structureList.filter(item => item.id === newItem.structuresId)[0])
            const params = {
                ...newItem,
                structuresName,
                structuresId,
                userId: VtxUtil.getUrlParam('userId'),
                structuresNum: newItem.structuresId === '全部'?structuresTotal:1,
                deviceNum: newItem.name === '全部'?equipmentSelectTotal:1
            };
            let { data } = yield call(techniqueChangePlayService.save, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 编辑
        *update(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem, structureList, structuresTotal, equipmentSelectTotal } = yield select( ({techniqueChangePlay}) => techniqueChangePlay );
            let structuresName = newItem.structuresId === '全部'?'全部':structureList.filter(item => item.id === newItem.structuresId)[0].name;
            let structuresId = newItem.structuresId === '全部'?'':newItem.structuresId;
            const params = {
                ...newItem,
                structuresName,
                structuresId,
                userId: VtxUtil.getUrlParam('userId'),
                structuresNum: newItem.structuresId === '全部'?structuresTotal:1,
                deviceNum: newItem.name === '全部'?equipmentSelectTotal:1
            };
            let { data } = yield call(techniqueChangePlayService.update, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('编辑成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // // 任务下达
        // *publish(action,{select,call,put}){
        //     yield put({ type : 'updateState', payload : {modelLonding : true} });
        //     const { missionItem } = yield select( ({techniqueChangePlay}) => techniqueChangePlay );
        //     let { id, repareManId, repareMan } = missionItem;
        //     console.log(missionItem);
        //     const params = {
        //         id,
        //         repareManId,
        //         repareMan
        //     };
        //     let { data } = yield call(techniqueChangePlayService.publish, params);
        //     if(!!data && data.result == 0){
        //         // yield put({type:'initParams'});
        //         yield put({type:'getList'});
        //         message.success('任务下达成功');
        //     }else{
        //         message.error(data.msg);
        //     };
        //     yield put({ type : 'updateState', payload : {modelLonding : false} });
        // },

        // 任务下达
        *publish({ payload }, { call, put, select }) {
            let { id, repareManId, repareMan } = payload;
            const params = {
                id, repareManId, repareMan
            };
            const { data } = yield call(techniqueChangePlayService.publish, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '派发失败' );
            }
        },


        // 删除
        *delete({ payload }, { call, put, select }) {
            let { ids = [] } = payload;
            const params = {
                ids,
                type: 'techniqueChangePlan'
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
        // 撤销
        *ignore({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id,
            };
            const { data } = yield call(techniqueChangePlayService.ignore, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '撤销失败' );
                // deleteMessage(data);
            }
        },
        // get
        *getD({ payload }, { call, put, select }) {
            let { id = [] } = payload;
            const params = {
                id
            };
            const { data } = yield call(techniqueChangePlayService.detail, params);
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
                }
            }
        },
        updateMissionItem(state, action){
            return {
                ...state,
                missionItem:{
                    ...state.missionItem,
                    ...action.payload
                }
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
                    ...action.payload
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

        clearEquipmentSearchParams(state, {payload}) {
            return {
                ...state,
                equipmentSelect: {
                    ...state.equipmentSelect,
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    }
                },
            }
        },
        updateEquipmentSearchParams(state, {payload}) {
            return {
                ...state,
                equipmentSelect: {
                    ...state.equipmentSelect,
                    searchParams: {
                        ...state.equipmentSelect.searchParams,
                        ...payload
                    }
                },
            }
        },
    }
}
