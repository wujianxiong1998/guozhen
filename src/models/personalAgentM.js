import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getUnDotingList, getDonetingList} from '../services/personalAgent';
import {VtxUtil} from "../utils/util";

moment.locale('zh-cn');

export default {
    namespace: 'personalAgentM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/personalAgent') {
                    if (!!VtxUtil.getUrlParam('tabKey')) {
                        dispatch({
                            type: 'updateState',
                            payload: {
                                tabKey: VtxUtil.getUrlParam('tabKey')
                            }
                        });
                    }
                    dispatch({type: 'pageList'});
                }
            });
        },
    },
    
    state: {
        gridParams: {
            startTime: null,
            endTime: null,
            page: 0,
            size: 10
        },
        searchParams: {
            startTime: null,
            endTime: null,
            page: 0,
            size: 10
        },
        tabKey: 'undone',
        undoList: [],
        undoListTotal: 0,
        doneList: [],
        doneListTotal: 0
    },
    
    effects: {
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {tabKey, searchParams} = yield select(state => state.personalAgentM);
            const method = tabKey === 'undone' ? getUnDotingList : getDonetingList;
            const {data} = yield call(method, {
                ...searchParams,
                startTime: !!searchParams.startTime ? moment(searchParams.startTime).format('YYYY-MM-DD') : null,
                endTime: !!searchParams.endTime ? moment(searchParams.endTime).format('YYYY-MM-DD') : null
            });
            if (!!data && data.result === 0) {
                if (tabKey === 'undone') {
                    yield put({
                        type: 'updateState',
                        payload: {
                            undoList: data.data.rows,
                            undoListTotal: data.data.total
                        }
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            doneList: data.data.rows,
                            doneListTotal: data.data.total
                        }
                    })
                }
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
                    startTime: null,
                    endTime: null,
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    startTime: null,
                    endTime: null,
                    page: 0,
                    size: 10
                }
            }
        }
    }
}
