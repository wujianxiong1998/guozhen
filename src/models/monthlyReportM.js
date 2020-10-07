import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {
    pageList,
    wheatherExit,
    getOne,
    getReasonList,
    saveOredit,
    deleteEntity,
    audit,
    getRegionalCompanyList,
    getFactoryListWithRegional
} from '../services/monthlyReport';
import {loadWaterFactorySelect} from "../services/remoteData";
import {deleteMessage, VtxUtil} from "../utils/util";
import {isAdministrator} from "../services/produtionService";

moment.locale('zh-cn');

export default {
    namespace: 'monthlyReportM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/monthlyReport') {
                    dispatch({type: 'getRegionalCompanyList'});
                    dispatch({type: 'loadWaterFactorySelect'});
                    dispatch({type: 'getReasonList'});
                    // dispatch({type: 'isAdministrator'});
                }
            });
        },
    },
    
    state: {
        isAdministrator: false,
        reasonList: [],
        regionalCompanyList: [],
        searchWaterList: [],
        waterFactoryList: [],
        currentWaterFactoryId: '',
        currentDateValue: moment(),
        canSubmit: false,
        gridParams: {
            regionalCompanyId: '',
            waterFactoryId: '',
            dateValue: null,
            page: 0,
            size: 10
        },
        searchParams: {
            regionalCompanyId: '',
            waterFactoryId: '',
            dateValue: null,
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
        },
        initialIndicators: {
            workDayAndStopAnalysis: {},
            dealWaterAnalysis: {},
            waterInOutAnalysis: {},
            powerConsumeAnalysis: {},
            drugConsumeAndAnalysis: '',
            mudCakeAnalysis: {},
            totalContent: {data: []}
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
        //获取区域公司
        * getRegionalCompanyList({payload}, {call, put, select}) {
            const {data} = yield call(getRegionalCompanyList, {
                isControlPermission: 1
            });
            if (!!data && !data.result) {
                if ('data' in data && Array.isArray(data.data)) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            regionalCompanyList: data.data
                        }
                    })
                }
            }
            if (data.data.length !== 0) {
                yield put({
                    type: 'updateGridParams',
                    payload: {
                        regionalCompanyId: data.data[0].id
                    }
                });
                yield put({
                    type: 'updateSearchParams',
                    payload: {
                        regionalCompanyId: data.data[0].id
                    }
                });
                yield put({type: 'getFactoryListWithRegional', payload: {regionalCompanyId: data.data[0].id}})
            }
        },
        //获取水厂(搜索用)
        * getFactoryListWithRegional({payload}, {call, put, select}) {
            const {data} = yield call(getFactoryListWithRegional, {
                isControlPermission: 1,
                regionalCompanyId: payload.regionalCompanyId
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        searchWaterList: data.data
                    }
                });
                if (data.data.length !== 0) {
                    yield put({
                        type: 'updateGridParams',
                        payload: {
                            waterFactoryId: data.data[0].id
                        }
                    });
                    yield put({
                        type: 'updateSearchParams',
                        payload: {
                            waterFactoryId: data.data[0].id
                        }
                    });
                } else {
                    yield put({
                        type: 'updateGridParams',
                        payload: {
                            waterFactoryId: ''
                        }
                    });
                    yield put({
                        type: 'updateSearchParams',
                        payload: {
                            waterFactoryId: ''
                        }
                    });
                }
                yield put({type: 'pageList'})
            }
        },
        //获取水厂(新增用)
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
                if (data.data.length !== 0) {
                    yield put({type: 'updateState', payload: {currentWaterFactoryId: data.data[0].id}});
                }
            }
        },
        //是否可以填报
        * wheatherExit({payload}, {call, put, select}) {
            const {currentWaterFactoryId, currentDateValue} = yield select(state => state.monthlyReportM);
            const {data} = yield call(wheatherExit, {
                dateValue: currentDateValue.format('YYYY-MM'),
                waterFactoryId: currentWaterFactoryId
            });
            if (!!data && data.result === 0) {
                if (!data.data) {
                    message.info('此水厂该月已填报，不能重复填报')
                } else {
                    yield put({type: 'getOne'})
                }
            }
        },
        //获取数据
        * getOne({payload}, {call, put, select}) {
            const {currentWaterFactoryId, currentDateValue} = yield select(state => state.monthlyReportM);
            const {data} = yield call(getOne, {
                dateValue: currentDateValue.format('YYYY-MM'),
                waterFactoryId: currentWaterFactoryId,
                id: !!payload ? payload.id : null
            });
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        initialIndicators: data.data
                    }
                });
                if (!!payload) {
                    yield put({
                        type: 'updateModalParams',
                        payload: {
                            visible: true
                        }
                    })
                }
                if (!!data.data.drugConsumeAndAnalysis) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            canSubmit: data.data
                        }
                    });
                } else {
                    message.info('此水厂月报参数暂未配置，不能填报')
                }
            }
        },
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.monthlyReportM);
            const {data} = yield call(pageList, {
                ...searchParams,
                dateValue: !!searchParams.dateValue ? searchParams.dateValue.format('YYYY-MM') : null
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
        //获取超标原因
        * getReasonList({payload}, {call, put, select}) {
            const {data} = yield call(getReasonList);
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        reasonList: data.data.rows
                    }
                })
            }
        },
        //保存或提交
        * saveOredit({payload}, {call, put, select}) {
            const {initialIndicators} = yield select(state => state.monthlyReportM);
            const {data} = yield call(saveOredit, {
                ...payload.values,
                id: initialIndicators.id || null
            });
            if (!!data && data.result === 0) {
                payload.onComplete()
            } else {
                message.error('操作失败')
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
                deleteMessage(data)
            }
        },
        //审核
        * audit({payload}, {call, put, select}) {
            const {data} = yield call(audit, {...payload.values});
            if (!!data && data.result === 0) {
                payload.onComplete()
            } else {
                message.error('审核失败');
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
                    regionalCompanyId: '',
                    waterFactoryId: '',
                    dateValue: null,
                    page: 0,
                    size: 10
                }
            }
        },
        clearGridParams(state, {payload}) {
            return {
                ...state,
                gridParams: {
                    regionalCompanyId: '',
                    waterFactoryId: '',
                    dateValue: null,
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
