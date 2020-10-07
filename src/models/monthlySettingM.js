import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {getTargetLibrarySelect, loadCommonParamSelect, loadWaterFactorySelect} from "../services/remoteData";
import {getOne, saveOredit} from "../services/monthlySetting";

moment.locale('zh-cn');

export default {
    namespace: 'monthlySettingM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/monthlySetting') {
                    dispatch({type: 'loadTargetSmallTypes'});
                    dispatch({type: 'loadBusinessScope'});
                    dispatch({type: 'loadWaterFactorySelect'});
                    dispatch({type: 'getTargetLibrarySelect', payload: {businessId: null}});
                }
            });
        },
    },
    
    state: {
        currentWaterFactoryId: '',
        detailId: '',
        businessScope: [],
        targetSmallTypes: [],
        waterFactoryList: [],
        type: '',
        visible: false,
        libraryListA: [],
        libraryList: [],
        dealWaterTarget: '',
        inWaterTargetSmallType: '',
        outWaterTargetSmallType: '',
        powerConsumeTarget: '',
        consumeTarget: '',
        mudCakeTarget: '',
        moreModalVisible: false,
        drugTableSelectList: [],
        drugSureList: [],
        technologyModalVisible: false,
        moreTableSelectList: [],
        moreType: '',
        biologicalSureList: [],
        biologicalDOSureList: []
    },
    
    effects: {
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
        // //获取业务范围
        * loadBusinessScope({payload}, {call, put, select}) {
            const {data} = yield call(loadCommonParamSelect, {
                type: 'businessScope',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        businessScope: data.data
                    }
                });
                if (data.data.length !== 0) {
                    yield put({type: 'getTargetLibrarySelect', payload: {businessId: data.data[0].id}})
                }
            }
        },
        //获取水厂
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
            if (data.data.length !== 0) {
                yield put({type: 'updateState', payload: {currentWaterFactoryId: data.data[0].id}});
                yield put({type: 'getOne', payload: {waterFactoryId: data.data[0].id}});
            }
        },
        //获取指标库
        * getTargetLibrarySelect({payload}, {call, put, select}) {
            const {data} = yield call(getTargetLibrarySelect, {...payload});
            if (!!data && data.result === 0) {
                if (!!payload.businessId) {
                    yield put({
                        type: 'updateState',
                        payload: {
                            libraryList: data.data
                        }
                    })
                } else {
                    yield put({
                        type: 'updateState',
                        payload: {
                            libraryListA: data.data
                        }
                    })
                }
            }
        },
        //获取月报设置
        * getOne({payload}, {call, put, select}) {
            const {data} = yield call(getOne, {...payload});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateState',
                    payload: {
                        ...data.data,
                        detailId: data.data.id,
                        drugSureList: !!data.data.drugConsumeAndAnalysis ? JSON.parse(data.data.drugConsumeAndAnalysis) : [],
                        biologicalSureList: !!data.data.biologicalMudTarget ? JSON.parse(data.data.biologicalMudTarget) : [],
                        biologicalDOSureList: !!data.data.biologicalDOTarget ? JSON.parse(data.data.biologicalDOTarget) : []
                    }
                })
            }
        },
        //保存或更新
        * saveOredit({payload}, {call, put, select}) {
            const {currentWaterFactoryId, detailId} = yield select(state => state.monthlySettingM);
            const {data} = yield call(saveOredit, {
                ...payload.values,
                id: detailId
            });
            if (!!data && data.result === 0) {
                message.success('保存成功');
                payload.onComplete();
                yield put({type: 'getOne', payload: {waterFactoryId: currentWaterFactoryId}})
            } else {
                message.success('保存失败');
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
