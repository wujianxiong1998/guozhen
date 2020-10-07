import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, addSave, addUpdate} from '../services/meetingSummary';

moment.locale('zh-cn');

export default {
    namespace: 'meetingSummaryM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/meetingSummary') {
                    dispatch({type: 'pageList'})
                }
            });
        },
    },
    
    state: {
        detail: {},
        
    },
    
    effects: {
        //获取早会纪要
        * pageList({payload}, {call, put, select}) {
            const {data} = yield call(pageList, {
                startDay: moment().format('YYYY-MM-DD'),
                endDay: moment().format('YYYY-MM-DD'),
                page: 0,
                size: 1
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        detail: data.data.rows[0]
                    }
                })
            } else {
                message.error('获取数据失败，请稍后重试')
            }
        },
        //新增
        * addSave({payload}, {call, put, select}) {
            const {data} = yield call(addSave, {...payload});
            if (!!data && data.result === 0) {
                message.success('新增成功');
                yield put({type: 'pageList'})
            } else {
                message.error('新增失败，请稍后重试')
            }
        },
        //编辑
        * addUpdate({payload}, {call, put, select}) {
            const {data} = yield call(addUpdate, {...payload});
            if (!!data && data.result === 0) {
                message.success('编辑成功');
                yield put({type: 'pageList'})
            } else {
                message.error('编辑失败，请稍后重试')
            }
        }
    },
    
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        }
    }
}
