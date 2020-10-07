import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    getUserRole,
    waterFactory,
    waterFactoryContent,
    getAlarmNum,
    getLineReportByWaterFactoryId,
    getBarReportByWaterFactoryId,
    getWaterFactoryList,
    getTechByWaterFactoryId,
    getMonthDealWaterByWaterFactoryId,
    getUnDoThingByWaterFactoryId,
    getThreeYearsByWaterFactoryId,
    getWorkingStatusByWaterFactoryId,
    exitSys
} from '../services/homePage';
import {pageList as getMeetingSummary} from '../services/meetingSummary';
import {pageListH as getProductionCalendar} from '../services/productionCalendar';
import {pageList as getNewsList} from '../services/newsManage';
import {setCookie} from '../utils/util';

moment.locale('zh-cn');

export default {
    namespace: 'homePageM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/homePage') {
                    dispatch({type: 'getUserRole'}).then(() => {
                        dispatch({type: 'waterFactory'});
                        dispatch({type: 'getThreeYearsByWaterFactoryId'})
                    })
                }
            });
        },
    },
    
    state: {
        depType: 'factory',
        factoryContent: {},
        waterFactoryContent: {},
        calendarData: [],
        hyNewsList: [],
        newsList: [],
        meetingSummary: {},
        tendsTab: '',
        fastTab: 'kjrk',
        alarmData: {},
        pollutionPotencyData: {},
        pollutionTab: 'COD',
        waterFactoryList: [],
        canAuto: 1,
        effluentVolume: {},
        technicalSupportData: {},
        monthlyData: [],
        todoData: {},
        yearDoData: {}
    },
    
    effects: {
        //获取用户信息
        * getUserRole({payload}, {call, put, select}) {
            const {data} = yield call(getUserRole);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        depType: data.data.depType,
                        tendsTab: data.data.depType === 'factory' ? 'hydt' : 'yydt'
                    }
                });
                yield put({type: 'getNewsList'});
                if (data.data.depType !== 'factory') {
                    yield put({type: 'getMonthDealWaterByWaterFactoryId'});
                }
            } else {
                message.error('获取用户信息失败，请稍后再试')
            }
        },
        //WaterworksComponent 内容数据
        * waterFactory({payload}, {call, put, select}) {
            const {depType} = yield select(state => state.homePageM);
            const {data} = yield call(waterFactory, {depType});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        factoryContent: data.data
                    }
                })
            }
            yield put({type: 'waterFactoryContent'});
            yield put({type: 'getThreeYearsByWaterFactoryId'});
            const currentFactoryIds = data.data.factoryId;
            if (!!currentFactoryIds && currentFactoryIds.split(',').length !== 1) {
                yield put({type: 'getWaterFactoryList', payload: {waterFactoryId: currentFactoryIds}})
            } else {
                yield put({
                    type: 'getLineReportByWaterFactoryId',
                    payload: {waterFactoryId: currentFactoryIds.split(',')[0]}
                });
            }
        },
        * waterFactoryContent({payload}, {call, put, select}) {
            const {factoryId: waterFactoryId} = yield select(state => state.homePageM.factoryContent);
            const {data} = yield call(waterFactoryContent, {waterFactoryId});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        waterFactoryContent: data.data
                    }
                })
            }
        },
        //获取门户早会纪要
        * getMeetingSummary({payload}, {call, put, select}) {
            const {data} = yield call(getMeetingSummary, {
                startDay: moment().format('YYYY-MM-DD'),
                endDay: moment().format('YYYY-MM-DD'),
                page: 0,
                size: 1
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        meetingSummary: data.data.rows[0]
                    }
                })
            }
        },
        //获取门户生产日历
        * getProductionCalendar({payload}, {call, put, select}) {
            const {data} = yield call(getProductionCalendar, {
                startDay: moment().startOf('month').format('YYYY-MM-DD'),
                endDay: moment().format('YYYY-MM-DD')
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        calendarData: data.data
                    }
                })
            }
        },
        //获取行业动态
        * getNewsList({payload}, {call, put, select}) {
            const {tendsTab} = yield select(state => state.homePageM);
            const {factoryId: waterFactoryId} = yield select(state => state.homePageM.factoryContent);
            const method = tendsTab === 'hydt' ? getNewsList : getWorkingStatusByWaterFactoryId;
            const {data} = yield call(method, {
                waterFactoryId,
                page: 0,
                rows: 10
            });
            if (!!data && data.result === 0) {
                if (tendsTab === 'hydt') {
                    yield put({
                        type: 'updateState',
                        payload: {
                            hyNewsList: data.data.rows
                        }
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            newsList: data.data.rows
                        }
                    })
                }
            }
        },
        //获取报警信息
        * getAlarmNum({payload}, {call, put, select}) {
            const {data} = yield call(getAlarmNum);
            console.log('data=', data)
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        alarmData: data.data
                    }
                })
            }
        },
        //根据水厂id获取COD,氨氮,TP,TN
        * getLineReportByWaterFactoryId({payload}, {call, put, select}) {
            const {data} = yield call(getLineReportByWaterFactoryId, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        pollutionPotencyData: data.data
                    }
                })
            }
        },
        //根据水厂id获取处理水量和负载率
        * getBarReportByWaterFactoryId({payload}, {call, put, select}) {
            const {data} = yield call(getBarReportByWaterFactoryId, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        effluentVolume: data.data
                    }
                })
            }
        },
        //获取水厂列表
        * getWaterFactoryList({payload}, {call, put, select}) {
            const {data} = yield call(getWaterFactoryList, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        waterFactoryList: data.data
                    }
                })
            }
        },
        //根据用户id获取权限下技术支持
        * getTechByWaterFactoryId({payload}, {call, put, select}) {
            const {data} = yield call(getTechByWaterFactoryId);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        technicalSupportData: data.data
                    }
                })
            }
        },
        //根据水厂ids获取权限下月度污水处理量统计（TOP5）
        * getMonthDealWaterByWaterFactoryId({payload}, {call, put, select}) {
            const {depType} = yield select(state => state.homePageM);
            const {data} = yield call(getMonthDealWaterByWaterFactoryId, {depType});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        monthlyData: data.data
                    }
                })
            }
        },
        //根据用户id获取权限下待办事项
        * getUnDoThingByWaterFactoryId({payload}, {call, put, select}) {
            const {data} = yield call(getUnDoThingByWaterFactoryId);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        todoData: data.data
                    }
                })
            }
        },
        //根据水厂ids获取权限下处理水量圆圈图
        * getThreeYearsByWaterFactoryId({payload}, {call, put, select}) {
            const {factoryId: waterFactoryId} = yield select(state => state.homePageM.factoryContent);
            const {data} = yield call(getThreeYearsByWaterFactoryId, {waterFactoryId});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        yearDoData: data.data
                    }
                })
            }
        },
        //退出登录
        * exitSys({payload}, {call, put, select}) {
            const {data} = yield call(exitSys);
            if (!!data && data.result === 0) {
                const result = JSON.parse(data.responseText);
                if (result.result === 0) {
                    setCookie('rememberMe', 'false', 7);
                    setTimeout(function () {
                        window.location.href = 'http://103.14.132.101:9391/login.html';
                    }, 100);
                } else {
                    message.error('登出失败');
                }
            }
        }
    },
    
    reducers: {
        updateState(state, {payload}) {
            return {...state, ...payload};
        },
    }
}
