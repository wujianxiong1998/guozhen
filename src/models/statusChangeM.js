import {
    deviceChangeService, wheatherAdminByUserIdService
} from "../services/overHaulService";
import {
    getStructureList,
    pageList,
} from '../services/accountInformation';
import {commonDelete, loadCommonParamSelect, loadEnum, loadWaterFactorySelect} from "../services/remoteData";
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {
    maintainType,
    getList,
    addSave,
    addUpdate,
    deleteEntity,
    publicS,
    get,
} from "../services/maintainService";
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const defaultNewItem = {
    id: '',
    structuresId: '',  // 安装位置
    deviceId: '',  // 设备ID
    name: '',  // 设备名称
    code: '',  // 设备编码
    deviceStatus: '',  // 状态
    changeReason: '',  // 变更原因
    auditPeopleId: '',  // 审批人ID
    auditPeopleName: '',  //审批人

    newDeviceStatus: '',  // 新状态
    newStructuresId: '',  // 新安装位置
    newStructuresName: '',  // 新安装位置
};

const defaultMissionItem = {
    auditMemo: '',  // 拒绝原因
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
    missionItem:{ ...defaultMissionItem, visible:false},
    userInfo: {},
    viewItem:{
        visible:false
    },
    getData: {}, // get 中的数据
    isGanStr: true,

    structureList: [],  //安装位置
    userList: [],  // 人员树
    maintainType: [],  // 养护类别
    equipmentStatus: [],  // 状态
    newStructureListSel: [],  // 新安装位置

    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },
};

export default {
    namespace: 'statusChange',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/statusChange') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    Promise.all([
                        dispatch({type: 'isGan'}),
                        dispatch({type: 'getUserDetail'}),
                        dispatch({type : 'getStructureList'}),
                        
                        dispatch({type: 'loadEquipmentStatus'}),
                        dispatch({type: 'getEquipmentList'}),
                    ]).then(() => {
                        dispatch({ type: 'loadStaffTree' });
                        dispatch({type: 'getList'});
                    });
                    
                }
            });
        }
    },

    effects: {
        //获取当前用户信息
        * getUserDetail({payload}, {call, put, select}) {
            const {data} = yield call(getUserDetail, {
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

        // 根据用户id判断是否是管理员
        * isGan({payload}, {call, put, select}) {
            const {data} = yield call(wheatherAdminByUserIdService.adminByUserId);
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        isGanStr: data
                    }
                })
            }
        },

        //获取设备状态
        * loadEquipmentStatus({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceStatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        equipmentStatus: data.data
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
                        structureList: data.data
                    }
                });
                return data.data;
            }
        },

        //获取安装位置
        * newStructureList({payload}, {call, put, select}) {
            const {data} = yield call(deviceChangeService.newStructureList, {id: payload.id});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        newStructureListSel: data.data
                    }
                });
                return data.data;
            }
        },

        //养护类别
        * getMaintainType({payload}, {call, put, select}) {
            let params = {
                enumName: 'DeviceMaintainTypeEnum'
            };
            const {data} = yield call(maintainType, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        maintainType: data.data
                    }
                });
                return data.data;
            }
        },

        //获取所属设备列表
        * getEquipmentList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.statusChange.equipmentSelect);
            let {
                newItem
            } = yield select(({statusChange}) => statusChange);
            const {data} = yield call(pageList, {
                ...searchParams,
                structuresId: newItem.structuresId
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
                message.error('获取数据失败，请稍后重试')
            }
        },

        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const { userInfo } = yield select(state => state.statusChange);
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
                pageSize, currentPage, queryParams, isGanStr
            } = yield select(({statusChange}) => statusChange);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize,
                workType: isGanStr?'zy':'gl'
            };
            const { data } = yield call(deviceChangeService.getList, params);
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
            const { newItem, newStructureListSel, userInfo } = yield select( ({statusChange}) => statusChange );
            // let { code, name, orderIndex } = newItem;
            let newSName = newStructureListSel.length === 0?'':newStructureListSel.filter(item => item.id === newItem.newStructuresId)[0].name;
            const params = {
                ...newItem,
                newStructuresName: newSName,
                submitPeopleId: userInfo.id,
                submitPeopleName: userInfo.name,
            };
            let { data } = yield call(deviceChangeService.save, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('新增成功');
            }else{
                message.error(data.msg);
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 审核
        *publish({ payload = {} },{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { missionItem } = yield select( ({statusChange}) => statusChange );
            let { id, auditMemo } = missionItem;
            const params = {
                id,
                auditMemo,
                auditStatus: payload.auditStatus
            };
            let { data } = yield call(deviceChangeService.audit, params);
            if(!!data && data.result == 0){
                // yield put({type:'initParams'});
                yield put({type:'getList'});
                message.success('审核成功');
            }else{
                // payload.onError( data ? data.msg : '删除失败' );
            };
            yield put({ type : 'updateState', payload : {modelLonding : false} });
        },

        // 修改
        *update(action,{select,call,put}){
            yield put({ type : 'updateState', payload : {modelLonding : true} });
            const { newItem, newStructureListSel } = yield select( ({statusChange}) => statusChange );
            let newSName = newStructureListSel.length === 0?'':newStructureListSel.filter(item => item.id === newItem.newStructuresId)[0].name;
            // let { id, code, name, orderIndex } = newItem;
            const params = {
                ...newItem,
                newStructuresName: newSName
            };
            let { data } = yield call(deviceChangeService.update, params);
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
                ids
            };
            const { data } = yield call(deleteEntity, params);
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
            const { data } = yield call(deviceChangeService.ignore, params);
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
            const { data } = yield call(get, params);
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
