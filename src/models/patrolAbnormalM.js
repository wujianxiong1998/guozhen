import {
    maintainType,
    patrolProjectService,
    patrolStandardService,
    patrolInspectionService
} from "../services/maintainService";
import {pageList as getFaultList} from '../services/faultType';
import {getUserDetail, loadStaffTreeNew} from "../services/commonIFS";
import {
    getStructureList,
} from '../services/accountInformation';
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage} from "../utils/util";

// 查询条件
let initQueryParams = {
    grade: '',  // 设备等级
    itemId: '',  // 项目名称
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const defaultNewItem = {
    id: '',
    structuresId: '',  // 安装位置
    deviceId: '',  // 设备名称id
    deviceName: '',  // 设备名称
    grade: '',
    itemId: '',  // 巡检项目
    inspectionManId: '',  // 巡检人员
    inspectionMan: '',
    inspectionTime: '',  // 巡检时间
    inspectionAbnormal: '',  // 巡检异常
    fileIds: '',  // 图片
};

const defaultMissionItem = {
    id: '',
    enable: false,  // 是否合并同类异常
};

const defaultHandleItem = {
    id: '',
    actInspectionManId: '',  // 维修负责人
    actInspectionMan: '',
    limitDate: '',  // 限定期限
    faultTypeId: '',  // 故障类型
    faultTypeName: '',
};

const initState = {
    queryParams: {...initQueryParams},
    currentPage: 1,
    pageSize: 10,
    loading: false,
    dataSource: [],
    total: 0,
    selectedRowKeys: [],
    fileListVersion: 1,
    viewItem: {
        visible: false
    },
    getData: {}, // get 中的数据
    
    modelLonding: false,
    newItem: {...defaultNewItem},
    missionItem: {...defaultMissionItem},
    handleItem: {...defaultHandleItem},
    
    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },
    
    deviceGrade: [],   // 设备等级
    projectName: [],   // 搜索中项目下拉
    structureList: [],  //安装位置
    userInfo: {},
    userList: [],  // 人员树
    projectNameNew: [],   // 新增项目下拉
    
    getViewDateSource: {},  // get中的数据
    
    faultSelectList: [],
    faultSelectTotal: 0,
    faultSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },
};

export default {
    namespace: 'patrolAbnormal',
    
    state: initState,
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, search}) => {
                if (pathname === '/patrolAbnormal') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState,
                        }
                    });
                    Promise.all([
                        dispatch({type: 'getMaintainType'}),
                        dispatch({type: 'getStructureList'}),
                        dispatch({type: 'getUserDetail'}),
                        dispatch({type: 'newprojectSel'}),
                    ]).then(() => {
                        dispatch({type: 'getList'});
                        dispatch({type: 'loadStaffTree'})
                    });
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
                type: 'xjxmType'
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
        
        //新增项目下拉
        * newprojectSel({payload}, {call, put, select}) {
            let params = {
                type: 'xjxmType',
            };
            const {data} = yield call(patrolProjectService.getListSel, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        projectName: data.data,
                        projectNameNew: data.data
                    }
                });
            }
        },
        
        //获取故障类型
        * getFaultList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.patrolAbnormal.faultSelect);
            const {data} = yield call(getFaultList, {
                ...searchParams,
                type: 'faultType',
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        faultSelectList: data.data.rows,
                        faultSelectTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        
        // 设备列表
        * getUpdateDeviceList({payload = {}}, {call, put, select}) {
            const {searchParams} = yield select(state => state.patrolAbnormal.equipmentSelect);
            let {
                newItem
            } = yield select(({patrolAbnormal}) => patrolAbnormal);
            let params = {
                structuresId: newItem.structuresId,
                ...searchParams,
            };
            const {data} = yield call(patrolStandardService.getDevice, params);
            let equipmentSelectList = [], equipmentSelectTotal = 0, status = false;
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    equipmentSelectList = data.data.rows.map(item => ({
                        ...item,
                        key: item.id
                    }));
                    equipmentSelectTotal = data.data.total;
                }
            }
            let uState = {
                equipmentSelectList,
                equipmentSelectTotal,
                addLoading: false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type: 'updateState',
                payload: {...uState}
            })
        },
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
        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const {userInfo} = yield select(state => state.patrolAbnormal);
            const {data} = yield call(loadStaffTreeNew, {
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
        * getList({payload = {}}, {call, put, select}) {
            yield put({type: 'updateState', payload: {loading: true}});
            let {
                pageSize, currentPage, queryParams
            } = yield select(({patrolAbnormal}) => patrolAbnormal);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page: currentPage - 1,
                size: pageSize
            };
            const {data} = yield call(patrolInspectionService.getList, params);
            let dataSource = [], total = 0, status = false;
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data.rows)) {
                    status = true;
                    dataSource = data.data.rows.map(item => ({
                        ...item,
                        key: item.id
                    }));
                    total = data.data.total;
                }
            }
            let uState = {
                dataSource,
                total,
                loading: false
            };
            // 请求成功 更新传入值
            status && (uState = {...uState, ...payload});
            yield put({
                type: 'updateState',
                payload: {...uState}
            })
        },
        
        //get
        * getView({payload}, {call, put, select}) {
            let params = {
                id: payload.id
            };
            const {data} = yield call(patrolInspectionService.getView, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        getViewDateSource: data.data
                    }
                });
            }
        },
        
        // 保存
        * save(action, {select, call, put}) {
            yield put({type: 'updateState', payload: {modelLonding: true}});
            const {newItem} = yield select(({patrolAbnormal}) => patrolAbnormal);
            let {id, structuresId, deviceId, deviceName, grade, itemId, inspectionManId, inspectionMan, inspectionTime, inspectionAbnormal, fileIds} = newItem;
            const params = {
                structuresId,
                deviceId,
                deviceName,
                grade,
                itemId,
                inspectionManId,
                inspectionMan,
                inspectionTime,
                inspectionAbnormal,
                fileIds,
                // fileIds: JSON.stringify(fileIds),
            };
            let {data} = yield call(patrolInspectionService.save, params);
            if (!!data && data.result == 0) {
                // yield put({type:'initParams'});
                yield put({type: 'getList'});
                message.success('新增成功');
            } else {
                message.error(data.msg);
            }
            ;
            yield put({type: 'updateState', payload: {modelLonding: false}});
        },
        
        // 修改
        * update(action, {select, call, put}) {
            yield put({type: 'updateState', payload: {modelLonding: true}});
            const {newItem} = yield select(({patrolAbnormal}) => patrolAbnormal);
            let {id, structuresId, deviceId, deviceName, grade, itemId, inspectionManId, inspectionMan, inspectionTime, inspectionAbnormal, fileIds} = newItem;
            const params = {
                id,
                structuresId,
                deviceId,
                deviceName,
                grade,
                itemId,
                inspectionManId,
                inspectionMan,
                inspectionTime,
                inspectionAbnormal,
                fileIds,
                // fileIds: JSON.stringify(fileIds),
            };
            let {data} = yield call(patrolInspectionService.update, params);
            if (!!data && !data.result) {
                // yield put({type:'initParams'});
                yield put({type: 'getList'});
                message.success('修改成功');
            } else {
                message.error(data.msg);
            }
            ;
            yield put({type: 'updateState', payload: {modelLonding: false}});
        },
        
        // 删除
        * delete({payload}, {call, put, select}) {
            let {ids = []} = payload;
            const params = {
                ids
            };
            const {data} = yield call(patrolInspectionService.delete, params);
            if (!!data && !data.result) {
                yield put({type: 'getList'});
                payload.onSuccess();
            }
            else {
                payload.onError(data ? data.msg : '删除失败');
                // deleteMessage(data);
            }
        },
        
        // 忽略
        * ignore({payload}, {call, put, select}) {
            let {id = []} = payload;
            const params = {
                id
            };
            const {data} = yield call(patrolInspectionService.ignore, params);
            if (!!data && !data.result) {
                yield put({type: 'getList'});
                message.success('忽略成功');
            }
            else {
                payload.onError(data ? data.msg : '忽略失败');
            }
        },
        
        // 生成故障
        * createBreakdown(action, {select, call, put}) {
            yield put({type: 'updateState', payload: {modelLonding: true}});
            const {missionItem, handleItem,} = yield select(({patrolAbnormal}) => patrolAbnormal);
            let {id, enable} = missionItem;
            let {actInspectionManId, actInspectionMan, limitDate, faultTypeId} = handleItem;
            const params = {
                id,
                mergeStatus: enable ? 1 : 0,
                actInspectionManId,
                actInspectionMan,
                limitDate,
                faultTypeId,
            };
            let {data} = yield call(patrolInspectionService.createBreakdown, params);
            if (!!data && data.result == 0) {
                // yield put({type:'initParams'});
                yield put({type: 'getList'});
                message.success('工单生成成功');
            } else {
                message.error(data.msg);
            }
            ;
            yield put({type: 'updateState', payload: {modelLonding: false}});
        },
        
        // get
        * getD({payload}, {call, put, select}) {
            let {id = []} = payload;
            const params = {
                id
            };
            const {data} = yield call(patrolInspectionService.getView, params);
            if (!!data && !data.result) {
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
        updateState(state, action) {
            return {
                ...state,
                ...action.payload,
                
            }
        },
        initParams(state, action) {
            return {
                ...state,
                newItem: {
                    ...defaultNewItem,
                },
                missionItem: {
                    ...defaultMissionItem
                },
                handleItem: {
                    ...defaultHandleItem
                }
            }
        },
        initQueryParams(state, action) {
            return {
                ...state,
                ...action.payload,
                ...initQueryParams,
                currentPage: 1,
                pageSize: 10,
                queryParams: initQueryParams
            }
        },
        updateNewItem(state, action) {
            return {
                ...state,
                newItem: {
                    ...state.newItem,
                    ...action.payload,
                    
                }
            }
        },
        updateMissionItem(state, action) {
            return {
                ...state,
                missionItem: {
                    ...state.missionItem,
                    ...action.payload
                }
            }
        },
        updateHandleItem(state, action) {
            return {
                ...state,
                handleItem: {
                    ...state.handleItem,
                    ...action.payload
                }
            }
        },
        updateViewItem(state, action) {
            return {
                ...state,
                viewItem: {
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
        
        clearFaultSearchParams(state, {payload}) {
            return {
                ...state,
                faultSelect: {
                    ...state.faultSelect,
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    }
                },
            }
        },
        updateFaultSearchParams(state, {payload}) {
            return {
                ...state,
                faultSelect: {
                    ...state.faultSelect,
                    searchParams: {
                        ...state.faultSelect.searchParams,
                        ...payload
                    }
                },
            }
        },
    }
}
