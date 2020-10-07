import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, getDetail, addSave, addUpdate, deleteEntity, publish, ignore} from '../services/equipmentFailure';
import {pageList as getEquipmentList} from '../services/accountInformation';
import {pageList as getAddressList} from '../services/buildingInformation';
import {pageList as getFaultList} from '../services/faultType';
import {loadStaffTreeNew, getUserDetail} from "../services/commonIFS";
import {deleteMessage, generateTreeNameData, VtxUtil} from "../utils/util";
import {commonDelete, loadEnum} from "../services/remoteData";

moment.locale('zh-cn');

export default {
    namespace: 'equipmentFailureM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/equipmentFailure') {
                    dispatch({type: 'loadFailureStatus'});
                    dispatch({type: 'getUserDetail'}).then(() => {
                        dispatch({type: 'loadStaffTree'})
                    });
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        userInfo: {},
        userList: [],
        failureStatus: [], //故障状态
        structureList: [], //安装位置
        gridParams: {
            code: '',
            name: '',
            startDay: null,
            endDay: null,
            dataStatus: '',
            page: 0,
            size: 10
        },
        searchParams: {
            code: '',
            name: '',
            startDay: null,
            endDay: null,
            dataStatus: '',
            page: 0,
            size: 10
        },
        addressSelect: {
            searchParams: {
                name: '',
                page: 0,
                size: 10
            }
        },
        equipmentSelect: {
            searchParams: {
                structuresId: '',
                name: '',
                page: 0,
                size: 10
            }
        },
        faultSelect: {
            searchParams: {
                name: '',
                page: 0,
                size: 10
            }
        },
        dataList: [],
        dataTotal: 0,
        addressSelectList: [],
        addressSelectTotal: 0,
        equipmentSelectList: [],
        equipmentSelectTotal: 0,
        faultSelectList: [],
        faultSelectTotal: 0,
        delIds: [],
        modalParams: {
            type: '',
            visible: false,
            title: '',
            detail: {}
        },
        taskId: '',
        taskModalVisible: false
    },
    
    effects: {
        //获取故障状态
        * loadFailureStatus({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'DealSatusEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        failureStatus: data.data
                    }
                })
            }
        },
        //获取安装位置
        * getAddressList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.equipmentFailureM.addressSelect);
            const {data} = yield call(getAddressList, {...searchParams});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        addressSelectList: data.data.rows,
                        addressSelectTotal: data.data.total
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        //获取故障类型
        * getFaultList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.equipmentFailureM.faultSelect);
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
            const {userInfo} = yield select(state => state.equipmentFailureM);
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
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.equipmentFailureM);
            const {data} = yield call(pageList, {
                ...searchParams,
                startDay: !!searchParams.startDay ? searchParams.startDay.format('YYYY-MM-DD') : null,
                endDay: !!searchParams.endDay ? searchParams.endDay.format('YYYY-MM-DD') : null
            });
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
            }
        },
        //获取所属设备列表
        * getEquipmentList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.equipmentFailureM.equipmentSelect);
            if (!searchParams.structuresId) {
                message.info('请先选择安装位置');
                return;
            }
            const {data} = yield call(getEquipmentList, {...searchParams});
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
        //新增
        * addSave({payload}, {call, put, select}) {
            const {data} = yield call(addSave, {...payload.values});
            if (!!data && data.result === 0) {
                message.success('新增成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('新增失败，请稍后重试')
            }
        },
        //编辑
        * addUpdate({payload}, {call, put, select}) {
            const {detail} = yield select(state => state.equipmentFailureM.modalParams);
            const {data} = yield call(addUpdate, {
                id: detail.id,
                ...payload.values,
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
                type: 'deviceFault'
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
        //任务下达
        * publish({payload}, {call, put, select}) {
            const {taskId} = yield select(state => state.equipmentFailureM);
            const {data} = yield call(publish, {
                id: taskId,
                ...payload.values
            });
            if (!!data && data.result === 0) {
                message.success('任务下达成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error(`任务下达失败，请稍后重试`)
            }
        },
        //忽略
        * ignore({payload}, {call, put, select}) {
            const {data} = yield call(ignore, {
                ...payload
            });
            if (!!data && data.result === 0) {
                message.success('忽略成功');
                yield put({type: 'pageList'})
            } else {
                message.error(`忽略失败，请稍后重试`)
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
                    code: '',
                    name: '',
                    startDay: null,
                    endDay: null,
                    dataStatus: '',
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    code: '',
                    name: '',
                    startDay: null,
                    endDay: null,
                    dataStatus: '',
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
                equipmentSelectList: []
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
        updateAddressSearchParams(state, {payload}) {
            return {
                ...state,
                addressSelect: {
                    ...state.addressSelect,
                    searchParams: {
                        ...state.addressSelect.searchParams,
                        ...payload
                    }
                },
            }
        },
        clearAddressSearchParams(state, {payload}) {
            return {
                ...state,
                addressSelect: {
                    ...state.addressSelect,
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
        clearFaultSearchParams(state, {payload}) {
            return {
                ...state,
                faultSelect: {
                    ...state.faultSelect,
                    faultSelect: {
                        name: '',
                        page: 0,
                        size: 10
                    }
                },
            }
        }
    }
}
