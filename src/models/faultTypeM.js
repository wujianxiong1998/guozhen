import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, nameExist, addSave, addUpdate, deleteEntity} from '../services/faultType';
import {getUserDetail, loadStaffTreeNew} from "../services/commonIFS";
import {deleteMessage, generateTreeNameData, VtxUtil} from "../utils/util";
import {commonDelete, loadCommonParamSelect, loadEnum} from "../services/remoteData";

moment.locale('zh-cn');

export default {
    namespace: 'faultTypeM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/faultType') {
                    dispatch({type: 'loadEquipmentTypes'});
                    dispatch({type: 'getUserDetail'}).then(() => {
                        dispatch({type: 'loadStaffTree'})
                    });
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        failureStatus: [], //故障状态
        equipmentTypes: [], //设备类型
        gridParams: {
            type: 'faultType',
            code: '',
            name: '',
            page: 0,
            size: 10
        },
        searchParams: {
            type: 'faultType',
            code: '',
            name: '',
            page: 0,
            size: 10
        },
        dataList: [],
        dataTotal: 0,
        delIds: [],
        modalParams: {
            type: '',
            visible: false,
            title: '',
            detail: {}
        }
    },
    
    effects: {
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
            const {userInfo} = yield select(state => state.faultTypeM);
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
            const {searchParams} = yield select(state => state.faultTypeM);
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
                type: 'faultType'
            });
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
            const {detail} = yield select(state => state.faultTypeM.modalParams);
            const {data} = yield call(addUpdate, {
                id: detail.id,
                ...payload.values,
                type: 'faultType'
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
                type: 'faultType'
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
                    type: 'faultType',
                    code: '',
                    name: '',
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    type: 'faultType',
                    code: '',
                    name: '',
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
                }
            }
        }
    }
}
