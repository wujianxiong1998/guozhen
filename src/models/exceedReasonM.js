import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, saveOredit, deleteEntity} from '../services/exceedReason';
import {loadCommonParamSelect} from "../services/remoteData";
import {deleteMessage, VtxUtil} from "../utils/util";
import {isAdministrator} from "../services/produtionService";

moment.locale('zh-cn');

export default {
    namespace: 'exceedReasonM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/exceedReason') {
                    dispatch({type: 'loadTargetSmallTypes'});
                    dispatch({type: 'pageList'});
                    // dispatch({type: 'isAdministrator'})
                }
            });
        },
    },
    
    state: {
        isAdministrator: false,
        targetSmallTypes: [],
        gridParams: {
            reason: '',
            page: 0,
            size: 10
        },
        searchParams: {
            reason: '',
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
        //判断是否为管理员
        * isAdministrator({payload}, {call, put, select}) {
            const {data} = yield call(isAdministrator, {
                userId: VtxUtil.getUrlParam('userId')
            });
            if (data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        isAdministrator: data.data
                    }
                })
            }
        },
        //获取指标小类
        * loadTargetSmallTypes({payload}, {call, put, select}) {
            const {data} = yield call(loadCommonParamSelect, {
                type: 'targetSmallType',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        targetSmallTypes: data.data
                    }
                })
            }
        },
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.exceedReasonM);
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
        //新增或编辑
        * saveOredit({payload}, {call, put, select}) {
            const {data} = yield call(saveOredit, {...payload.values});
            if (!!data && data.result === 0) {
                message.success(`${!!payload.id ? '编辑成功' : '新增成功'}`);
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('新增失败，请稍后重试')
            }
        },
        //删除
        * deleteEntity({payload}, {call, put, select}) {
            const {data} = yield call(deleteEntity, {...payload});
            if (!!data && data.result === 0) {
                message.success('删除成功');
                yield put({type: 'pageList'})
            }
            else {
                message.success('删除失败');
                // deleteMessage(data)
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
                    reason: '',
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    reason: '',
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
