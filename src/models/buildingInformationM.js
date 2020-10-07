import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, nameExist, addSave, addUpdate, deleteEntity} from '../services/buildingInformation';
import {getUserDetail} from "../services/commonIFS";
import {deleteMessage, VtxUtil} from "../utils/util";
import {commonDelete, loadWaterFactorySelect} from "../services/remoteData";

moment.locale('zh-cn');

export default {
    namespace: 'buildingInformationM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/buildingInformation') {
                    dispatch({type: 'getUserDetail'});
                    dispatch({type: 'loadWaterFactorySelect'});
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        userInfo: {},
        waterFactoryList: [],
        gridParams: {
            name: '',
            page: 0,
            size: 10
        },
        searchParams: {
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
        // 获取水厂列表
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
                    })
                }
            }
        },
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.buildingInformationM);
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
            const {detail} = yield select(state => state.buildingInformationM.modalParams);
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
                type: 'structureInfo'
            };
            const {data} = yield call(commonDelete, params);
            if (!!data && data.result === 0) {
                message.success('删除成功');
                yield put({type: 'pageList'})
            }
            else {
                deleteMessage(data)
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
        }
    }
}
