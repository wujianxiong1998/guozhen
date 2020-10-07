import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
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
import {pageList as getSparePartsList} from '../services/spareParts';
import {getUserDetail} from "../services/commonIFS";
import {deleteMessage, VtxUtil} from "../utils/util";
import {commonDelete, loadCommonParamSelect, loadEnum, loadWaterFactorySelect} from "../services/remoteData";
import {pageList as getRepairList} from '../services/repairTask';
import {taskService} from "../services/maintainService";

moment.locale('zh-cn');

export default {
    namespace: 'accountInformationM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/accountInformation') {
                    dispatch({type: 'getUserDetail'});
                    dispatch({type: 'loadWaterFactorySelect'});
                    dispatch({type: 'loadEquipmentStatus'});
                    dispatch({type: 'loadEquipmentTypes'});
                    dispatch({type: 'loadEquipmentGrades'});
                }
            });
        },
    },
    
    state: {
        userInfo: {},
        waterFactoryList: [], //水厂列表
        equipmentStatus: [], //设备状态
        equipmentTypes: [], //设备类型
        structureList: [],  //安装位置
        equipmentGrades: [], //设备等级
        manufacturerList: [], //生产厂家
        gridParams: {
            waterFactoryId: '',
            waterFactoryName: '',
            code: '',
            name: '',
            deviceStatus: '',
            page: 0,
            size: 10
        },
        searchParams: {
            waterFactoryId: '',
            waterFactoryName: '',
            code: '',
            name: '',
            deviceStatus: '',
            page: 0,
            size: 10
        },
        equipmentSelect: {
            searchParams: {
                name: '',
                page: 0,
                size: 10
            }
        },
        dataList: [],
        dataTotal: 0,
        equipmentSelectList: [],
        equipmentSelectTotal: 0,
        delIds: [],
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
        // 获取水厂
        * loadWaterFactorySelect({payload}, {call, put, select}) {
            const {data} = yield call(loadWaterFactorySelect, {
                isControlPermission: 1
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateGridParams',
                        payload: {
                            waterFactoryId: data.data.length !== 0 ? data.data[0].id : '',
                            waterFactoryName: data.data.length !== 0 ? data.data[0].name : ''
                        }
                    });
                    const {gridParams, searchParams} = yield select(state => state.accountInformationM);
                    yield put({
                        type: 'updateState',
                        payload: {
                            searchParams: {
                                ...searchParams,
                                ...gridParams
                            },
                            waterFactoryList: data.data
                        }
                    });
                    yield put({type: 'pageList'})
                }
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
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.accountInformationM);
            const {data} = yield call(pageList, {...searchParams});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        delIds: [],
                        dataList: data.data.rows,
                        dataTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        //获取所属设备列表
        * getEquipmentList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.accountInformationM.equipmentSelect);
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
        //名称验重
        * nameExist({payload}, {call, put, select}) {
            const {data} = yield call(nameExist, {...payload});
            if (!!data && data.result === 0) {
                return data.data
            }
        },
        //新增
        * addSave({payload}, {call, put, select}) {
            const {data} = yield call(addSave, {
                ...payload.values,
            });
            if (!!data && data.result === 0) {
                message.success('新增成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('新增失败，请稍后重试')
            }
        },
        //查看详情
        * getDetail({payload}, {call, put, select}) {
            const {data} = yield call(getDetail, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateModalParams',
                    payload: {
                        detail: data.data,
                        visible: true
                    }
                });
                if (!!data.data.sparePartResponseDTOList) {
                    yield put({
                        type: 'updateSparePartsParams',
                        payload: {
                            sureRows: data.data.sparePartResponseDTOList
                        }
                    })
                }
                if (!!data.data.technicalParameters) {
                    yield put({
                        type: 'updateTechnicalParameterParams',
                        payload: {
                            technicalParameterList: JSON.parse(data.data.technicalParameters)
                        }
                    })
                }
                
            }
        },
        //编辑
        * addUpdate({payload}, {call, put, select}) {
            const {detail} = yield select(state => state.accountInformationM.modalParams);
            const {data} = yield call(addUpdate, {
                id: detail.id,
                ...payload.values
            });
            if (!!data && data.result === 0) {
                message.success('编辑成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('编辑失败，请稍后重试')
            }
        },
        //删除
        * deleteEntity({payload}, {call, put, select}) {
            const params = {
                ids: payload.ids,
                type: 'deviceInfo'
            };
            const {data} = yield call(commonDelete, params);
            if (!!data && data.result === 0) {
                message.success('删除成功');
                yield put({type: 'pageList'})
            }
            else {
                deleteMessage(data)
            }
        },
        //获取备品备件列表
        * getSparePartsList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.accountInformationM.sparePartsParams);
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
            const {detailRepair} = yield select(state => state.accountInformationM);
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
            const {maintainRepair} = yield select(state => state.accountInformationM);
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
        }
    },
    
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
        updateGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    ...state.gridParams,
                    ...payload
                }
            }
        },
        updateSearchParams(state, {payload}) {
            return {
                ...state,
                searchParams: {
                    ...state.searchParams,
                    ...payload
                }
            }
        },
        clearSearchParams(state, {payload}) {
            return {
                ...state,
                searchParams: {
                    waterFactoryId: state.waterFactoryList.length !== 0 ? state.waterFactoryList[0].id : '',
                    waterFactoryName: state.waterFactoryList.length !== 0 ? state.waterFactoryList[0].name : '',
                    code: '',
                    name: '',
                    deviceStatus: '',
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    waterFactoryId: state.waterFactoryList.length !== 0 ? state.waterFactoryList[0].id : '',
                    waterFactoryName: state.waterFactoryList.length !== 0 ? state.waterFactoryList[0].name : '',
                    code: '',
                    name: '',
                    deviceStatus: '',
                    page: 0,
                    size: 10
                }
            }
        },
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
