import {
    maintainType,
    patrolProjectService,
    patrolStandardService
} from "../services/maintainService";
import {message} from 'antd'
import {VtxUtil} from "../utils/util";

// 查询条件
let initQueryParams = {
    grade: '',  // 设备等级
    itemId: '',  // 项目名称
    name: '',  // 设备名称
};

const defaultNewItem = {
    id: '',
    code: '',  // 设备等级
};

const defaultUpdataItem = {
    id: '',
    deviceId: '',  // 设备
    deviceName: '',
    grade: '',  // 等级
    itemId: '',  // 项目
    itemName: '',
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
    updataItem : {...defaultUpdataItem},

    // 编辑
    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },

    equipmentSelectListD: [],
    equipmentSelectTotalD: 0,
    equipmentSelectD: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },

    projectDataSource: [],  // 巡检项目数据
    selectedRowKeysP : [],  // 项目
    deviceDataSource: [],  // 巡检设备数据
    selectedRowKeysD : [],  // 设备

    addProjectDataSource: [],  // 根据等级添加项目
    addDeviceDataSource: [],  // 根据等级添加设备

    addItem: {
        visible : false,
    },
    addCurrentPage : 1,
    addPageSize : 10,
    addLoading : false,
    addDataSource : [],
    addTotal : 0,
    addSelectedRowKeys : [],
    projectOrDevice: '',  // 判断是添加项目还是添加设备

    deviceGrade: [],   // 设备等级
    projectName: [],   // 搜索中项目下拉
};

export default {
    namespace: 'patrolStandard',

    state: initState,

    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, search }) => {
                if (pathname === '/patrolStandard') {
                    // 初始化state
                    dispatch({
                        type : 'updateState',
                        payload : {
                            ...initState,
                        }
                    });
                    dispatch({type : 'getMaintainType'});
                    dispatch({type : 'getList'});
                }
            });
        }
    },

    effects: {

        //设备等级
        * getMaintainType({payload}, {call, put, select}) {
            let params = {
                enumName: 'DeviceLevelEnum'
            };
            const {data} = yield call(maintainType, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        deviceGrade: data.data
                    }
                });
                return data.data;
            }
        },

        //搜索中项目下拉
        * projectSel({payload}, {call, put, select}) {
            let params = {
                type: 'xjxmType',
                code: payload.code,
            };
            const {data} = yield call(patrolProjectService.getListSel, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        projectName: data.data
                    }
                });
            }
        },

        // 新增中项目列表
        *getProjectList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {addLoading : true} });
            let {
                addPageSize, addCurrentPage, newItem
            } = yield select(({patrolStandard}) => patrolStandard);
            addCurrentPage = 'addCurrentPage' in payload ? payload.addCurrentPage : addCurrentPage;
            addPageSize = 'addPageSize' in payload ? payload.addPageSize : addPageSize;
            let params = {
                code: newItem.code,
                type: 'xjxmType',
                page : addCurrentPage - 1,
                size : addPageSize
            };
            const { data } = yield call(patrolProjectService.getList, params);
            let addProjectDataSource = [], addTotal = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    addProjectDataSource = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    addTotal = data.data.total;
                }
            }
            let uState = {
                addProjectDataSource,
                addTotal,
                addLoading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

        // 编辑中项目列表
        *getUpdateProjectList({ payload = {} }, { call, put, select }) {
            const {searchParams} = yield select(state => state.patrolStandard.equipmentSelect);
            let {
                updataItem
            } = yield select(({patrolStandard}) => patrolStandard);
            let params = {
                code: updataItem.grade,
                type: 'xjxmType',
                ...searchParams,
            };
            const { data } = yield call(patrolProjectService.getList, params);
            let equipmentSelectList = [], equipmentSelectTotal = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    equipmentSelectList = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    equipmentSelectTotal = data.data.total;
                }
            }
            let uState = {
                equipmentSelectList,
                equipmentSelectTotal,
                addLoading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

         // 编辑中设备列表
         *getUpdateDeviceList({ payload = {} }, { call, put, select }) {
            const {searchParams} = yield select(state => state.patrolStandard.equipmentSelectD);
            let {
                updataItem
            } = yield select(({patrolStandard}) => patrolStandard);
            let params = {
                grade: updataItem.grade,
                ...searchParams,
            };
            const { data } = yield call(patrolStandardService.getDevice, params);
            let equipmentSelectListD = [], equipmentSelectTotalD = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    equipmentSelectListD = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    equipmentSelectTotalD = data.data.total;
                }
            }
            let uState = {
                equipmentSelectListD,
                equipmentSelectTotalD,
                addLoading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

        // 新增中设备列表
        *getDeviceList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {addLoading : true} });
            let {
                addPageSize, addCurrentPage, newItem
            } = yield select(({patrolStandard}) => patrolStandard);
            addCurrentPage = 'addCurrentPage' in payload ? payload.addCurrentPage : addCurrentPage;
            addPageSize = 'addPageSize' in payload ? payload.addPageSize : addPageSize;
            let params = {
                grade: newItem.code,
                page : addCurrentPage - 1,
                size : addPageSize
            };
            const { data } = yield call(patrolStandardService.getDevice, params);
            let addDeviceDataSource = [], addTotal = 0, status = false;
            if(!!data && !data.result) {
                if('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    addDeviceDataSource = data.data.rows.map(item => ({
                        ...item, 
                        key : item.id
                    }));
                    addTotal = data.data.total;
                }
            }
            let uState = {
                addDeviceDataSource,
                addTotal,
                addLoading : false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type : 'updateState',
                payload : {...uState}
            })
        },

        // 获取列表
        *getList({ payload = {} }, { call, put, select }) {
            yield put({ type : 'updateState', payload : {loading : true} });
            let {
                pageSize, currentPage, queryParams
            } = yield select(({patrolStandard}) => patrolStandard);
           currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
           pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page : currentPage - 1,
                size : pageSize
            };
            const { data } = yield call(patrolStandardService.getList, params);
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
            const { newItem, deviceDataSource, projectDataSource } = yield select( ({patrolStandard}) => patrolStandard );
            const params = {
                grade: newItem.code,
                deviceIds: deviceDataSource.map(item => item.id).join(','),
                itemIds: projectDataSource.map(item => item.id).join(','),
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(patrolStandardService.save, params);
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
            const { updataItem } = yield select( ({patrolStandard}) => patrolStandard );
            let { id, deviceId, grade, itemId } = updataItem;
            const params = {
                id,
                deviceId,
                grade,
                itemId,
                tenantId:VtxUtil.getUrlParam('tenantId'),
            };
            let { data } = yield call(patrolStandardService.update, params);
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
            const { data } = yield call(patrolStandardService.delete, params);
            if(!!data && !data.result){
                yield put({type:'getList'});
                payload.onSuccess();
            }
            else{
                payload.onError( data ? data.msg : '删除失败' );
            }
        },

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
                updataItem:{
                    ...defaultUpdataItem
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
        updateUpdateItem(state, action){
            return {
                ...state,
                updataItem:{
                    ...state.updataItem,
                    ...action.payload
                }
            }
        },
        updateAddItem(state, action){
            return {
                ...state,
                addItem:{
                    ...state.addItem,
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

        clearEquipmentSearchParamsD(state, {payload}) {
            return {
                ...state,
                equipmentSelectD: {
                    ...state.equipmentSelectD,
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    }
                },
            }
        },
        updateEquipmentSearchParamsD(state, {payload}) {
            return {
                ...state,
                equipmentSelectD: {
                    ...state.equipmentSelectD,
                    searchParams: {
                        ...state.equipmentSelectD.searchParams,
                        ...payload
                    }
                },
            }
        },
    }
}