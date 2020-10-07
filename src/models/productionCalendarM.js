import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, addSave, addUpdate, deleteEntity} from '../services/productionCalendar';
import {deleteMessage} from "../utils/util";

moment.locale('zh-cn');

export default {
    namespace: 'productionCalendarM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/productionCalendar') {
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        gridParams: {
            title: '',
            startDay: null,
            endDay: null,
            page: 0,
            size: 10
        },
        searchParams: {
            title: '',
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
            const {searchParams} = yield select(state => state.productionCalendarM);
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
        //新增
        * addSave({payload}, {call, put, select}) {
            const day = payload.values.day.format('YYYY-MM-DD');
            delete payload.values.day;
            const {data} = yield call(addSave, {
                ...payload.values,
                day
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
            const {detail} = yield select(state => state.productionCalendarM.modalParams);
            const day = payload.values.day.format('YYYY-MM-DD');
            delete payload.values.day;
            const {data} = yield call(addUpdate, {
                id: detail.id,
                waterFactoryId: detail.waterFactoryId,
                ...payload.values,
                day
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
                ids: payload.ids
            };
            const {data} = yield call(deleteEntity, params);
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
                    title: '',
                    startDay: null,
                    endDay: null,
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    title: '',
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
