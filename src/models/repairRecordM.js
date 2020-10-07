import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, getDetail, deleteEntity} from '../services/repairRecord';

moment.locale('zh-cn');

export default {
    namespace: 'repairRecordM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/repairRecord') {
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        gridParams:{
            code: '',
            name: '',
            startDay: null,
            endDay: null,
            page: 0,
            size: 10
        },
        searchParams: {
            code: '',
            name: '',
            startDay: null,
            endDay: null,
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
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.repairRecordM);
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
        //获取详情
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
        //删除
        * deleteEntity({payload}, {call, put, select}) {
            const {data} = yield call(deleteEntity, {...payload});
            if (!!data && data.result === 0) {
                message.success('删除成功');
                yield put({type: 'pageList'})
            } else {
                message.error(`删除失败,${data.exception}`)
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
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    code: '',
                    name: '',
                    startDay: null,
                    endDay: null,
                    page: 0,
                    size: 10
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
