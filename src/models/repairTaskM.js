import React from 'react';
import {message} from 'antd';
import moment from 'moment';
import 'moment/locale/zh-cn';
import {pageList, getDetail, publish, audit, deleteEntity} from '../services/repairTask';
import {getUserDetail, loadStaffTreeNew} from "../services/commonIFS";
import {generateTreeNameData, VtxUtil} from "../utils/util";
import {pageList as getSparePartsList} from '../services/spareParts';
import {loadEnum} from "../services/remoteData";

moment.locale('zh-cn');

export default {
    namespace: 'repairTaskM',
    
    subscriptions: {
        setup({dispatch, history}) {
            return history.listen(({pathname}) => {
                if (pathname === '/repairTask') {
                    dispatch({type: 'getUserDetail'}).then(() => {
                        dispatch({type: 'loadStaffTree'})
                    });
                    dispatch({type: 'loadRepairType'});
                    dispatch({type: 'pageList'});
                    if (!!VtxUtil.getUrlParam('id')) {
                        dispatch({
                            type: 'updateModalParams',
                            payload: {
                                type: 'view',
                                title: '维修任务管理>查看'
                            }
                        });
                        dispatch({
                            type: 'getDetail',
                            payload: {id: VtxUtil.getUrlParam('id')}
                        })
                    }
                }
            });
        },
    },
    
    state: {
        userInfo: {},
        userList: [],
        repairType: [], //维修类型
        gridParams: {
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
        },
        sparePartsParams: {
            searchParams: {
                name: '',
                page: 0,
                size: 10
            },
            sparePartsList: [],
            sparePartsTotal: 0,
            sparePartsRows: [],
            sparePartsIds: [],
            sureRows: [],
            modalVisible: false,
            countTotal: null
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
        //获取人员树
        * loadStaffTree({payload}, {call, put, select}) {
            const {userInfo} = yield select(state => state.repairTaskM);
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
        //获取维修类型
        * loadRepairType({payload}, {call, put, select}) {
            const {data} = yield call(loadEnum, {
                enumName: 'RepareTypeEnum',
            });
            if (!!data && !data.result) {
                yield put({
                    type: 'updateState',
                    payload: {
                        repairType: data.data
                    }
                })
            }
        },
        //获取列表
        * pageList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.repairTaskM);
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
                yield put({
                    type: 'updateSparePartsParams',
                    payload: {
                        sureRows: !!data.data.sparePart ? JSON.parse(data.data.sparePart).map(item => {
                            return {
                                ...item,
                                num: Number(item.num),
                                price: Number(item.price),
                                total: Number(item.total)
                            }
                        }) : [],
                        countTotal: data.data.countTotal
                    }
                });
            }
        },
        //回单
        * publish({payload}, {call, put, select}) {
            const {detail} = yield select(state => state.repairTaskM.modalParams);
            const {data} = yield call(publish, {
                id: detail.id,
                ...payload.values
            });
            if (!!data && data.result === 0) {
                message.success('操作成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('操作失败，请稍后重试')
            }
        },
        //审核
        * audit({payload}, {call, put, select}) {
            const {detail} = yield select(state => state.repairTaskM.modalParams);
            const {data} = yield call(audit, {
                id: detail.id,
                ...payload.values
            });
            if (!!data && data.result === 0) {
                message.success('操作成功');
                payload.onComplete();
                yield put({type: 'pageList'})
            } else {
                message.error('操作失败，请稍后重试')
            }
        },
        //删除
        * deleteEntity({payload}, {call, put, select}) {
            const {data} = yield call(deleteEntity, {
                ...payload
            });
            if (!!data && data.result === 0) {
                message.success('删除成功');
                yield put({type: 'pageList'})
            } else {
                message.error(`删除失败,${data.exception}`)
            }
        },
        //获取备品备件列表
        * getSparePartsList({payload}, {call, put, select}) {
            const {searchParams} = yield select(state => state.repairTaskM.sparePartsParams);
            const {data} = yield call(getSparePartsList, {...searchParams});
            if (!!data && data.result === 0) {
                yield put({
                    type: 'updateSparePartsParams',
                    payload: {
                        sparePartsRows: [],
                        sparePartsIds: [],
                        sparePartsList: data.data.rows,
                        sparePartsTotal: data.data.total
                    }
                })
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
                    code: '',
                    name: '',
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
                },
                sparePartsParams: {
                    searchParams: {
                        name: '',
                        page: 0,
                        size: 10
                    },
                    sparePartsList: [],
                    sparePartsTotal: 0,
                    sparePartsRows: [],
                    sparePartsIds: [],
                    sureRows: [],
                    modalVisible: false,
                    countTotal: null
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
        },
        updateSparePartsParams(state, {payload}) {
            return {
                ...state,
                sparePartsParams: {
                    ...state.sparePartsParams,
                    ...payload
                }
            }
        }
    }
}
