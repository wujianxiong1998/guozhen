import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {
    deviceUpdateTaskService, deleteService, wheatherAdminByUserIdService,
    BdeviceUpdateTaskService
} from "../services/overHaulService";
import {pageList as getSparePartsList} from '../services/spareParts';
import {commonDelete, loadCommonParamSelect, loadEnum, loadWaterFactorySelect} from "../services/remoteData";
import {message} from 'antd'
import {generateTreeNameData, VtxUtil, deleteMessage, uuid} from "../utils/util";

import {
    pageList,
    nameExist,
    getStructureList,
    addSave,
    getDetail,
    addUpdate,
    deleteEntity,
    getManufacturerList
} from '../services/accountInformation';
import {pageList as getRepairList} from '../services/repairTask';


// 查询条件
let initQueryParams = {
    code: '',  // 设备编号
    name: '',  // 设备名称
    startDay: '',  // 开始时间
    endDay: '',  // 结束时间
};

const defaultNewItem = {
    id: '',
    actMoney: '',  // 实际费用（万元）
    actStartDay: '', // 开始时间
    actEndDay: '', // 结束时间
    actManId: '',  // 执行人id
    actManName: '',  // 执行人name
    details: '',  // 大修改进明细
    picIds11: [],  // 上传文件
    sparePart: '',  //  配件信息
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
    
    modelLonding: false,
    newItem: {...defaultNewItem},
    updataItem: {
        visible: false
    },
    viewItem: {
        visible: false
    },
    checkItem: {
        id: '',
        visible: false,
        auditMemo: '',  // 审核意见
    },
    getData: {}, // get 中的数据
    
    userList: [],  // 人员树
    
    // equipmentSelectList: [],
    // equipmentSelectTotal: 0,
    
    partParams: {
        searchParams: {
            devName: '',
            page: 0,
            size: 10
        },
        partList: [],
        partloading: false,
        partTotal: 0,
        partRows: [],
        partIds: [],
        sureRows: [],
        modalVisible: false,
        countTotal: null
    },
    isShow: true,
    
    numId: '',
    actManId: '',
    Btype: '',
    
    
    // 台账
    userInfo: {},
    waterFactoryList: [], //水厂列表
    equipmentStatus: [], //设备状态
    equipmentTypes: [], //设备类型
    structureList: [],  //安装位置
    equipmentGrades: [], //设备等级
    manufacturerList: [], //生产厂家
    // searchParams: {
    //     waterFactoryId: '',
    //     waterFactoryName: '',
    //     code: '',
    //     name: '',
    //     deviceStatus: '',
    //     page: 0,
    //     size: 10
    // },
    equipmentSelect: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        }
    },
    // dataList: [],
    // dataTotal: 0,
    equipmentSelectList: [],
    equipmentSelectTotal: 0,
    // delIds: [],
    modalParams: {
        type: '',
        visible: false,
        title: '',
        detail: {}
    },
    sparePartsParams: {
        searchParams: {
            name: '',
            page: 0,
            size: 10
        },
        sparePartsList: [],
        sparePartsTotal: 0,
        sparePartsRows: [],
        sparePartsIds: [],
        sureRows: [],
        modalVisible: false
    },
    technicalParameterParams: {
        modalParams: {
            type: '',
            visible: false,
            title: '',
            detail: {}
        },
        technicalParameterList: []
    },
    detailRepair: {
        page: 0,
        size: 10,
        list: [],
        listTotal: 0
    },
    maintainRepair: {
        page: 0,
        size: 10,
        list: [],
        listTotal: 0
    }
    
    
};

export default {
    namespace: 'deviceUpdateMisson',
    
    state: initState,
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname, search}) => {
                if (pathname === '/deviceUpdateMisson') {
                    // 初始化state
                    dispatch({
                        type: 'updateState',
                        payload: {
                            ...initState,
                        }
                    });
                    Promise.all([
                        
                        dispatch({type: 'getUserDetail'}),
                        dispatch({type: 'loadWaterFactorySelect'}),
                        dispatch({type: 'loadEquipmentStatus'}),
                        dispatch({type: 'loadEquipmentTypes'}),
                        dispatch({type: 'loadEquipmentGrades'}),
                        dispatch({type: 'adminByUserId'}),
                    ]).then(() => {
                        dispatch({type: 'getList'});
                        dispatch({type: 'loadStaffTree'});
                    });
                    
                    if (!!VtxUtil.getUrlParam('id')) {
                        dispatch({
                            type: 'getD',
                            payload: {
                                id: VtxUtil.getUrlParam('id')
                            }
                        });
                        dispatch({
                            type: 'BgetD',
                            payload: {
                                id: VtxUtil.getUrlParam('id')
                            }
                        })
                    }
                    
                    
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
        // 获取设备类型
        * loadEquipmentTypes({payload}, {call, put, select}) {
            const {data} = yield call(loadCommonParamSelect, {
                type: 'deviceType',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        equipmentTypes: data.data
                    }
                })
            }
        },
        //获取设备等级
        * loadEquipmentGrades({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DeviceLevelEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        equipmentGrades: data.data
                    }
                })
            }
        },
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
                    yield put({
                        type: 'updateSearchParams',
                        payload: {
                            waterFactoryId: data.data.length !== 0 ? data.data[0].id : '',
                            waterFactoryName: data.data.length !== 0 ? data.data[0].name : ''
                        }
                    });
                    yield put({type: 'pageList'})
                }
            }
        },
        // //名称验重
        // * nameExist({payload}, {call, put, select}) {
        //     const {data} = yield call(nameExist, {...payload});
        //     if (!!data && data.result === 0) {
        //         return data.data
        //     }
        // },
        //获取安装位置
        * getStructureList({payload}, {call, put, select}) {
            const {data} = yield call(getStructureList, {...payload});
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
        //获取所属设备列表
        * getEquipmentList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.deviceUpdateMisson.equipmentSelect);
            const {data} = yield call(pageList, {...searchParams});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        equipmentSelectList: data.data.rows,
                        equipmentSelectTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        //生产厂家查询
        * getManufacturerList({payload}, {call, put, select}) {
            const {data} = yield call(getManufacturerList, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        manufacturerList: data.data
                    }
                })
            }
        },
        //获取备品备件列表
        * getSparePartsList1({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.deviceUpdateMisson.sparePartsParams);
            const {data} = yield call(getSparePartsList, {...searchParams});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateSparePartsParams',
                    payload: {
                        sparePartsRows: [],
                        sparePartsIds: [],
                        sparePartsList: data.data.rows,
                        sparePartsTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        //获取维修信息
        * getRepairList({payload}, {call, put, select}) {
            const {detailRepair} = yield select(state => state.deviceUpdateMisson);
            const params = {
                ...payload,
                page: detailRepair.page,
                size: detailRepair.size
            };
            const {data} = yield call(getRepairList, {...params});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        detailRepair: {
                            page: detailRepair.page,
                            size: detailRepair.size,
                            list: data.data.rows,
                            listTotal: data.data.total
                        }
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        // 获取养护信息
        * getMaintainList({payload = {}}, {call, put, select}) {
            const {maintainRepair} = yield select(state => state.deviceUpdateMisson);
            const params = {
                ...payload,
                page: maintainRepair.page,
                size: maintainRepair.size
            };
            const {data} = yield call(taskService.getList, params);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        maintainRepair: {
                            page: maintainRepair.page,
                            size: maintainRepair.size,
                            list: data.data.rows,
                            listTotal: data.data.total
                        }
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        ///////////////////
        
        // 根据用户id判断是否是管理员
        * adminByUserId({payload}, {call, put, select}) {
            const {data} = yield call(wheatherAdminByUserIdService.adminByUserId);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        isShow: data.data
                    }
                })
            }
        },
        
        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const {userInfo} = yield select(state => state.deviceUpdateMisson);
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
        
        //获取备品备件列表
        * getSparePartsList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.deviceUpdateMisson.partParams);
            const {data} = yield call(getSparePartsList, {...searchParams, name: searchParams.devName});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updatePartParams',
                    payload: {
                        partRows: [],
                        partIds: [],
                        partList: data.data.rows,
                        partTotal: data.data.total
                    }
                });
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        
        // 获取列表
        * getList({payload = {}}, {call, put, select}) {
            yield put({type: 'updateState', payload: {loading: true}});
            let {
                pageSize, currentPage, queryParams
            } = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            currentPage = 'currentPage' in payload ? payload.currentPage : currentPage;
            pageSize = 'pageSize' in payload ? payload.pageSize : pageSize;
            let params = {
                ...queryParams,
                page: currentPage - 1,
                size: pageSize
            };
            const {data} = yield call(deviceUpdateTaskService.getList, params);
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
        
        // 回单
        * update({payload = {}}, {select, call, put}) {
            yield put({type: 'updateState', payload: {modelLonding: true}});
            const {numId, actManId} = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            const params = {
                actManId: actManId,
                ...payload.values,
                id: numId,
                tempDeviceId: numId,
                picIds: payload.values.picIds11,
                // status: payload.status,
                // picIds: newItem.picIds.map(item => item.id).join(','),
                // picIds: payload.values.picIds.length === 0?'':JSON.stringify(payload.values.picIds),
                // sparePart: payload.values.sureRows.length === 0?'':JSON.stringify(payload.values.sureRows.map(item => {
                //     return {
                //         ...item,
                //         num: String(item.num),
                //         price: String(item.price),
                //         total: String(item.total)
                //     }
                
                // })),
                // countTotal: partParams.countTotal,
                userId: VtxUtil.getUrlParam('userId'),
            };
            let {data} = yield call(deviceUpdateTaskService.publish, params);
            if (!!data && data.result == 0) {
                message.success('回单填写提交成功');
                payload.onComplete();
                yield put({type: 'getList'});
                // message.success('编辑成功');
            } else {
                message.error('新增回单失败，请稍后重试')
            }
            ;
            yield put({type: 'updateState', payload: {modelLonding: false}});
        },
        
        //名称验重
        * nameExist({payload}, {call, put, select}) {
            const {data} = yield call(BdeviceUpdateTaskService.Bvalidate, {...payload});
            if (!!data && data.result === 0) {
                return data.data
            }
        },
        
        * BaddSave({payload}, {call, put, select}) {
            // yield put({
            //     type:'updateState',
            //     plyload: {
            //         newInput: {
            //             ...payload.values,
            //         }
            //     }
            // });
            const {numId} = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            const {data} = yield call(BdeviceUpdateTaskService.Bsave, {
                ...payload.values,
                id: numId,
                //  tempDeviceId: uuid,
            });
            if (!!data && data.result === 0) {
                // yield put({type:'update', plyload: {values: {...payload}}});
                message.success('新增台账提交成功');
                //  payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('新增台账失败，请稍后重试')
            }
        },
        * BaddUpdate({payload}, {call, put, select}) {
            const {numId} = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            const {data} = yield call(BdeviceUpdateTaskService.Bupdate, {
                ...payload.values,
                id: numId,
            });
            if (!!data && data.result === 0) {
                // yield put({type:'update', plyload: {values: {...payload}}});
                message.success('更新台账提交成功');
                //  payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('更新台账失败，请稍后重试')
            }
        },
        
        // 删除
        * delete({payload}, {call, put, select}) {
            let {ids = []} = payload;
            const params = {
                ids,
                type: 'updateTask'
            };
            const {data} = yield call(deleteService.delete, params);
            if (!!data && !data.result) {
                yield put({type: 'getList'});
                payload.onSuccess();
            }
            else {
                // payload.onError( data ? data.msg : '删除失败' );
                deleteMessage(data);
            }
        },
        
        // 审核
        * audit({payload = {}}, {select, call, put}) {
            yield put({type: 'updateState', payload: {modelLonding: true}});
            const {checkItem} = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            let {id, auditMemo} = checkItem;
            const params = {
                id,
                auditMemo,
                auditStatus: payload.auditStatus
            };
            let {data} = yield call(deviceUpdateTaskService.audit, params);
            if (!!data && data.result == 0) {
                // yield put({type:'initParams'});
                yield put({type: 'getList'});
                message.success('审核成功');
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
            const {data} = yield call(deviceUpdateTaskService.detail, params);
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        getData: {
                            ...data.data,
                            // sparePart: data.data.sparePart?JSON.parse(data.data.sparePart):[],
                            picIds: data.data.picIds ? JSON.parse(data.data.picIds) : [],
                            // countTotal: data.data.countTotal
                        },
                        Btype: data.data.actMoney ? 'updata' : 'save',
                    }
                })
                return true;
            }
        },
        // get
        * BgetD({payload}, {call, put, select}) {
            let {id = []} = payload;
            const params = {
                id
            };
            const {modalParams} = yield select(({deviceUpdateMisson}) => deviceUpdateMisson);
            const {data} = yield call(BdeviceUpdateTaskService.detail, params);
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        modalParams: {
                            ...modalParams,
                            detail: {
                                ...modalParams.detail,
                                ...data.data,
                                // picIds: data.data.picIds?JSON.parse(data.data.picIds):[],
                                // fileIds: data.data.fileIds?JSON.parse(data.data.fileIds):[],
                            }
                            
                        },
                        // getData: data.data
                    }
                })
                return true;
            }
        }
        
    },
    
    reducers: {
        updateState(state, action) {
            return {
                ...state,
                ...action.payload
            }
        },
        initParams(state, action) {
            return {
                ...state,
                newItem: {
                    ...defaultNewItem,
                    files: [],
                },
                partParams: {
                    searchParams: {
                        devName: '',
                        page: 0,
                        size: 10
                    },
                    partList: [],
                    partloading: false,
                    partTotal: 0,
                    partRows: [],
                    partIds: [],
                    sureRows: [],
                    modalVisible: false,
                    countTotal: null
                },
                checkItem: {
                    id: '',
                    visible: false,
                    auditMemo: '',  // 审核意见
                },
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
                    ...action.payload
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
        
        searchParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    searchParams: {
                        ...state.partParams.searchParams,
                        ...payload
                    },
                }
                
            }
        },
        
        partParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    ...payload
                },
            }
        },
        
        updatePartParams(state, {payload}) {
            return {
                ...state,
                partParams: {
                    ...state.partParams,
                    ...payload
                }
            }
        },
        
        checkItemParams(state, action) {
            return {
                ...state,
                checkItem: {
                    ...state.checkItem,
                    ...action.payload
                }
            }
        },
        // 台账
        updateModalParams(state, {payload}) {
            return {
                ...state,
                modalParams: {
                    ...state.modalParams,
                    ...payload
                }
            }
        },
        clearModalParams(state, {payload}) {
            return {
                ...state,
                modalParams: {
                    type: '',
                    visible: false,
                    title: '',
                    footer: [],
                    detail: {}
                },
                sparePartsParams: {
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    },
                    sparePartsList: [],
                    sparePartsTotal: 0,
                    sparePartsRows: [],
                    sparePartsIds: [],
                    sureRows: [],
                    modalVisible: false
                },
                technicalParameterParams: {
                    modalParams: {
                        type: '',
                        visible: false,
                        title: '',
                        detail: {}
                    },
                    technicalParameterList: []
                },
                detailRepair: {
                    page: 0,
                    size: 10,
                    list: [],
                    listTotal: 0
                },
                maintainRepair: {
                    page: 0,
                    size: 10,
                    list: [],
                    listTotal: 0
                }
            }
        },
        updateDetail(state, {payload}) {
            return {
                ...state,
                modalParams: {
                    ...state.modalParams,
                    detail: {
                        ...state.modalParams.detail,
                        ...payload
                    }
                }
            }
        },
        updateNewPic(state, {payload}) {
            return {
                ...state,
                newItem: {
                    ...state.newItem,
                    detail: {
                        ...state.newItem.detail,
                        ...payload
                    }
                }
            }
        },
        updateSparePartsParams(state, {payload}) {
            return {
                ...state,
                sparePartsParams: {
                    ...state.sparePartsParams,
                    ...payload
                }
            }
        },
        updateTechnicalParameterParams(state, {payload}) {
            return {
                ...state,
                technicalParameterParams: {
                    ...state.technicalParameterParams,
                    ...payload
                }
            }
        }
    }
}
